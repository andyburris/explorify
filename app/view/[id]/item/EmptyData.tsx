import { CalloutCard } from "@/app/common/CalloutCard"
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
                    <CalloutCard 
                        leftIcon={cn => <FileDashed className={cn}/>} 
                        rightIcon={<ArrowRight/>} 
                        title="Don’t have your listening history?" 
                        text={<p>Request it from Spotify <u>here</u>. Be sure to request your <strong>extended</strong> listening history.</p>}
                        />
                </a>
                <Link href="/">
                    <CalloutCard 
                        leftIcon={cn => <Upload className={cn}/>} 
                        rightIcon={<ArrowRight/>} 
                        title="Already have your listening history?" 
                        text="Import your .zip file to Quantify!"
                        />
                </Link>
            </div>
        </div>
    )
}