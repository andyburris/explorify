"use client"

import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React, { useEffect, useState } from 'react'

export interface LazyListProps<T> { 
  items: T[], 
  itemContent: (itemIndex: number) => React.ReactNode, 
  estimateSize?: number | ((rowIndex: number) => number), 
  className?: string
  header?: React.ReactNode
}

export function LazyList<T>({ items, itemContent, estimateSize, className, header }: LazyListProps<T>) {
  const hasHeader = header !== undefined

  // The scrollable element for your list
  const listRef = React.useRef<HTMLDivElement | null>(null)
  
  // The virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: items.length + (hasHeader ? 1 : 0),
    // getScrollElement: () => listRef.current,
    estimateSize: (index) => (typeof(estimateSize) == 'number' ? estimateSize : (estimateSize === undefined ? 64 : estimateSize(index))),
    overscan: 10,
    // scrollMargin: savedMargin,
  })

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={listRef}
        className={"w-full h-full" + (className ? ` ${className}` : ``)}
        // style={{ marginTop: -savedMargin }}
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
              {(hasHeader && virtualItem.index == 0) && header}
              {!(hasHeader && virtualItem.index == 0) && itemContent(hasHeader ? virtualItem.index - 1 : virtualItem.index)}
            </div>
          ))}
        </div>
      </div>
    </>
  )

}