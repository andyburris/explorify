import { defaultPresets } from "@/app/data/Defaults"
import { PresetPage } from "../view/[id]/PresetPage"
import { Preset } from "../data/model/Preset"

export default function CustomizePage() {
    const preset: Preset = { ...defaultPresets[0], id: "", name: "New View", description: "A blank slate to explore your streaming history", icon: "plus" }

    return (
        <PresetPage initialPreset={preset} isShared={false} customizeInitial={true} />
    )
}