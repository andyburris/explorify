import Link from "next/link"

export function buttonClassName(iconOnly: boolean, hasShadow: boolean, className?: string): string {
    return "flex justify-center items-center gap-2 h-10 text-neutral-500 hover:text-neutral-900 rounded-full"
        + (hasShadow ? " shadow-outset" : "")
        + (iconOnly ? ` w-10` : ` px-4`) 
        + (className ? ` ${className}` : "")
}

export function Button({ link, text, icon, className, openInNewTab }: { link: string, text?: string, icon?: React.ReactNode, className?: string, openInNewTab?: boolean }) {
    return (
        <a 
        href={link}
        target={openInNewTab != false ? "_blank" : ""}
        className={buttonClassName(text === undefined, true, className)}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </a>
    )
}

export function LinkButton({ linkPath, text, icon, className, hideShadow }: { linkPath: string, text?: string, icon?: React.ReactNode, className?: string, hideShadow?: boolean, }) {
    return (
        <Link
        href={linkPath}
        className={buttonClassName(text === undefined, !(hideShadow ?? false), className)}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </Link>
    )
}

export function StaticButton({ text, icon, className, hideShadow }: { text?: string, icon?: React.ReactNode, className?: string, hideShadow?: boolean, }) {
    return (
        <a 
        className={buttonClassName(text === undefined, !(hideShadow ?? false), className) + " cursor-pointer"}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </a>
    )
}