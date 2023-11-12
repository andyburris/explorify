import { Binoculars } from "phosphor-react-sc";
import { PickedIcon } from "./PickedIcon";

export function Logo() {
    return (
        <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-lg">
            <Binoculars weight="duotone" size="24px"/>
        </div>
    )
}

export function IconLogo({ iconName }: { iconName: string }) {
    return (
        <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-lg text-2xl">
            <PickedIcon iconName={iconName} weight="duotone"/>
        </div>
    )
}