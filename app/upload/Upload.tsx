import { FileArchive, FileZip, Upload } from "phosphor-react-sc"
import { Button } from "../common/button/Button"
import { Container } from "../common/Container"
import { Logo } from "../common/Logo"
import { Switch } from "../common/Switch"

export function UploadPage() {
    return (
        <Container>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <Logo/>
                    <div className="flex flex-col gap-2">
                        <p className="text-5xl/[50px] font-serif font-semibold">Spotify Data Explorer</p>
                        <p className="text-stone-500">by Lyrical</p>
                    </div>
                </div>
                <p>Don’t have your extended data yet? Go to <a href="https://www.spotify.com/us/account/privacy/" target="_blank">https://www.spotify.com/us/account/privacy/</a> and request your extended streaming history. It usually takes ~2 weeks to receive your data.</p>
            </div>
            <input type="file" id="file-upload" className="hidden"></input>
            <label htmlFor="file-upload" className="flex flex-col gap-4 items-center justify-center p-8 border-dashed border border-stone-300 rounded-xl">
                <FileArchive size="40px" className="text-stone-500"/>
                <p>Drag and drop or click to upload the exported .zip file</p>
            </label>
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <p>Remember streaming history</p>
                    <p className="text-stone-500">This stays on your device, and is never uploaded to any servers</p>
                </div>
                <Switch/>
            </div>
            <Button text="Process" icon={<Upload/>} link="" className="w-fit"/>
        </Container>
    )
}

