import { useEffect, useState } from "react"
import { getPresets } from "../persist/PresetRepository"
import { Preset } from "../model/Preset"

export function usePresets() {
    const [savedPresets, setSavedPresets] = useState<Preset[] | undefined>(undefined)
    useEffect(() => setSavedPresets(getPresets()), [])
    return savedPresets  
}