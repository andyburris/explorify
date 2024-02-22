import React from "react";

export function CalloutCard({ title, text, leftIcon, rightIcon, noHover, className }: { title?: string, text: string | React.ReactNode, leftIcon?: (className: string) => React.ReactNode, rightIcon?: React.ReactNode, noHover?: boolean, className?: string }) {
    return (
        <div className={"flex p-4 gap-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 transition-colors " + (!noHover ? "hover:bg-green-100 " : "") + (className ? className : "")}>
            { (leftIcon && !title) && 
                <div className="flex-shrink-0">
                    {leftIcon("text-2xl")}
                </div>
            }
            <div className="flex flex-col gap-1 w-full">
                { title && 
                    <p className="text-green-900 font-serif text-2xl font-semibold tracking-tight w-full">
                        { leftIcon && <span className="">{leftIcon("inline mb-1 mr-1.5 text-xl")}</span> }
                        {title}
                    </p>
                }
                { (typeof(text) === "string") 
                    ? <p>{text}</p>
                    : text }
                
            </div>
            {rightIcon &&            
                <div className="flex-shrink-0 text-2xl">
                    {rightIcon}
                </div>
            }
        </div>
    )
}