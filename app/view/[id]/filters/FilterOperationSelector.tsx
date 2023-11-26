import { SegmentedControl } from "@/app/common/SegmentedControl";
import { CombineInto, CombineType, FilterOperation, GroupOperation, SearchType, SkipFilterType } from "@/app/data/model/Operations";
import { GroupType } from "@/app/data/model/Group";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, List, ListDashes, ListNumbers, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection } from "./OperationsSelector";
import { TextField } from "@/app/common/TextField";

export function FilterOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: FilterOperation, onChangeOperation: (newFilter: FilterOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Filter skips by" description="Spotify counts plays as songs you played for at least 30 seconds">
                <SegmentedControl 
                    items={[
                        { item: SkipFilterType.All, title: "All", icon: <List/> },
                        { item: SkipFilterType.NoSkips, title: "No skips", icon: <Clock/> },
                        { item: SkipFilterType.OnlySkips, title: "Only skips", icon: <CalendarBlank/> },
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
                <SegmentedControl 
                    items={[
                        { item: SearchType.All, title: "All", icon: <List/> },
                        { item: SearchType.SongName, title: "Song name", icon: <MusicNote/> },
                        { item: SearchType.ArtistName, title: "Artist name", icon: <User/> },
                    ]} 
                    selectedItem={currentOperation.searchBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, searchBy: n})}
                />
                <SegmentedControl 
                    items={[
                        { item: true, title: "Rerank items", icon: <ListNumbers/> },
                        { item: false, title: "Don't rerank items", icon: <ListDashes/> },
                    ]} 
                    selectedItem={currentOperation.rerankSearch}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, rerankSearch: n})}
                />
            </OperationSection>
        </div>
    )
}