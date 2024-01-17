"use client"

import { ButtonProps, buttonClassName } from "./Button"

export interface ActionButtonProps extends ButtonProps { onClick: () => void, }
export function ActionButton(props: ActionButtonProps) {
    const { onClick, text, icon, className, hideShadow, enabled } = props
    return (
        <a 
        onClick={() => { 
            if(enabled ?? true) { onClick() } }
         }
        className={buttonClassName(props)}>
            {icon && icon}
            {text && (<span className="text-base font-medium">{text}</span>)}
        </a>
    )
}