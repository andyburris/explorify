"use client" //TODO: remove and replace useSearchParams

import { parseHash } from "@/app/data/hashing/Hashing"
import { Preset } from "@/app/data/model/Preset"
import { Base64 } from "@/app/data/utils/base64"
import { PresetPage } from "@/app/view/[id]/PresetPage"
import { useSearchParams } from "next/navigation"

export default function SharedPage({ params }: { params: { hash: string } }) {
    const searchParams = useSearchParams()
    const preset: Preset = { 
        id: "", 
        name: searchParams.has("t") ? Base64.decode(searchParams.get("t")!) : "Shared preset", 
        description: searchParams.has("d") ? Base64.decode(searchParams.get("d")!) : `You probably got this link from someone. Customize to make it your own and save it!`, 
        icon: searchParams.has("i") ? Base64.decode(searchParams.get("i")!) : "share",
        operations: parseHash(params.hash)
    }

    return (
        <PresetPage initialPreset={preset} isShared={searchParams.has("t")} />
    )
}