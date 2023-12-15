import { SegmentedControl } from "@/app/common/SegmentedControl";
import { CombineInto, CombineType, GroupOperation, GroupType } from "@/app/data/model/Operations";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, List, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection } from "./OperationsSelector";
import { Combobox } from "@/app/common/components/ui/combobox";
import { GroupKey } from "@/app/data/model/Group";

enum GroupTypeIndividual { Hour, DayOfWeek, Date, Month, Year, Song, Artist, Album } 
function fromIndividuals(selectedTypes: GroupTypeIndividual[]): GroupType {
    return {
        hour: selectedTypes.includes(GroupTypeIndividual.Hour),
        dayOfWeek: selectedTypes.includes(GroupTypeIndividual.DayOfWeek),
        date: selectedTypes.includes(GroupTypeIndividual.Date),
        month: selectedTypes.includes(GroupTypeIndividual.Month),
        year: selectedTypes.includes(GroupTypeIndividual.Year),
        artist: selectedTypes.includes(GroupTypeIndividual.Artist),
        song: selectedTypes.includes(GroupTypeIndividual.Song),
        album: selectedTypes.includes(GroupTypeIndividual.Album),
    }
}
function toIndividuals(type: GroupType): GroupTypeIndividual[] {
    return [
        ...(type.hour ? [GroupTypeIndividual.Hour] : []),
        ...(type.dayOfWeek ? [GroupTypeIndividual.DayOfWeek] : []),
        ...(type.date ? [GroupTypeIndividual.Date] : []),
        ...(type.month ? [GroupTypeIndividual.Month] : []),
        ...(type.year ? [GroupTypeIndividual.Year] : []),
        ...(type.artist ? [GroupTypeIndividual.Artist] : []),
        ...(type.song ? [GroupTypeIndividual.Song] : []),
        ...(type.album ? [GroupTypeIndividual.Album] : []),
    ]
}
export function GroupOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: GroupOperation, onChangeOperation: (newFilter: GroupOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Group by">
                <Combobox
                    options={[
                        { value: GroupTypeIndividual.Hour, label: "Hour", key: "Hour", icon: <Clock/> },
                        { value: GroupTypeIndividual.DayOfWeek, label: "Day of week", key: "Day", icon: <CalendarBlank/> },
                        { value: GroupTypeIndividual.Date, label: "Date of month", key: "Date", icon: <Calendar/> },
                        { value: GroupTypeIndividual.Month, label: "Month", key: "Month", icon: <Calendar/> },
                        { value: GroupTypeIndividual.Year, label: "Year", key: "Year", icon: <ClockCounterClockwise/> },
                        { value: GroupTypeIndividual.Song, label: "Song", key: "Song", icon: <MusicNote/> },
                        { value: GroupTypeIndividual.Artist, label: "Artist", key: "Artist", icon: <User/> },
                        { value: GroupTypeIndividual.Album, label: "Album", key: "Album", icon: <Disc/> },
                    ]}
                    selectedValues={toIndividuals(currentOperation.groupBy)}
                    multiSelect={true}
                    placeholder="Select group..."
                    onSelectValues={n => onChangeOperation({ ...currentOperation, groupBy: fromIndividuals(n)})}
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
                { Object.entries(currentOperation.groupBy).length <= 0 && 
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