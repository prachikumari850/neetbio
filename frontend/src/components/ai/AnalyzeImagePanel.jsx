import { useEffect, useRef, useState } from 'react'
import { ImageUp, Sparkles, Square, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import AiStatusNotice from '@/components/ai/AiStatusNotice'
import Button from '@/components/common/Button'
import { streamAnalysis } from '@/services/aiService'
import { cx } from '@/utils/classNames'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = {
    'image/png': [],
    'image/jpeg': [],
    'image/webp': [],
}

const resultClasses =
    'bg-brand-purple-soft/60 rounded-2xl px-4 py-3 text-sm break-words [&_li]:mb-1 [&_p]:mb-2 [&_strong]:font-bold [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&>*:last-child]:mb-0'

function AnalyzeImagePanel() {
    const [selected, setSelected] = useState(null)
    const [question, setQuestion] = useState('')
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const abortRef = useRef(null)

    useEffect(() => () => abortRef.current?.abort(), [])

    useEffect(() => {
        return () => {
            if (selected) {
                URL.revokeObjectURL(selected.url)
            }
        }
    }, [selected])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: ACCEPTED_TYPES,
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        disabled: isRunning,
        onDropAccepted: ([file]) => {
            setSelected({ file, url: URL.createObjectURL(file) })
            setResult('')
            setError('')
        },
        onDropRejected: () => toast.error('Choose one PNG, JPEG or WEBP image under 5 MB.'),
    })

    const clearImage = () => {
        abortRef.current?.abort()
        setSelected(null)
        setResult('')
        setError('')
    }

    const analyze = async () => {
        const controller = new AbortController()
        let isDone = false

        abortRef.current = controller
        setResult('')
        setError('')
        setIsRunning(true)

        try {
            await streamAnalysis({
                image: selected.file,
                question: question.trim(),
                signal: controller.signal,
                onEvent: (event) => {
                    if (event.type === 'token') {
                        setResult((current) => current + event.text)
                    } else if (event.type === 'error') {
                        throw new Error(event.message)
                    } else if (event.type === 'done') {
                        isDone = true
                    }
                },
            })

            if (!isDone) {
                throw new Error('The analysis was interrupted. Please try again.')
            }
        } catch (analysisError) {
            if (!controller.signal.aborted) {
                setResult('')
                setError(analysisError.message)
            }
        } finally {
            abortRef.current = null
            setIsRunning(false)
        }
    }

    return (
        <div className="space-y-4">
            <AiStatusNotice feature="vision" />

            {selected ? (
                <div className="border-line relative rounded-2xl border bg-white p-3">
                    <button
                        type="button"
                        aria-label="Remove image"
                        onClick={clearImage}
                        className="bg-brand-purple-soft absolute top-3 right-3 rounded-full p-1.5"
                    >
                        <X className="size-4" />
                    </button>
                    <img
                        src={selected.url}
                        alt="Selected for analysis"
                        className="mx-auto max-h-72 object-contain"
                    />
                    <p className="text-ink-500 mt-2 text-center text-xs break-all">{selected.file.name}</p>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cx(
                        'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-14 text-center',
                        isDragActive ? 'border-brand-purple bg-brand-purple-soft' : 'border-line bg-white',
                    )}
                >
                    <input {...getInputProps()} />
                    <ImageUp className="text-brand-purple size-10" />
                    <p className="font-bold">Drop a Biology image here, or click to browse</p>
                    <p className="text-ink-500 text-xs">PNG, JPG or WEBP up to 5 MB</p>
                </div>
            )}

            <div>
                <label htmlFor="analysis-question" className="mb-1 block text-sm font-bold">
                    Question about the image (optional)
                </label>
                <input
                    id="analysis-question"
                    type="text"
                    value={question}
                    maxLength={500}
                    disabled={isRunning}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Explain this image in detail."
                    className="border-line focus:ring-brand-purple/40 w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2"
                />
            </div>

            {isRunning ? (
                <Button variant="outline" onClick={() => abortRef.current?.abort()} className="w-full">
                    <Square className="size-4 fill-current" />
                    Stop
                </Button>
            ) : (
                <Button onClick={analyze} disabled={!selected} className="w-full">
                    <Sparkles className="size-5" />
                    Analyze Image
                </Button>
            )}

            {isRunning && !result && (
                <p className="text-ink-500 text-center text-sm">
                    Reading the image. On a laptop without a graphics card the first words can take a minute or more.
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    className="bg-danger-soft text-danger rounded-xl px-4 py-3 text-sm font-semibold"
                >
                    {error}
                </p>
            )}

            {result && (
                <div className={resultClasses}>
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            )}

            <p className="text-ink-500 text-center text-xs">
                Your image is analyzed by a small AI model on your computer and is not saved. It can
                misread labels, so check important facts in your NCERT textbook.
            </p>
        </div>
    )
}

export default AnalyzeImagePanel