import Link from "next/link"

export interface ButtonProps {
    text?: string, icon?: React.ReactNode, enabled?: boolean, className?: string, hideShadow?: boolean,
}
export function buttonClassName(props: ButtonProps): string {
    const hasShadow = !(props.hideShadow ?? false)
    const iconOnly = props.icon !== undefined && props.text === undefined
    const enabled = props.enabled ?? true
    return "flex justify-center items-center gap-2 h-10 text-neutral-500 hover:text-neutral-900 rounded-full transition-all"
        + (hasShadow ? " shadow-outset hover:shadow-outsetHover dark:bg-neutral-100" : " hover:bg-neutral-100")
        // + (hasShadow ? " relative bg-white after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-r after:from-green-400 after:to-green-600 after:blur-sm after:rounded-full after:opacity-0 hover:after:opacity-40 hover:focus:after:opacity-50 after:transition-all after:duration-200 hover:shadow-outsetHover" : "")
        // + (hasShadow ? " shadow-outset dark:bg-neutral-100" : " hover:bg-neutral-100 dark:hover:bg-neutral-200") //TODO: figure out how to get dark to work for nightwind and not system
        + (iconOnly ? ` w-10 text-2xl` : ` px-4`) 
        + (enabled ? ` cursor-pointer` : ` opacity-50 cursor-not-allowed`)
        + (props.className ? ` ${props.className}` : "")
}

export interface AnchorButtonProps extends ButtonProps { link: string, openInNewTab?: boolean }
export function Button(props: AnchorButtonProps) {
    const { link, text, icon, openInNewTab } = props
    return (
        <a 
        href={link}
        target={openInNewTab != false ? "_blank" : ""}
        className={buttonClassName(props)}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </a>
    )
}

export interface LinkButtonProps extends ButtonProps { linkPath: string }
export function LinkButton(props: LinkButtonProps) {
    const { linkPath, text, icon } = props
    return (
        <Link
        href={linkPath}
        className={buttonClassName(props)}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </Link>
    )
}

export function StaticButton(props: ButtonProps) {
    const { text, icon } = props
    return (
        <div 
        className={buttonClassName(props) + " cursor-pointer"}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </div>
    )
}