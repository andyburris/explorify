import { ArrowRight } from "phosphor-react-sc";
import React from "react";

export function InstructionCard({ stepNumber, link, widget, children }: { stepNumber: number, link?: string, widget?: React.ReactNode, children: React.ReactNode }) {
    return (
        <a href={link} target="_blank" className={"flex flex-col justify-between gap-2 self-stretch p-3 bg-green-50 rounded-2xl flex-grow flex-shrink w-min min-w-[128px] text-green-700" + (link ? " border border-green-300 hover:bg-green-100" : "")}>
            <div className="flex justify-between">
                <p className="font-serif font-semibold text-2xl tracking-tight">{stepNumber}.</p>
                { widget && widget }
            </div>
            <div className="flex gap-2 items-end justify-between">
                <p className={"flex-shrink " + (link ? "underline" : "")}>{children}</p>
                { link && <ArrowRight className="flex-shrink-0"/> }
            </div>
        </a>
    )
}