import { SegmentedControl } from "@/app/common/SegmentedControl";
import { CombineInto, CombineType, GroupOperation } from "@/app/data/model/Operations";
import { GroupType } from "@/app/data/model/Group";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, List, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection } from "./OperationsSelector";

export function GroupOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: GroupOperation, onChangeOperation: (newFilter: GroupOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Group by">
                <SegmentedControl 
                    items={[
                        { item: GroupType.None, title: "None", icon: <List/> },
                        { item: GroupType.Hour, title: "Hour", icon: <Clock/> },
                        { item: GroupType.Day, title: "Day", icon: <CalendarBlank/> },
                        { item: GroupType.Month, title: "Month", icon: <Calendar/> },
                        { item: GroupType.Year, title: "Year", icon: <ClockCounterClockwise/> },
                    ]} 
                    selectedItem={currentOperation.groupBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, groupBy: n})}
                />
            </OperationSection>
            <OperationSection title="Combine by">
                <SegmentedControl 
                    items={[
                        { item: CombineType.None, title: "None", icon: <List/> },
                        { item: CombineType.SameSong, title: "Same Song", icon: <MusicNote/> },
                        { item: CombineType.SameArtist, title: "Same Artist", icon: <User/> },
                    ]} 
                    selectedItem={currentOperation.combineBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, combineBy: n})}
                />
                <SegmentedControl 
                    items={[
                        { item: CombineInto.EarliestPlay, title: "Earliest Play", icon: <SortAscending/> },
                        { item: CombineInto.LatestPlay, title: "Most Recent Play", icon: <SortDescending/> },
                    ]} 
                    selectedItem={currentOperation.combineInto}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, combineInto: n})}
                />
                { currentOperation.groupBy != GroupType.None && 
                    <SegmentedControl 
                        items={[
                            { item: false, title: "Within Groups", icon: <ArrowsInLineVertical/> },
                            { item: true, title: "Across Groups", icon: <ArrowsOutLineVertical/> },
                        ]} 
                        selectedItem={currentOperation.combineAcrossGroups}
                        onSelect={(n) => onChangeOperation({ ...currentOperation, combineAcrossGroups: n})}
                    />
                }
            </OperationSection>
        </div>
    )
}