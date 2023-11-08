"use client"

import { HistoryEntry } from '@/app/data/model/HistoryEntry'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React from 'react'
import { ArtistCombinationItem, ListenItem, TrackCombinationItem } from './CombinationItem'
import { ArtistCombination, Combination, Group, TrackCombination } from '@/app/data/model/Group'
import { LazyList } from './LazyList'
import { GroupHeader } from './GroupHeaderItem'

class GroupData {
  constructor(public group: Group) {}
}
type ListItem = Combination | GroupData

export function DataTable({ groups }: { groups: Group[] }) {
  const flattened: ListItem[] = groups.flatMap((g) => [new GroupData(g), ...g.combinations] )

  return (
    <LazyList 
      items={flattened} 
      itemContent={(index) => {
        const listItem = flattened[index]
        if(listItem instanceof GroupData) {
          return <GroupHeader group={listItem.group} />
        } else if(listItem instanceof TrackCombination) {
          return <TrackCombinationItem trackCombination={listItem}/>
        } else {
          return <ArtistCombinationItem artistCombination={listItem as ArtistCombination}/>
        }
      }}/>
  )

}