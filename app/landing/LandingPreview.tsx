"use client"

import { useState } from "react"
import { PickedIcon } from "../common/PickedIcon"
import { Preset } from "../data/model/Preset"
import { Play } from "phosphor-react-sc"
import { defaultPresets } from "../data/Defaults"

export function LandingPreview({ overlayContent, className }: { overlayContent: React.ReactNode, className?: string }) {
    return (
        <div className={"relative -mx-4 -mt-4 h-[calc(100vh-156px)] max-h-[712px] overflow-hidden " + (className ? className : "")}>
            <div className=" absolute w-full bottom-0">
                <div className="h-32 bg-gradient-to-t from-white to-transparent w-full px-4"></div>
                <div className="bg-white w-full px-4">
                    {overlayContent}
                </div>
            </div>
            <div className="px-4 pt-4">
                <PresetScreenPreview/>
            </div>
        </div>
    )
}

export function PresetScreenPreview({  }: {  }) {
    const [currentPreset, setCurrentPreset] = useState(defaultPresets[0])
    const nextPreset = defaultPresets.filter(p => p.id != currentPreset.id)[Math.floor(Math.random() * (defaultPresets.length - 1))]

    return (
        <div className="flex flex-col gap-8 shadow-outset rounded-3xl p-6 pt-12">
            <div className="flex flex-col items-start gap-4">
                <Switcher
                    current={<PickedIcon iconName={currentPreset.icon} weight="duotone" className="text-2xl text-green-700"/>}
                    next={<PickedIcon iconName={nextPreset.icon} weight="duotone"/>}
                    onSwitch={() => setCurrentPreset(nextPreset)}/>
                <div className="flex flex-col gap-1 items-start">                    
                    <Switcher
                        current={<p className="font-serif font-semibold text-3xl tracking-tight text-green-900">{currentPreset.name}</p>}
                        next={<p className="font-serif font-semibold text-3xl tracking-tight text-green-900">{nextPreset.name}</p>}
                        onSwitch={() => setCurrentPreset(nextPreset)}
                        className="px-2"/>
                    <Switcher
                        current={<p className="text-green-700">{currentPreset.description}</p>}
                        next={<p className="text-green-700">{nextPreset.description}</p>}
                        onSwitch={() => setCurrentPreset(nextPreset)}
                        className="px-2"/>
                </div>
            </div>
            <div className="flex flex-col items-start gap-4">
                <p className="font-semibold text-neutral-500">All Time</p>
                { Array.from(Array(5).keys()).map(i => <PreviewListItem key={i} index={i}/>) }
            </div>
        </div>
    )
}

function Switcher({ current, next, className, onSwitch }: { current: React.ReactNode, next: React.ReactNode, className?: string, onSwitch: () => void }) {
    return(
        <div 
            className={"flex items-center justify-center p-1 bg-green-50 border border-green-200 rounded-lg cursor-pointer " + (className ? className : "")}
            onClick={() => onSwitch()}>
            <div className=" transition-transform translate-y">
                {current}
            </div>
        </div>
    )
}

function PreviewListItem({ index }: { index: number }) {
    return (
        <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-lg text-neutral-500 flex-shrink-0">
                {index + 1}
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="h-4 rounded-full w-full max-w-64 bg-neutral-100"></div>
                <div className="h-4 rounded-full w-full max-w-32 bg-neutral-100"></div>
            </div>
            <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-neutral-100">
                <p className="text-neutral-400">123</p>
                <Play className="text-lg text-neutral-400"/>
            </div>
        </div>
    )
}