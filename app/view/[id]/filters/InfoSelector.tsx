import { Preset } from "@/app/data/model/Preset";
import { OperationSection } from "./OperationsSelector";
import { TextField } from "@/app/common/TextField";
import { pickableIcons } from "@/app/common/PickedIcon";
import { Combobox } from "@/app/common/components/ui/combobox";

export function InfoSelector({ preset, onChangePreset }: { preset: Preset, onChangePreset: (preset: Preset) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Name">
                <TextField placeholder="Title" currentValue={preset.name} onChangeValue={(v) => onChangePreset({ ...preset, name: v })}/>
            </OperationSection>
            <OperationSection title="Description">
                <TextField placeholder="Title" currentValue={preset.description} onChangeValue={(v) => onChangePreset({ ...preset, description: v })}/>
            </OperationSection>
            <OperationSection title="Icon">
                <Combobox 
                    options={pickableIcons.map(pi => { return {key: pi.name, label: pi.name, value: pi.name, icon: pi.component() } })}
                    selectedValues={[pickableIcons.find(pi => pi.name.toLowerCase() == preset.icon)?.name].filter(i => i)}
                    onSelectValues={(v) => onChangePreset({ ...preset, icon: v[0] ?? preset.icon })}
                    placeholder="Select icon..."
                    multiSelect={false}/>
            </OperationSection>
            <OperationSection title="Identifier">
                <TextField placeholder="ID" currentValue={preset.id} onChangeValue={(v) => onChangePreset({ ...preset, id: v })}/>
                <p><span className="text-neutral-500">https://quantize.music/view/</span><span className="font-semibold">{preset.id}</span></p>
            </OperationSection>
        </div>
    )
}