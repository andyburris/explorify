"use client"

import { HistoryEntry } from '@/app/data/model/HistoryEntry'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React from 'react'
import { CombinationItem } from './CombinationItem'
import { ArtistCombination, Combination, Group, TrackCombination } from '@/app/data/model/Group'
import { LazyList } from './LazyList'
import { GroupHeader } from './GroupHeaderItem'
import { ViewOptions } from '@/app/data/model/ViewOptions'

class GroupData {
  constructor(public group: Group) {}
}
type ListItem = IndexedCombination | GroupData
interface IndexedCombination { index: number, combination: Combination }

export function DataTable({ groups, viewOptions }: { groups: Group[], viewOptions: ViewOptions }) {
  const flattened: ListItem[] = groups.flatMap((g) => {
    const groupData = new GroupData(g)
    const indexedCombinations = viewOptions.showItems ? g.combinations.map((c, i) => { return { index: i, combination: c } }) : []
    return [groupData, ...indexedCombinations]
   } )

  return (
    <LazyList 
      items={flattened} 
      itemContent={(index) => {
        const listItem = flattened[index]
        if(listItem instanceof GroupData) {
          return <GroupHeader group={listItem.group} viewOptions={viewOptions}/>
        } else {
          return <CombinationItem combination={listItem.combination} indexInGroup={listItem.index} viewOptions={viewOptions}/>
        }
      }}/>
  )

}