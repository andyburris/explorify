import { Operations } from "@/app/data/model/Operations";
import { ArrowsMerge, Eye, FunnelSimple, NumberCircleOne, NumberCircleThree, NumberCircleTwo, SortAscending } from "phosphor-react-sc";
import * as Tabs from '@radix-ui/react-tabs';
import React, { useState } from "react";
import { GroupOperationSelector } from "./GroupOperationSelector";
import { SortOperationSelector } from "./SortOperationSelector";
import { GroupType } from "@/app/data/model/Group";
import { ViewOptionsSelector } from "./ViewOperationSelector";
import { FilterOperationSelector } from "./FilterOperationSelector";

enum OperationType { Group="Group", Filter="Filter", Sort="Sort", View="View" }
export function OperationsSelector({ currentOperations, onChangeOperations }: { currentOperations: Operations, onChangeOperations: (filters: Operations) => void }) {
    return (
        <div className="flex flex-col rounded-2xl border border-neutral-200 mt-4">
            <p className="text-neutral-500 font-semibold px-4 pt-4 pb-2">Customize</p>
            <Tabs.Root defaultValue={OperationType.Group}>
                <Tabs.List className="flex w-full border-b border-b-neutral-300">
                    <OperationTab operationType={OperationType.Group} icon={<ArrowsMerge/>} />
                    <OperationTab operationType={OperationType.Filter} icon={<FunnelSimple/>} />
                    <OperationTab operationType={OperationType.Sort} icon={<SortAscending/>} />
                    <OperationTab operationType={OperationType.View} icon={<Eye/>} />
                </Tabs.List>
                <Tabs.Content value={OperationType.Group} className="p-4 max-h-80 overflow-y-scroll">
                    <GroupOperationSelector 
                        currentOperation={currentOperations.group} 
                        onChangeOperation={gf => onChangeOperations({...currentOperations, group: gf }) }
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.Filter} className="p-4 max-h-80 overflow-y-scroll">
                    <FilterOperationSelector 
                        currentOperation={currentOperations.filter} 
                        onChangeOperation={ff => onChangeOperations({...currentOperations, filter: ff }) }
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.Sort} className="p-4 max-h-80 overflow-y-scroll">
                    <SortOperationSelector 
                        currentOperation={currentOperations.sort} 
                        hasGroups={currentOperations.group.groupBy != GroupType.None} 
                        onChangeOperation={sf => onChangeOperations({...currentOperations, sort: sf }) } 
                    />
                </Tabs.Content>
                <Tabs.Content value={OperationType.View} className="p-4 max-h-80 overflow-y-scroll">
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
            className="flex gap-2 items-center justify-center py-3 px-4 text-neutral-500 hover:bg-neutral-100 rounded-t-lg data-[state=active]:text-green-900 data-[state=active]:border-b data-[state=active]:border-b-green-700 data-[state=active]:-mb-[1px]" 
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