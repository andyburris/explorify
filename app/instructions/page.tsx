import { ArrowLeft, ListNumbers } from "phosphor-react-sc";
import { Container } from "../common/Container";
import { Header } from "../common/Header";
import { IconLogoStatic } from "../common/Logo";
import { LinkButton } from "../common/button/Button";
import { Instructions } from "./Instructions";

export default function InstructionsPage() {
    return (
        <Container>
            <div className="flex flex-col gap-8">
                <div className="w-full flex -ml-4 -mb-8">
                    <LinkButton linkPath="/" text="Home" icon={<ArrowLeft/>} hideShadow/>
                </div>
                <Header 
                    icon={<IconLogoStatic icon={<ListNumbers weight="duotone"/>}/>} 
                    title="Instructions" 
                    description="Spotify lets you export a file that records every time you've streamed a song. In order to use Explorify, you need that file. The export process is a little complicated, but these instructions will walk you through it, and get you exploring your listening as soon as possible!"
                />
                <Instructions/>
            </div>
        </Container>
    )
}