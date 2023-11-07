import Link from "next/link"

export function buttonClassName(className?: string): string {
    return "flex px-4 items-center gap-2 h-10 text-md text-slate-500 hover:text-slate-900 rounded-full shadow-outset" + (className ? ` ${className}` : "")
}

export function Button({ link, text, icon, className, openInNewTab }: { link: string, text?: string, icon?: React.ReactNode, className?: string, openInNewTab?: boolean }) {
    return (
        <a 
        href={link}
        target={openInNewTab != false ? "_blank" : ""}
        className={buttonClassName(className)}>
            {icon && icon}
            {text && (<span className="">{text}</span>)}
        </a>
    )
}

export function LinkButton({ linkPath, text, icon, className }: { linkPath: string, text?: string, icon?: React.ReactNode, className?: string }) {
    return (
        <Link
        href={linkPath}
        className={buttonClassName(className)}>
            {icon && icon}
            {text && (<span className="">{text}</span>)}
        </Link>
    )
}