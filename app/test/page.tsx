"use client"

import React, { useEffect, useState } from "react";
import { Container } from "../common/Container";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Header } from "../common/Header";
import { Gear } from "phosphor-react-sc";
import { IconLogo, Logo } from "../common/Logo";
import { Button } from "../common/button/Button";
import { ActionButton } from "../common/button/ActionButton";

export default function TestPage() {
    // The scrollable element for your list
    const listRef = React.useRef<HTMLDivElement | null>(null)
    const [savedMargin, setSavedMargin] = useState(-1)

    useEffect(() => {
        const offset = listRef.current?.offsetTop ?? 0
        if(offset > 0 && savedMargin == -1) {
            setSavedMargin(offset)
        }
    }, [listRef.current?.offsetTop])

    // The virtualizer
    const virtualizer = useWindowVirtualizer({
        count: 10000,
        estimateSize: () => 64,
        overscan: 1,
        scrollMargin: savedMargin ?? 0,
      })

    const [clickState, setClickState] = useState(false)

    return (
        <div>
            <div className="py-8">
                <Header title="Test Page" icon={<IconLogo iconName="list"/>} actions={<ActionButton text={clickState ? "Test 1" : "Test 2"} onClick={() => setClickState(!clickState)}/>} />
            </div>

            {/* The scrollable element for your list */}
            <div className="block">
            <div
                ref={listRef}
                className={"w-full h-full"}
                style={{ marginTop: -(savedMargin ?? 0) }}
                // style={{ marginTop: -(listRef.current?.offsetTop ?? 0) }}
            >
                {/* The large inner element to hold all of the items */}
                <div
                    className="w-full relative"
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                    }}
                >
                {/* Only the visible items in the virtualizer, manually positioned to be in view */}
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                    }}
                    >
                    <TestItem index={virtualItem.index} />
                    </div>
                ))}
                </div>
            </div>
        </div>
        </div>
    )
}

function TestItem({ index }: { index: number }) {
    const [clickState, setClickState] = useState(false)
    return (
        <div className="flex gap-3 p-3 items-center w-full hover:bg-neutral-50 rounded-2xl" onClick={() => setClickState(!clickState)}>
            <div className="h-10 w-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500">{index}</div>
            <p className="font-bold">Item {index}</p>
            { clickState && <p className="text-neutral-500">Selected</p> }
        </div>
    )
}