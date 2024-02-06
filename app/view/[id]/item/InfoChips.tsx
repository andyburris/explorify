import { Combination } from "@/app/data/model/Combination"
import { ViewInfoType } from "@/app/data/model/ViewOptions"
import { Clock, Play } from "phosphor-react-sc"
import { millisToMinsSecs } from "./ListenItem"

const dateFormatOptions: Intl.DateTimeFormatOptions = {
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
                ? <p>{combination.listens[0].timestamp.toLocaleDateString('en-US', dateFormatOptions)}</p>
            : (primaryInfo == ViewInfoType.Playtime)
                ? <div className="flex gap-0.5 items-center">
                    <p className="font-semibold hidden sm:block">{millisToMinsSecs(combination.playtime)}</p>
                    <p className="font-semibold sm:hidden">{millisToMinsSecs(combination.playtime, true)}</p>
                    <Clock className="" size="16px" weight="bold"/>
                </div>
            : (primaryInfo == ViewInfoType.Plays)
                ? <div className="flex gap-0.5 items-center">
                    <p>
                        <span className="font-semibold">{combination.plays}</span>
                        <span className="text-neutral-500 max-sm:hidden">{combination.plays == 1 ? " play" : " plays"}</span>
                    </p>
                    <Play className="sm:hidden" size="16px" weight="bold"/>
                </div>
                : <p>{(combination.percent(primaryInfo) * 100).toFixed(2)}%</p>
            }
        </div>
    )
}
export function SecondaryInfo({ combination, secondaryInfo }: { combination: Combination, secondaryInfo: ViewInfoType }) {
    return (
        <div className="">
            { secondaryInfo == ViewInfoType.Date
                ? <p className="text-neutral-500">{combination.listens[0].timestamp.toLocaleDateString('en-US', dateFormatOptions)}</p>
                : <p className="text-neutral-500">{combination.plays} {combination.plays == 1 ? " play" : " plays"}</p>
            }
        </div>
    )
}