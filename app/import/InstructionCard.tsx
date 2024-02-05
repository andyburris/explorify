import { ArrowRight } from "phosphor-react-sc";
import React from "react";

export function InstructionCard({ stepNumber, link, children }: { stepNumber: number, link?: string, children: React.ReactNode }) {
    return (
        <a href={link} className={"flex flex-col justify-between gap-2 self-stretch p-3 bg-green-50 rounded-2xl flex-grow flex-shrink w-min min-w-[128px] text-green-700" + (link ? " border border-green-300" : "")}>
            <p className="font-serif font-semibold text-2xl tracking-tight">{stepNumber}.</p>
            <div className="flex gap-2 items-end justify-between">
                <p className="flex-shrink">{children}</p>
                { link && <ArrowRight className="flex-shrink-0"/> }
            </div>
        </a>
    )
}