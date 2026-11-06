import { Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'

function AboutCard() {
    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <Info className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">About NEETBIO</h2>
                    <p className="text-ink-700 text-sm">Version 0.1.0 – frontend preview with sample data.</p>
                </div>
            </div>

            <p className="text-ink-700 mt-3 text-sm">
                NEETBIO is a free, AI-powered platform to learn, explore and practice Biology diagrams for NEET aspirants.
            </p>
            <Link to="/" className="text-brand-orange mt-3 inline-block text-sm font-bold hover:underline">
                Visit the home page
            </Link>
        </Card>
    )
}

export default AboutCard