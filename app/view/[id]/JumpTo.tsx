import { useState } from "react";
import { ActionButton } from "@/app/common/button/ActionButton";
import { X } from "phosphor-react-sc";
import { Group } from "@/app/data/model/Group";
import { ArtistCombination, Combination, TrackCombination } from "@/app/data/model/Combination";
import { GroupHeader } from "./item/GroupHeaderItem";
import { CombinationItem } from "./item/CombinationItem";
import { DisplayOperation } from "./DataTable";

type JumpToItem = JumpToGroup | Combination
class JumpToGroup { public constructor(public group: Group, public matchesSearch: boolean){} }
export function JumpTo({ groups, displayOperation, onJump, onClose }: { groups: Group[], displayOperation: DisplayOperation, onJump: (item: Group | Combination) => void, onClose: () => void }) {
    const [searchTerm, setSearchTerm] = useState("")
    const filteredItems: JumpToItem[] = groups.flatMap(g => {
        const filteredCombinations = g.combinations.filter(c => combinationMatchesSearch(c, searchTerm))
        const jumpToGroup = new JumpToGroup(g, groupMatchesSearch(g, searchTerm))
        if(filteredCombinations.length > 0 || jumpToGroup.matchesSearch) return [jumpToGroup, ...filteredCombinations]
        else return []
    })
    const shownItems = filteredItems.slice(0, 15)
    
    return (
        <div className="flex flex-col shadow-outset bg-white rounded-2xl overflow-hidden">
            <div className="flex gap-2 pr-2 items-center">
                <input 
                    placeholder="Jump to..." 
                    className={"p-4 bg-transparent w-full rounded-tl-2xl " + (searchTerm.length > 0 ? "" : "rounded-bl-2xl") }
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                    />
                <ActionButton onClick={onClose} icon={<X/>} hideShadow className="flex-shrink-0"/>
            </div>
            { searchTerm.length > 0 && 
                <div className="border-t border-neutral-200 pb-2 overflow-hidden">
                    {shownItems.map((i, index) => {
                        let content: React.ReactNode
                        if(i instanceof JumpToGroup) {
                            content = (i.matchesSearch)
                                ? <GroupHeader group={i.group} displayOperation={displayOperation}/>
                                : <UnmatchedGroupHeader group={i.group}/>
                        } else {
                            content = <CombinationItem combination={i} indexInGroup={i.rank} displayOperation={displayOperation} onToggleExpand={() => {}} />
                        }
                        
                        return <div key={index} className={"px-4 hover:bg-neutral-50 cursor-pointer" + (index == 0 ? " -mt-6" : "")} onClick={() => onJump((i instanceof JumpToGroup ? i.group : i))}>
                            {content}
                        </div>
                    })}
                    { shownItems.length == 0 &&
                        <p className="p-4 pb-2">No results</p>
                    }
                </div>
            }
        </div>
    )
}

function UnmatchedGroupHeader({ group }: { group: Group }) {
    const { primary, secondary } = group.headerStrings()
    return <div className="pb-2 pt-11">
        <p className="text-neutral-500"><span className="font-semibold">{primary}</span> {secondary}</p>
    </div>
}

function groupMatchesSearch(group: Group, searchTerm: string): boolean {
    const { primary, secondary } = group.headerStrings()
    return primary.toLowerCase().includes(searchTerm.toLowerCase()) || (secondary?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false)
}

function combinationMatchesSearch(combination: Combination, searchTerm: string): boolean {
    const lt = searchTerm.toLowerCase()
    if(combination instanceof TrackCombination) {
        return combination.trackName.toLowerCase().includes(lt) || combination.artistName.toLowerCase().includes(lt) || combination.albumName.toLowerCase().includes(lt)
    } else if (combination instanceof ArtistCombination) {
        return combination.artistName.toLowerCase().includes(lt)
    } else {
        throw Error("combination is not TrackCombination or ArtistCombination")
    }
}