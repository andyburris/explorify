import { Operations } from "@/app/data/model/Operations";
import { ArrowsMerge, Eye, FunnelSimple, Info, NumberCircleOne, NumberCircleThree, NumberCircleTwo, SortAscending } from "phosphor-react-sc";
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
                        currentOperation={currentOperations.viewOptions}
                        onChangeOperation={vo => onChangeOperations({...currentOperations, viewOptions: vo})}
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
    return (
        <div className="flex flex-col gap-2">
            <p className="text-neutral-500">{title}</p>
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