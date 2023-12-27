import { useEffect, useState } from "react"
import { getPresets } from "../persist/PresetRepository"
import { Preset } from "../model/Preset"

export function usePresets() {
    const [savedPresets, setSavedPresets] = usePresetState()
    return savedPresets  
}

export function usePresetState() {
    const state = useState<Preset[] | undefined>(undefined)
    useEffect(() => state[1](getPresets()), [])
    return state  
}