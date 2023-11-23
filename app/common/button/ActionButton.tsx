"use client"

import { ButtonProps, buttonClassName } from "./Button"

export interface ActionButtonProps extends ButtonProps { onClick: () => void, }
export function ActionButton(props: ActionButtonProps) {
    const { onClick, text, icon, className, hideShadow } = props
    return (
        <a 
        onClick={() => onClick()}
        className={buttonClassName(props)+ " cursor-pointer"}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </a>
    )
}