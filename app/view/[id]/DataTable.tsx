"use client"

import { HistoryEntry } from '@/app/data/model/HistoryEntry'
import React, { useState } from 'react'
import { CombinationItem } from './item/CombinationItem'
import { Group } from '@/app/data/model/Group'
import { LazyList } from '../../common/LazyList'
import { GroupHeader } from './item/GroupHeaderItem'
import { ViewOptions } from '@/app/data/model/ViewOptions'
import { ListenItem } from './item/ListenItem'
import { ExpandItem } from './item/ExpandItem'
import { Combination, ArtistCombination } from '@/app/data/model/Combination'

type ListItem = IndexedCombination | GroupData | IndexedHistoryEntry | ExpandGroup
class GroupData { constructor(public group: Group) {} }
class IndexedCombination { constructor(public index: number, public combination: Combination, public isExpanded: boolean){} }
class IndexedHistoryEntry { constructor(public isFirst: boolean, public isLast: boolean, public listen: HistoryEntry, public showSong: boolean){} }
class ExpandGroup { constructor(public group: Group, public isExpanded: boolean, public amountRemaining: number){} }

export function DataTable({ groups, viewOptions, header }: { groups: Group[], viewOptions: ViewOptions, header: React.ReactNode }) {
  const [expandedGroups, setExpandedGroups] = useState<Group[]>([])
  const [expandedCombinations, setExpandedCombinations] = useState<Combination[]>([])

  const flattened: ListItem[] = flattenGroups(groups, viewOptions, expandedCombinations, expandedGroups)

  return (
    <LazyList 
      header={header}
      items={flattened} 
      itemContent={(index) => {
        const listItem = flattened[index]
        return (listItem instanceof GroupData)
          ? <GroupHeader group={listItem.group} viewOptions={viewOptions}/>
          : (listItem instanceof IndexedCombination)
          ? <CombinationItem 
              combination={listItem.combination} 
              indexInGroup={listItem.index} 
              viewOptions={viewOptions}
              isExpanded={listItem.isExpanded}
              onToggleExpand={() => {
                if(expandedCombinations.includes(listItem.combination)) {
                  setExpandedCombinations(expandedCombinations.filter(c => c != listItem.combination))
                } else {
                  setExpandedCombinations([...expandedCombinations, listItem.combination])
                }
              }}/>
          : (listItem instanceof IndexedHistoryEntry)
            ? <ListenItem listen={listItem.listen} isFirst={listItem.isFirst} isLast={listItem.isLast} previewSongInfo={listItem.showSong}/>
          : <ExpandItem 
              amountRemaining={listItem.amountRemaining} 
              isExpanded={listItem.isExpanded} 
              onClick={() => {
                if(expandedGroups.includes(listItem.group)) {
                  setExpandedGroups(expandedGroups.filter(c => c != listItem.group))
                } else {
                  setExpandedGroups([...expandedGroups, listItem.group])
                }
              }
        } />
      }}/>
  )
}

const amountToShowCollapsed = 10
function flattenGroups(
  groups: Group[], 
  viewOptions: ViewOptions, 
  expandedCombinations: Combination[],
  expandedGroups: Group[],
): ListItem[] {
  return groups.flatMap((g) => {
    const groupData = new GroupData(g)
    const isExpanded = expandedGroups.includes(g)
    const shownCombinations = isExpanded ? [...g.combinations] : [...g.combinations.slice(0, amountToShowCollapsed), ]
    const indexedCombinations = viewOptions.showItems ? shownCombinations.flatMap((c, i) => flattenCombinations(c, expandedCombinations.includes(c))) : []
    const needsExpandItem = g.combinations.length > amountToShowCollapsed
    const expandItem = needsExpandItem
      ? isExpanded
        ? [new ExpandGroup(g, true, 0)]
        : [new ExpandGroup(g, false, g.combinations.length - amountToShowCollapsed)]
      : [] 
    return [groupData, ...indexedCombinations, ...expandItem]
   } )
}

function flattenCombinations(combination: Combination, isExpanded: boolean): ListItem[] {
  const indexedCombination = new IndexedCombination(combination.index, combination, isExpanded)
  const listens = (isExpanded) ? combination.listens.map((l, i) => new IndexedHistoryEntry(i == 0, i == combination.listens.length - 1, l, combination instanceof ArtistCombination)) : []
  return [indexedCombination, ...listens]
}