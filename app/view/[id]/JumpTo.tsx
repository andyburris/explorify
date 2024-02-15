import { useState } from "react";
import { ActionButton } from "@/app/common/button/ActionButton";
import { CaretDoubleUp, Plus, X } from "phosphor-react-sc";
import { Group } from "@/app/data/model/Group";
import { ArtistCombination, Combination, TrackCombination } from "@/app/data/model/Combination";
import { GroupHeader } from "./item/GroupHeaderItem";
import { CombinationItem } from "./item/CombinationItem";
import { DisplayOperation } from "./DataTable";

type JumpToItem = JumpToGroup | Combination
class JumpToGroup { public constructor(public group: Group, public matchesSearch: boolean){} }

export interface JumpToProps { searchTerm: string, groups: Group[], displayOperation: DisplayOperation, onSearchTermChange: (term: string) => void, onJump: (item: Group | Combination) => void, onClose: () => void }
export function JumpTo({ searchTerm, groups, displayOperation, onSearchTermChange, onJump, onClose }: JumpToProps) {
    const filteredItems: JumpToItem[] = groups.flatMap(g => {
        const filteredCombinations = g.combinations.filter(c => combinationMatchesSearch(c, searchTerm))
        const jumpToGroup = new JumpToGroup(g, groupMatchesSearch(g, searchTerm))
        const shownCombinations = displayOperation.viewOptions.showItems ? filteredCombinations : []
        if(shownCombinations.length > 0 || jumpToGroup.matchesSearch) return [jumpToGroup, ...shownCombinations]
        else return []
    })
    const shownItems = filteredItems.slice(0, 15)
    
    return (
        <div className="flex flex-col shadow-outset bg-white rounded-2xl overflow-hidden">
            <div className="flex gap-2 pr-2 items-center">
                <input 
                    placeholder="Jump to..." 
                    className={"p-4 bg-transparent w-full rounded-tl-2xl outline-none " + (searchTerm.length > 0 ? "" : "rounded-bl-2xl") }
                    value={searchTerm} 
                    onChange={e => onSearchTermChange(e.target.value)}
                    />
                { searchTerm.length > 0 && <ActionButton onClick={() => onSearchTermChange("")} icon={<X/>} hideShadow className="flex-shrink-0"/> }
                <ActionButton onClick={onClose} icon={<CaretDoubleUp/>} hideShadow className="flex-shrink-0"/>
            </div>
            { searchTerm.length > 0 && 
                <div className="border-t border-neutral-200 pb-2 overflow-hidden px-2">
                    {shownItems.map((i, index) => {
                        let content: React.ReactNode
                        if(i instanceof JumpToGroup) {
                            content = (i.matchesSearch)
                                ? <GroupHeader group={i.group} displayOperation={displayOperation}/>
                                : <UnmatchedGroupHeader group={i.group}/>
                        } else {
                            content = <CombinationItem combination={i} indexInGroup={i.rank} displayOperation={displayOperation} onToggleExpand={() => {}} />
                        }
                        
                        const margin = (index != 0) 
                            ? (i instanceof JumpToGroup && i.matchesSearch)
                                ? " -mt-2" + (displayOperation.viewOptions.showGroupRanks ? " ml-12" : "")
                                : ""
                            : (i instanceof JumpToGroup && i.matchesSearch)
                                ? " -mt-8" + (displayOperation.viewOptions.showGroupRanks ? " ml-12" : "")
                                : " -mt-2"
                        return (
                            <div 
                                key={index} 
                                className={"px-2 rounded-xl hover:bg-neutral-100 cursor-pointer" + margin} 
                                onClick={() => onJump((i instanceof JumpToGroup ? i.group : i))}
                                >
                                {content}
                            </div>
                        )
                    })}
                    { shownItems.length < filteredItems.length &&
                        <div className="flex p-2 gap-4 items-center text-neutral-500">
                            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-neutral-100 text-lg"><Plus/></div>
                            <p className="font-semibold">{filteredItems.length - shownItems.length} more items, search more to see more</p>
                        </div>
                    }
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
    return <div className="py-2 mt-4">
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