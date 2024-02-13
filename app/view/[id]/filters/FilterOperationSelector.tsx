import { CombineInto, CombineType, FilterOperation, GroupOperation, SearchType, SkipFilterType } from "@/app/data/model/Operations";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, List, ListDashes, ListNumbers, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { TextField } from "@/app/common/TextField";
import { Combobox } from "@/app/common/components/ui/combobox";

export function FilterOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: FilterOperation, onChangeOperation: (newFilter: FilterOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Filter skips by" description="Spotify counts skips as songs you played for less than 30 seconds">
                <ResponsiveControl 
                    items={[
                        { value: SkipFilterType.All, label: "All", key: "All", icon: <List/> },
                        { value: SkipFilterType.NoSkips, label: "No skips", key: "No skips", icon: <Clock/> },
                        { value: SkipFilterType.OnlySkips, label: "Only skips", key: "Only skips", icon: <CalendarBlank/> },
                    ]} 
                    selectedItem={currentOperation.filterSkipsBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, filterSkipsBy: n})}
                />
            </OperationSection>
            <OperationSection title="Minimum group plays" description="Hide groups with less than the given amount of plays (not including plays filtered out by skips and search).">
                <TextField 
                    placeholder="0" 
                    currentValue={currentOperation.minimumPlays > 0 ? `${currentOperation.minimumPlays}` : ""}
                    onChangeValue={v => onChangeOperation({ ...currentOperation, minimumPlays: parseInt(v) ?? currentOperation.minimumPlays}) }    
                />
            </OperationSection>
            <OperationSection title="Search by">
                <TextField 
                    placeholder="Search..." 
                    currentValue={currentOperation.searchTerm}
                    onChangeValue={v => onChangeOperation({ ...currentOperation, searchTerm: v}) }    
                />
                <ResponsiveControl 
                    items={[
                        { value: SearchType.All, label: "All", key: "All", icon: <List/> },
                        { value: SearchType.SongName, label: "Song name", key: "Song name", icon: <MusicNote/> },
                        { value: SearchType.ArtistName, label: "Artist name", key: "Artist name", icon: <User/> },
                        { value: SearchType.AlbumName, label: "Album name", key: "Album name", icon: <Disc/> },
                    ]} 
                    selectedItem={currentOperation.searchBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, searchBy: n})}
                />
                <Combobox 
                    //TODO: fix naming
                    options={[
                        { value: true, label: "Filter out of total plays and ranks", key: "hidden", icon: <ListNumbers/> },
                        { value: false, label: "Don't filter out of total plays and ranks", key: "validity", icon: <ListDashes/> },
                    ]} 
                    selectedValues={[currentOperation.hideFilteredPlays]}
                    onSelectValues={(n) => onChangeOperation({ ...currentOperation, hideFilteredPlays: n[0] ?? currentOperation.hideFilteredPlays})}
                    multiSelect={false}
                    placeholder="Search..."
                />
            </OperationSection>
        </div>
    )
}