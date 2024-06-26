import { Binoculars } from "phosphor-react-sc";
import { PickedIcon } from "./PickedIcon";

export function Logo() {
    return (
        <div className="w-8 h-8 flex flex-shrink-0 items-center justify-center bg-green-600 text-white rounded-lg nightwind-prevent nightwind-prevent-block">
            <Binoculars weight="duotone" size="24px"/>
        </div>
    )
}

export function IconLogoStatic({ icon }: { icon: React.ReactNode }) {
    return (
        <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-lg text-2xl nightwind-prevent nightwind-prevent-block">
            {icon}
        </div>
    )
}

export function IconLogo({ iconName }: { iconName: string }) {
    return (
        <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-lg text-2xl nightwind-prevent nightwind-prevent-block">
            <PickedIcon iconName={iconName} weight="duotone"/>
        </div>
    )
}