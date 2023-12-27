
import { defaultPresets } from "../Defaults";
import { hashOperations, parseHash } from "../hashing/Hashing";
import { Preset } from "../model/Preset";

interface SavedPreset {
    id: string,
    name: string,
    description: string,
    icon: string,
    operationsHash: string,
    index: number,
}
function getSavedPresets(): [string, string][] {
    return Object.entries(localStorage)
        .filter(([key, _]) => key.startsWith("preset-"))
}
export function getPresets(): Preset[] {
    return getSavedPresets()
        .map(([key, p]) => {
            const saved: SavedPreset = JSON.parse(p)
            return { ...saved, operations: parseHash(saved.operationsHash) }
        })
        .toSorted((a, b) => a.index - b.index)
    
}
export function savePreset(preset: Preset) {
    const key = `preset-${preset.id}`
    const existingPresetIndex = getPresets().findIndex(p => p.id == preset.id)
    const savedPreset: SavedPreset = { 
        id: preset.id, 
        name: preset.name, 
        description: preset.description, 
        icon: preset.icon, 
        operationsHash: hashOperations(preset.operations),
        index: existingPresetIndex != -1 ? existingPresetIndex : getPresets().length
    }
    localStorage[key] = JSON.stringify(savedPreset)
}

export function saveDefaultPresets() {
    defaultPresets.forEach(p => savePreset(p))
}