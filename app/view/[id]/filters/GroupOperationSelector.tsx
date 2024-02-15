import { CombineInto, CombineType, GroupOperation, GroupType } from "@/app/data/model/Operations";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, List, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
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
                    placeholder="Search group types..."
                    onSelectValues={n => onChangeOperation({ ...currentOperation, groupBy: fromIndividuals(n)})}
                />
            </OperationSection>
            <OperationSection title="Combine by">
                <ResponsiveControl 
                    items={[
                        { value: CombineType.None, label: "None", key: "None", icon: <List/> },
                        { value: CombineType.SameSong, label: "Same Song", key: "Same Song", icon: <MusicNote/> },
                        { value: CombineType.SameArtist, label: "Same Artist", key: "Same Artist", icon: <User/> },
                    ]} 
                    selectedItem={currentOperation.combineBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, combineBy: n})}
                />
                <ResponsiveControl 
                    items={[
                        { value: CombineInto.EarliestPlay, label: "Earliest Play", key: "Earliest Play", icon: <SortAscending/> },
                        { value: CombineInto.LatestPlay, label: "Most Recent Play", key: "Most Recent Play", icon: <SortDescending/> },
                    ]} 
                    selectedItem={currentOperation.combineInto}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, combineInto: n})}
                />
                { Object.entries(currentOperation.groupBy).some(([k, b]) => b as boolean) && 
                    <ResponsiveControl 
                        items={[
                            { value: false, label: "Within Groups", key: "Within Groups", icon: <ArrowsInLineVertical/> },
                            { value: true, label: "Across Groups", key: "Across Groups", icon: <ArrowsOutLineVertical/> },
                        ]} 
                        selectedItem={currentOperation.combineAcrossGroups}
                        onSelect={(n) => onChangeOperation({ ...currentOperation, combineAcrossGroups: n})}
                    />
                }
            </OperationSection>
        </div>
    )
}