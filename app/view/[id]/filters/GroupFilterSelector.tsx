import { SegmentedControl } from "@/app/common/SegmentedControl";
import { CombineInto, CombineType, GroupFilter } from "@/app/data/model/Filters";
import { GroupType } from "@/app/data/model/Group";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, List, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { FilterSection } from "./FilterSelector";

export function GroupFilterSelector({ currentFilter, onChangeFilter }: { currentFilter: GroupFilter, onChangeFilter: (newFilter: GroupFilter) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <FilterSection title="Group by">
                <SegmentedControl 
                    items={[
                        { item: GroupType.None, title: "None", icon: <List/> },
                        { item: GroupType.Hour, title: "Hour", icon: <Clock/> },
                        { item: GroupType.Day, title: "Day", icon: <CalendarBlank/> },
                        { item: GroupType.Month, title: "Month", icon: <Calendar/> },
                        { item: GroupType.Year, title: "Year", icon: <ClockCounterClockwise/> },
                    ]} 
                    selectedItem={currentFilter.groupBy}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, groupBy: n})}
                />
            </FilterSection>
            <FilterSection title="Combine by">
                <SegmentedControl 
                    items={[
                        { item: CombineType.None, title: "None", icon: <List/> },
                        { item: CombineType.SameSong, title: "Same Song", icon: <MusicNote/> },
                        { item: CombineType.SameArtist, title: "Same Artist", icon: <User/> },
                    ]} 
                    selectedItem={currentFilter.combineBy}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, combineBy: n})}
                />
                <SegmentedControl 
                    items={[
                        { item: CombineInto.EarliestPlay, title: "Earliest Play", icon: <SortAscending/> },
                        { item: CombineInto.LatestPlay, title: "Most Recent Play", icon: <SortDescending/> },
                    ]} 
                    selectedItem={currentFilter.combineInto}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, combineInto: n})}
                />
                { currentFilter.groupBy != GroupType.None && 
                    <SegmentedControl 
                        items={[
                            { item: false, title: "Within Groups", icon: <ArrowsInLineVertical/> },
                            { item: true, title: "Across Groups", icon: <ArrowsOutLineVertical/> },
                        ]} 
                        selectedItem={currentFilter.combineAcrossGroups}
                        onSelect={(n) => onChangeFilter({ ...currentFilter, combineAcrossGroups: n})}
                    />
                }
            </FilterSection>
        </div>
    )
}