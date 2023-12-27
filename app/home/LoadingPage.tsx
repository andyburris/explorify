import { DotsThreeVertical, ArrowCounterClockwise, Moon } from "phosphor-react-sc";
import { Container } from "../common/Container";
import { Dropdown } from "../common/Dropdown";
import { Header } from "../common/Header";
import { Logo } from "../common/Logo";
import { StaticButton } from "../common/button/Button";
import nightwindHelper from "nightwind/helper";
import { getPresets } from "../data/persist/PresetRepository";

export function LoadingPage() {
    const numSavedPresets = getPresets().length
    const numPresets = numSavedPresets > 0 ? numSavedPresets + 1 : 5
    return (
        <Container>
            <Header
                icon={<Logo/>}
                title="Quantize"
                // description="by Lyrical"
                actions={
                    <div className="flex gap-3">
                        <div className="px-3 py-2 text-neutral-500 border border-neutral-200 rounded-full">
                            <p>Loading...</p>
                        </div>
                        <Dropdown
                            trigger={<StaticButton text={undefined} icon={<DotsThreeVertical size="24px"/>}/>}
                            menuItems={[
                                {
                                    icon: <Moon size="24px"/>,
                                    title: "Toggle dark mode",
                                    onClick: () => nightwindHelper.toggle()
                                },
                            ]}
                        />
                    </div>
                }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                { Array.from(Array(numPresets).keys()).map((i) => { 
                    return <div className="bg-neutral-100 rounded-2xl w-full h-72" key={i}></div>
                })}
            </div>
        </Container>
    )
}