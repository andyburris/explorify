"use client"

import { useEffect, useState } from "react"
import { PresetPage } from "./PresetPage"
import { getPresets } from "@/app/data/persist/PresetRepository"
import { Preset } from "@/app/data/model/Preset"
import { usePresets } from "@/app/data/utils/presetUtils"

export default function ViewPage({ params }: { params: { id: string } }) {
    //bypasses SSR error
    const loadedPresets = usePresets()
    if(loadedPresets === undefined) return (<></>) 

    const preset = loadedPresets.find(p => p.id == params.id)
    if(preset === undefined) return (<p>Can't find preset with id = "{params.id}"</p>)

    return (
        <PresetPage initialPreset={preset} />
    )
}