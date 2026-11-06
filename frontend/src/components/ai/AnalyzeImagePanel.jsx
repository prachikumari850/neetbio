import { useEffect, useState } from 'react'
import { ImageUp, LoaderCircle, Sparkles, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import Button from '@/components/common/Button'
import { buildImageAnalysis } from '@/utils/aiSimulator'
import { cx } from '@/utils/classNames'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ANALYSIS_DELAY_MS = 1200

function AnalyzeImagePanel() {
    const [selected, setSelected] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState('')

    useEffect(() => {
        return () => {
            if (selected) {
                URL.revokeObjectURL(selected.url)
            }
        }
    }, [selected])

    useEffect(() => {
        if (!isAnalyzing || !selected) {
            return
        }

        const timer = setTimeout(() => {
            setAnalysis(buildImageAnalysis(selected.file.name))
            setIsAnalyzing(false)
        }, ANALYSIS_DELAY_MS)

        return () => clearTimeout(timer)
    }, [isAnalyzing, selected])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        onDropAccepted: ([file]) => {
            setSelected({ file, url: URL.createObjectURL(file) })
            setAnalysis('')
        },
        onDropRejected: () => toast.error('Choose one image file under 5 MB.'),
    })

    const clearImage = () => {
        setSelected(null)
        setAnalysis('')
        setIsAnalyzing(false)
    }

    return (
        <div className="space-y-4">
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
                    <p className="text-ink-500 mt-2 text-center text-xs">{selected.file.name}</p>
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

            <Button
                onClick={() => setIsAnalyzing(true)}
                disabled={!selected || isAnalyzing}
                className="w-full"
            >
                {isAnalyzing ? (
                    <LoaderCircle className="size-5 animate-spin" />
                ) : (
                    <Sparkles className="size-5" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </Button>

            {analysis && (
                <div className="bg-brand-purple-soft/60 space-y-2 rounded-2xl px-4 py-3 text-sm [&_li]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}
        </div>
    )
}

export default AnalyzeImagePanel