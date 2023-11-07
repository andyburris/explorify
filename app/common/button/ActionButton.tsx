"use client"

import { buttonClassName } from "./Button"

export function ActionButton({ onClick, text, icon, className }: { onClick: () => void, text?: string, icon?: React.ReactNode, className?: string }) {
    return (
        <a 
        onClick={() => onClick()}
        className={buttonClassName(className)}>
            {icon && icon}
            {text && (<span className="">{text}</span>)}
        </a>
    )
}