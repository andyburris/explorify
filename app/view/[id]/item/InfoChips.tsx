import { Combination } from "@/app/data/model/Group"
import { ViewInfoType } from "@/app/data/model/ViewOptions"
import { Play } from "phosphor-react-sc"

const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit"
}

export function PrimaryInfo({ combination, primaryInfo }: { combination: Combination, primaryInfo: ViewInfoType }) {
    return (
        <div className="px-3 py-1.5 bg-neutral-100 rounded-full items-center">
            { primaryInfo == ViewInfoType.Date
                ? <p>{combination.listens[0].timestamp.toLocaleDateString('en-US', formatOptions)}</p>
                : <div className="flex gap-0.5 items-center">
                    <p>
                        <span className="font-semibold">{combination.listens.length}</span>
                        <span className="text-neutral-500 max-sm:hidden">{combination.listens.length == 1 ? " play" : " plays"}</span>
                    </p>
                    <Play className="sm:hidden" size="16px" weight="bold"/>
                </div>
            }
        </div>
    )
}
export function SecondaryInfo({ combination, secondaryInfo }: { combination: Combination, secondaryInfo: ViewInfoType }) {
    return (
        <div className="">
            { secondaryInfo == ViewInfoType.Date
                ? <p className="text-neutral-500">{combination.listens[0].timestamp.toLocaleDateString('en-US', formatOptions)}</p>
                : <p className="text-neutral-500">{combination.listens.length} {combination.listens.length == 1 ? " play" : " plays"}</p>
            }
        </div>
    )
}