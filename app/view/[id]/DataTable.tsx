"use client"

import { HistoryEntry } from '@/app/data/model/HistoryEntry'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React from 'react'
import { ListenItem } from './CombinationItem'

export function DataTable({ listens }: { listens: HistoryEntry[] }) {
  // The scrollable element for your list
  const listRef = React.useRef<HTMLDivElement | null>(null)

  // The virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: listens.length,
    // getScrollElement: () => listRef.current,
    estimateSize: () => 35,
    overscan: 10,
    // scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={listRef}
        className=" w-full h-full overflow-auto"
        // style={{ marginTop: -(listRef.current?.offsetTop ?? 0) }}
      >
        {/* The large inner element to hold all of the items */}
        <div
            className="w-full relative"
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
            }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ListenItem listen={listens[virtualItem.index]}/>
            </div>
          ))}
        </div>
      </div>
    </>
  )

}