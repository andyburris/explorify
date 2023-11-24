import { ArrowCounterClockwise, DotsThreeVertical, Moon } from "phosphor-react-sc";
import { Container } from "../common/Container";
import { Header } from "../common/Header";
import { Logo } from "../common/Logo";
import { ActionButton } from "../common/button/ActionButton";
import { Button, StaticButton } from "../common/button/Button";
import { HistoryEntry } from "../data/model/HistoryEntry";
import { Dropdown } from "../common/Dropdown";
import { defaultPresets } from "../data/Defaults";
import { PresetPreview } from "./PresetPreview";
import nightwind from "nightwind/helper"

export function HomePage({ listens, onClear }: { listens: HistoryEntry[], onClear: () => void }) {
    return (
        <Container>
            <Header
                icon={<Logo/>}
                title="Spotify Data Explorer"
                // description="by Lyrical"
                actions={
                    <div className="flex gap-3">
                        <div className="px-3 py-2 text-neutral-500 border border-neutral-200 rounded-full">
                            <p>{`${listens.length.toLocaleString()} play${listens.length == 0 ? "" : "s"}`}</p>
                        </div>
                        <Dropdown
                            trigger={<StaticButton text={undefined} icon={<DotsThreeVertical size="24px"/>}/>}
                            menuItems={[
                                {
                                    icon: <ArrowCounterClockwise size="24px"/>,
                                    title: "Upload new listens",
                                    onClick: () => onClear()
                                },
                                {
                                    icon: <Moon size="24px"/>,
                                    title: "Toggle dark mode",
                                    onClick: () => nightwind.toggle()
                                }
                            ]}
                        />
                    </div>
                }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {defaultPresets.map((preset) => <PresetPreview key={preset.name} preset={preset} listens={listens} />)}
            </div>
        </Container>
    )
}