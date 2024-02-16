import Link from "next/link"
import { ArrowRight, FileDashed, MusicNotesPlus, Upload } from "phosphor-react-sc"

export function EmptyData() {
    return (
        <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white shadow-outset">
            <div className="flex flex-col gap-4">
                <MusicNotesPlus weight="duotone" className="text-neutral-500 text-3xl"/>
                <div className="flex flex-col">
                    <p className="font-serif font-semibold text-3xl tracking-tight">You haven’t imported your listens yet</p>
                    <p className="text-neutral-500">To explore your listening history in Quantify, you need to request and download your extended listening history from Spotify. It takes ~2 weeks to receive your data.</p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <a href="https://www.spotify.com/us/account/privacy/" target="_blank">
                    <EmptyDataButton icon={<FileDashed/>} title="Don’t have your listening history?" description={<p>Request it from Spotify <u>here</u>. Be sure to request your <strong>extended</strong> listening history.</p>}/>
                </a>
                <Link href="/">
                    <EmptyDataButton icon={<Upload/>} title="Already have your listening history?" description={<p>Import your .zip file to Quantify!</p>}/>
                </Link>
            </div>
        </div>
    )
}
function EmptyDataButton({ icon, title, description }: { icon: React.ReactNode, title: string, description: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl text-green-700 cursor-pointer">
            <div className="flex-shrink-0">{icon}</div>
            <div className="text-green-900 flex-shrink w-full">
                <p className="font-serif font-semibold text-2xl tracking-tight">{title}</p>
                {description}
            </div>
            <ArrowRight className="flex-shrink-0" />
        </div>
    )
}