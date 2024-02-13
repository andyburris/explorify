import { Operations } from "@/app/data/model/Operations";
import { ArrowsMerge, Eye, FunnelSimple, Info, NumberCircleOne, NumberCircleThree, NumberCircleTwo, Question, SortAscending, X } from "phosphor-react-sc";
import * as Tabs from '@radix-ui/react-tabs';
import React, { useState } from "react";
import { GroupOperationSelector } from "./GroupOperationSelector";
import { SortOperationSelector } from "./SortOperationSelector";
import { ViewOptionsSelector } from "./ViewOperationSelector";
import { FilterOperationSelector } from "./FilterOperationSelector";
import { InfoSelector } from "./InfoSelector";
import { Preset } from "@/app/data/model/Preset";
import { Segment, SegmentedControl } from "@/app/common/SegmentedControl";
import { Combobox } from "@/app/common/components/ui/combobox";
import { Popover } from "@radix-ui/react-popover";
import { ActionButton } from "@/app/common/button/ActionButton";

export enum OperationType { Info="Info", Group="Group", Filter="Filter", Sort="Sort", View="View" }
export function OperationsSelector({ currentPreset, onChangePreset, currentTab, onChangeTab }: { 
    currentPreset: Preset,
    onChangePreset: (preset: Preset) => void,
    currentTab: OperationType,
    onChangeTab: (tab: OperationType) => void,
 }) {
    const currentOperations = currentPreset.operations
    const onChangeOperations = (operations: Operations) => onChangePreset({ ...currentPreset, operations: operations})
    return (
        <div className="flex flex-col rounded-2xl shadow-outset mt-4 overflow-hidden">
            <p className="text-neutral-500 font-semibold px-4 pt-4 pb-2">Customize</p>
            <Tabs.Root value={currentTab} onValueChange={t => onChangeTab(t as OperationType)}>
                <Tabs.List className="flex w-full border-b border-neutral-300 overflow-x-scroll pb-[1px]">
                    <OperationTab operationType={OperationType.Info} icon={<Info/>} />
                    <OperationTab operationType={OperationType.Group} icon={<ArrowsMerge/>} />
                    <OperationTab operationType={OperationType.Filter} icon={<FunnelSimple/>} />
                    <OperationTab operationType={OperationType.Sort} icon={<SortAscending/>} />
                    <OperationTab operationType={OperationType.View} icon={<Eye/>} />
                </Tabs.List>
                <Tabs.Content value={OperationType.Info} className="p-4">
                    <InfoSelector 
                        preset={currentPreset} 
                        onChangePreset={p => onChangePreset(p) }
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.Group} className="p-4">
                    <GroupOperationSelector 
                        currentOperation={currentOperations.group} 
                        onChangeOperation={gf => onChangeOperations({...currentOperations, group: gf }) }
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.Filter} className="p-4">
                    <FilterOperationSelector 
                        currentOperation={currentOperations.filter} 
                        onChangeOperation={ff => onChangeOperations({...currentOperations, filter: ff }) }
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.Sort} className="p-4">
                    <SortOperationSelector 
                        currentOperation={currentOperations.sort} 
                        groupType={currentOperations.group.groupBy} 
                        onChangeOperation={sf => onChangeOperations({...currentOperations, sort: sf }) } 
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.View} className="p-4">
                    <ViewOptionsSelector
                        currentViewOptions={currentOperations.viewOptions}
                        onChangeViewOptions={vo => onChangeOperations({...currentOperations, viewOptions: vo})}
                        currentInfoOperation={currentOperations.info}
                        onChangeInfoOperation={i => onChangeOperations({...currentOperations, info: i})}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    )
}

function OperationTab({ operationType, icon }: { operationType: OperationType, icon: React.ReactNode }) {
    return (
        <Tabs.Trigger 
            className="flex gap-2 items-center justify-center py-3 px-4 text-neutral-500 hover:bg-neutral-100 rounded-t-lg data-[state=active]:text-green-700 data-[state=active]:border-b data-[state=active]:border-green-700 data-[state=active]:-mb-[1px]" 
            value={operationType}
        >
            {icon}
            <p>{operationType}</p>
        </Tabs.Trigger>
    )
}

export function OperationSection({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) {
    const [descriptionExpanded, setDescriptionExpanded] = useState(false)
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-3 justify-between items-center text-neutral-500">
                <p className="text-neutral-900">{title}</p>
                { (!descriptionExpanded && description) && 
                    <div className="flex items-center h-4">
                        <ActionButton onClick={() => setDescriptionExpanded(true)} icon={<Question/>} hideShadow/>
                    </div>
                }
            </div>
            { (descriptionExpanded && description) && 
                <div className="flex gap-3 p-3 rounded-xl border border-green-200 bg-green-50 text-green-700 items-center">
                    <Question/>
                    <p className="">{description}</p> 
                    <ActionButton onClick={() => setDescriptionExpanded(false)} icon={<X/>} hideShadow className="!text-green-700 hover:text-green-900 hover:bg-green-100"/>
                </div>
            }
            {children}
        </div>
    )
}

export function ResponsiveControl<T>({ items, selectedItem, onSelect }: { items: Segment<T>[], selectedItem: T, onSelect: (item: T) => void }) {
    return (
        <>
        <div className="hidden sm:block">
            <SegmentedControl items={items} selectedItem={selectedItem} onSelect={onSelect} />
        </div>
        <div className="sm:hidden">
            <Combobox options={items} selectedValues={[selectedItem]} onSelectValues={(v) => onSelect(v[0] ?? selectedItem)} placeholder="Search..." multiSelect={false}/>
        </div>
        </>
    )
}