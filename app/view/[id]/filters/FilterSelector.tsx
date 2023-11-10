import { SegmentedControl } from "@/app/common/SegmentedControl";
import { ActionButton } from "@/app/common/button/ActionButton";
import { Filters } from "@/app/data/model/Filters";
import { ArrowsMerge, Eye, NumberCircleOne, NumberCircleThree, NumberCircleTwo, SortAscending } from "phosphor-react-sc";
import * as Tabs from '@radix-ui/react-tabs';
import React, { useState } from "react";
import { GroupFilterSelector } from "./GroupFilterSelector";
import { SortFilterSelector } from "./SortFilterSelector";
import { GroupType } from "@/app/data/model/Group";

enum FilterType { Group="Group", Sort="Sort", View="View" }
export function FilterSelector({ currentFilters, onChangeFilters }: { currentFilters: Filters, onChangeFilters: (filters: Filters) => void }) {
    const [selectedChip, selectChip] = useState<FilterType | null>(null)

    return (
        <div className="flex flex-col rounded-2xl border border-neutral-300 mt-4">
            <p className="text-neutral-500 font-semibold px-4 pt-4 pb-2">Filters</p>
            <Tabs.Root defaultValue={FilterType.Group}>
                <Tabs.List className="flex w-full border-b border-b-neutral-300">
                    <FilterTab filterType={FilterType.Group} icon={<ArrowsMerge/>} />
                    <FilterTab filterType={FilterType.Sort} icon={<SortAscending/>} />
                    <FilterTab filterType={FilterType.View} icon={<Eye/>} />
                </Tabs.List>
                <Tabs.Content value={FilterType.Group} className="p-4">
                    <GroupFilterSelector 
                        currentFilter={currentFilters.group} 
                        onChangeFilter={gf => onChangeFilters({...currentFilters, group: gf }) }
                    />
                </Tabs.Content>
                <Tabs.Content value={FilterType.Sort} className="p-4">
                    <SortFilterSelector 
                        currentFilter={currentFilters.sort} 
                        hasGroups={currentFilters.group.groupBy != GroupType.None} 
                        onChangeFilter={sf => onChangeFilters({...currentFilters, sort: sf }) } 
                    />
                </Tabs.Content>
                <Tabs.Content value={FilterType.View} className="p-4">
                    <p>View</p>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    )
}

function FilterTab({ filterType, icon }: { filterType: FilterType, icon: React.ReactNode }) {
    return (
        <Tabs.Trigger 
            className="flex gap-2 items-center justify-center py-3 px-4 text-neutral-500 hover:bg-neutral-100 rounded-t-lg data-[state=active]:text-green-900 data-[state=active]:border-b data-[state=active]:border-b-green-700 data-[state=active]:-mb-[1px]" 
            value={filterType}
        >
            {icon}
            <p>{filterType}</p>
        </Tabs.Trigger>
    )
}

export function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-neutral-500">{title}</p>
            {children}
        </div>
    )
}