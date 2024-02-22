import { pickableIcons } from "@/app/common/PickedIcon"
import { parseHash } from "@/app/data/hashing/Hashing"
import { Preset } from "@/app/data/model/Preset"
import { Base64 } from "@/app/data/utils/base64"
import { PresetPage } from "@/app/view/[id]/PresetPage"
import { Metadata, ResolvingMetadata } from "next"

type Props = {
    params: { hash: string }
    searchParams: { [key: string]: string | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {   
    const preset: Preset = { 
        id: "", 
        name: searchParams["t"] ? Base64.decode(searchParams["t"]!) : "Shared View", 
        description: searchParams["d"] ? Base64.decode(searchParams["d"]!) : `You probably got this link from someone. Customize to make it your own and save it!`, 
        icon: searchParams["i"] ? pickableIcons[Number.parseInt(searchParams["i"]!, 36)].name : "share",
        operations: parseHash(params.hash)
    }
   
    return {
      title: `${preset.name} • Quantify`,
      description: `${preset.description}`,
    }
  }  

export default function SharedPage({ params, searchParams }: Props) {
    const preset: Preset = { 
        id: "", 
        name: searchParams["t"] ? Base64.decode(searchParams["t"]!) : "Shared View", 
        description: searchParams["d"] ? Base64.decode(searchParams["d"]!) : `You probably got this link from someone. Customize to make it your own and save it!`, 
        icon: searchParams["i"] ? pickableIcons[Number.parseInt(searchParams["i"]!, 36)].name : "share",
        operations: parseHash(params.hash)
    }
    preset.operations.filter.searchTerm = Base64.decode(searchParams["s"] ?? "")

    return (
        <PresetPage initialPreset={preset} isShared={searchParams["t"] !== undefined} />
    )
}