import { useState } from "react";
import { CommonDialog, DialogProps } from "../common/CommonDialog";
import { PickedIcon } from "../common/PickedIcon";
import { Preset } from "../data/model/Preset";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { ArrowCounterClockwise, DotsSixVertical, Trash } from "phosphor-react-sc";
import { ActionButton } from "../common/button/ActionButton";

interface EditPresetsProps extends DialogProps { 
    presets: Preset[], 
    onPresetOrderChange: (presets: Preset[]) => void, 
    onDeletePreset: (p: Preset) => void,
    onResetPresets: () => void,
}
export function EditPresets({ presets, open, onOpenChange, onPresetOrderChange, onDeletePreset, onResetPresets }: EditPresetsProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [resetDialogOpen, setResetDialogOpen] = useState(false)

    return (
        <CommonDialog
            title="Edit Views"
            open={open}
            onOpenChange={onOpenChange}
            widgets={<ActionButton text="Reset" icon={<ArrowCounterClockwise/>} onClick={() => setResetDialogOpen(true)}/>}
        >
            <CommonDialog
                open={resetDialogOpen}
                onOpenChange={setResetDialogOpen}
                title="Reset to default views"
                >
                <p>This will reset all views to the website defaults. Any custom views you have, or defaults that you've edited will be <strong>permanently deleted</strong>. You can copy their links beforehand to preserve them.</p>
                <ActionButton icon={<ArrowCounterClockwise/>} text="Confirm reset" onClick={() => { onResetPresets(); setResetDialogOpen(false); onOpenChange(false) }}/>
            </CommonDialog>
            <div className="flex flex-col -mx-3 -my-1">
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => {
                        const { active, over } = e
                        if(active.id !== over?.id) {
                            const oldIndex = presets.findIndex(p => p.id == active.id)
                            const newIndex = presets.findIndex(p => p.id == over?.id)
                            onPresetOrderChange(arrayMove(presets, oldIndex, newIndex))
                        }
                    }}
                    >
                    <SortableContext 
                        items={presets}
                        strategy={verticalListSortingStrategy}>
                            {presets.map((p, i) => <EditPresetItem id={p.id} key={p.id} preset={p} index={i} onDelete={() => onDeletePreset(p)}/>)}
                    </SortableContext>
                </DndContext>
            </div>
        </CommonDialog>
    )
}

function EditPresetItem({ preset, id, index, onDelete }: { preset: Preset, id: string, index: number, onDelete: () => void }) {
    const { active, attributes, listeners, setNodeRef, transform, transition } = useSortable({id: id})
    const noScaleY = transform ? { ...transform, scaleY: 1 } : null
    const style = { transform: CSS.Transform.toString(noScaleY), transition }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    return (
        <div 
            ref={setNodeRef} 
            className="flex items-center gap-3 pr-4 touch-none"
            style={style} 
            {...attributes} 
            >
                <div 
                    className={"flex gap-3 items-center py-2 pl-4 pr-2 rounded-xl w-full " + (active?.id === undefined ? "hover:bg-neutral-100 focus:bg-neutral-100" : active.id == id ? "bg-neutral-100 ring-2 ring-offset-2 ring-neutral-200 z-10" : "")}
                    {...listeners}
                    >
                    <p className="text-neutral-500">{index + 1}.</p>
                    <div className="flex items-center justify-center h-8 w-8 bg-neutral-100 rounded-lg text-neutral-500 flex-shrink-0">
                        <PickedIcon iconName={preset.icon} />
                    </div>
                    <div className="flex flex-col w-full">
                        <p className="font-semibold">{preset.name}</p>
                        <p className="text-neutral-500 line-clamp-1">{preset.description}</p>
                    </div>
                    <DotsSixVertical className="text-neutral-900 text-2xl flex-shrink-0"/>
                </div>
                <ActionButton icon={<Trash/>} onClick={() => setDeleteDialogOpen(true)} className="flex-shrink-0 z-20" />
                <CommonDialog title="Delete View?" open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <p>This will permanently delete <span className="font-semibold">{preset.name}</span>, and cannot be undone. You can share the URL before deleting if you want to preserve it.</p>
                    <ActionButton text="Confirm delete" icon={<Trash/>} onClick={() => { onDelete(); setDeleteDialogOpen(false) }}/>
                </CommonDialog>
        </div>
    )
}