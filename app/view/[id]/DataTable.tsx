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
import { InfoOperation, Operations } from '@/app/data/model/Operations'
import { NoResultsItem } from './item/NoResultsItem'
import { Listen } from '@/app/data/model/Listen'

export interface DisplayOperation { viewOptions: ViewOptions, infoOperation: InfoOperation }

type ListItem = IndexedCombination | GroupData | IndexedListen | ExpandGroup | NoResults
class GroupData { constructor(public group: Group) {} }
class IndexedCombination { constructor(public index: number, public combination: Combination, public isExpanded: boolean){} }
class IndexedListen { constructor(public isFirst: boolean, public isLast: boolean, public listen: Listen, public showSong: boolean){} }
class ExpandGroup { constructor(public group: Group, public isExpanded: boolean, public amountRemaining: number){} }
class NoResults { constructor(){} }

export function DataTable({ groups, operations, header, scrollToItem }: { groups: Group[], operations: Operations, header: React.ReactNode, scrollToItem?: Group | Combination }) {
  const displayOperation: DisplayOperation = { viewOptions: operations.viewOptions, infoOperation: operations.info }
  
  const [expandedGroups, setExpandedGroups] = useState<Group[]>([])
  const [expandedCombinations, setExpandedCombinations] = useState<Combination[]>([])

  const flattened: ListItem[] = flattenGroups(groups, operations.viewOptions, expandedCombinations, expandedGroups)

  let scrollToIndex = undefined
  if(scrollToItem !== undefined) {
    console.log(`finding index for scrollToItem = ${scrollToItem}`)
    if(scrollToItem instanceof Group) {
      scrollToIndex = flattened.findIndex(li => (li instanceof GroupData) && li.group == scrollToItem)
      console.log(`found index = ${scrollToIndex}`)
    } else {
      const combinationParentGroup = groups.find(g => g.combinations.includes(scrollToItem))
      if(combinationParentGroup) {
        if(!expandedGroups.includes(combinationParentGroup)) setExpandedGroups([...expandedGroups, combinationParentGroup])
        scrollToIndex = flattened.findIndex(li => (li instanceof IndexedCombination) && li.combination == scrollToItem)
        console.log(`found index = ${scrollToIndex}`)
      }
    }
  }

  return (
    <LazyList 
      header={header}
      items={flattened} 
      scrollToIndex={scrollToIndex}
      itemContent={(index) => {
        const listItem = flattened[index]
        return (listItem instanceof GroupData)
          ? <GroupHeader group={listItem.group} displayOperation={displayOperation}/>
          : (listItem instanceof IndexedCombination)
          ? <CombinationItem 
              combination={listItem.combination} 
              indexInGroup={listItem.combination.rank} 
              displayOperation={displayOperation}
              isExpanded={listItem.isExpanded}
              onToggleExpand={() => {
                if(expandedCombinations.includes(listItem.combination)) {
                  setExpandedCombinations(expandedCombinations.filter(c => c != listItem.combination))
                } else {
                  setExpandedCombinations([...expandedCombinations, listItem.combination])
                }
              }}/>
          : (listItem instanceof IndexedListen)
            ? <ListenItem listen={listItem.listen} isFirst={listItem.isFirst} isLast={listItem.isLast} previewSongInfo={listItem.showSong}/>
          : (listItem instanceof ExpandGroup)
            ? <ExpandItem 
                key={listItem.group.id}
                amountRemaining={listItem.amountRemaining} 
                isExpanded={listItem.isExpanded} 
                onClick={() => {
                  if(expandedGroups.includes(listItem.group)) {
                    setExpandedGroups(expandedGroups.filter(c => c != listItem.group))
                  } else {
                    setExpandedGroups([...expandedGroups, listItem.group])
                  }
                }} />
            : <NoResultsItem/>
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
  const allItems = groups.flatMap((g) => {
    const groupData = new GroupData(g)
    const isExpanded = expandedGroups.includes(g)
    const shownCombinations = isExpanded ? [...g.combinations] : [...g.combinations.slice(0, amountToShowCollapsed), ]
    const indexedCombinations = viewOptions.showItems ? shownCombinations.flatMap((c, i) => flattenCombinations(c, expandedCombinations.includes(c))) : []
    const needsExpandItem = g.combinations.length > amountToShowCollapsed && viewOptions.showItems
    const expandItem = needsExpandItem
      ? isExpanded
        ? [new ExpandGroup(g, true, 0)]
        : [new ExpandGroup(g, false, g.combinations.filter(c => c.visiblePlays > 0).length - amountToShowCollapsed)]
      : [] 
    return [groupData, ...indexedCombinations, ...expandItem]
   } )
   if(allItems.length > 0) return allItems
   else return [new NoResults()]
}

function flattenCombinations(combination: Combination, isExpanded: boolean): ListItem[] {
  if(combination.visiblePlays <= 0) return []
  const indexedCombination = new IndexedCombination(combination.rank, combination, isExpanded)
  const listens = (isExpanded) ? combination.listens.map((l, i) => new IndexedListen(i == 0, i == combination.listens.length - 1, l, combination instanceof ArtistCombination)) : []
  return [indexedCombination, ...listens]
}