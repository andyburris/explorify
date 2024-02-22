import { CombineInto, CombineType, FilterOperation, GroupOperation, SearchType, SkipFilterType } from "@/app/data/model/Operations";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, List, ListDashes, ListNumbers, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { TextField } from "@/app/common/TextField";
import { Combobox } from "@/app/common/components/ui/combobox";
import { useCallback, useEffect, useState } from "react";

export function FilterOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: FilterOperation, onChangeOperation: (newFilter: FilterOperation) => void }) {
    const [searchTerm, setSearchTerm] = useState(currentOperation.searchTerm)
    const [minPlaysTerm, setMinPlaysTerm] = useState(currentOperation.minimumGroupPlays == 0 ? "" : `${currentOperation.minimumGroupPlays}`)
    useEffect(() => onChangeOperation({ ...currentOperation, searchTerm: searchTerm}), [searchTerm])
    useEffect(() => onChangeOperation({ ...currentOperation, minimumGroupPlays: Number.isNaN(parseInt(minPlaysTerm)) ? currentOperation.minimumGroupPlays : parseInt(minPlaysTerm)}))
  
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
                    currentValue={minPlaysTerm}
                    onChangeValue={v => {
                        const asInt = parseInt(v)
                        const isValid = !Number.isNaN(asInt) || v == ""
                        setMinPlaysTerm(isValid ? v : minPlaysTerm)
                     } }    
                />
            </OperationSection>
            <OperationSection title="Search by">
                <TextField 
                    placeholder="Search..." 
                    currentValue={searchTerm}
                    onChangeValue={v => setSearchTerm(v) }    
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
            </OperationSection>
        </div>
    )
}