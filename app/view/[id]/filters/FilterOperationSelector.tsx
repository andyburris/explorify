import { CombineInto, CombineType, FilterOperation, GroupOperation, SearchType, SkipFilterType } from "@/app/data/model/Operations";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, List, ListDashes, ListNumbers, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { TextField } from "@/app/common/TextField";

export function FilterOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: FilterOperation, onChangeOperation: (newFilter: FilterOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Filter skips by" description="Spotify counts plays as songs you played for at least 30 seconds">
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
                    ]} 
                    selectedItem={currentOperation.searchBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, searchBy: n})}
                />
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Rerank items", key: "Rerank items", icon: <ListNumbers/> },
                        { value: false, label: "Don't rerank items", key: "Don't rerank items", icon: <ListDashes/> },
                    ]} 
                    selectedItem={currentOperation.rerankSearch}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, rerankSearch: n})}
                />
            </OperationSection>
        </div>
    )
}