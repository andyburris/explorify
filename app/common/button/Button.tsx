import Link from "next/link"

export function buttonClassName(iconOnly: boolean, className?: string): string {
    return "flex justify-center items-center gap-2 h-10 text-slate-500 hover:text-slate-900 rounded-full shadow-outset"
         + (iconOnly ? ` w-10` : ` px-4`) 
         + (className ? ` ${className}` : "")
}

export function Button({ link, text, icon, className, openInNewTab }: { link: string, text?: string, icon?: React.ReactNode, className?: string, openInNewTab?: boolean }) {
    return (
        <a 
        href={link}
        target={openInNewTab != false ? "_blank" : ""}
        className={buttonClassName(text === undefined, className)}>
            {icon && icon}
            {text && (<span className="text-base">{text}</span>)}
        </a>
    )
}

export function LinkButton({ linkPath, text, icon, className }: { linkPath: string, text?: string, icon?: React.ReactNode, className?: string }) {
    return (
        <Link
        href={linkPath}
        className={buttonClassName(text === undefined, className)}>
            {icon && icon}
            {text && (<span className="text-base">{text}</span>)}
        </Link>
    )
}

export function StaticButton({ text, icon, className }: { text?: string, icon?: React.ReactNode, className?: string }) {
    return (
        <a 
        className={buttonClassName(text === undefined, className) + " cursor-pointer"}>
            {icon && icon}
            {text && (<span className="text-base">{text}</span>)}
        </a>
    )
}