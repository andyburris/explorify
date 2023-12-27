"use client"

import { PresetPage } from "./PresetPage"
import { getPresets } from "@/app/data/persist/PresetRepository"

export default function ViewPage({ params }: { params: { id: string } }) {
    const preset = getPresets().find(p => p.id == params.id)
    if(preset === undefined) return (<p>Can't find preset with id = "{params.id}"</p>)

    return (
        <PresetPage initialPreset={preset} />
    )
}