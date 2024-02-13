import { Combination } from "@/app/data/model/Combination"
import { Clock, Play } from "phosphor-react-sc"
import { millisToMinsSecs } from "./ListenItem"
import { InfoType } from "@/app/data/model/Operations"
import { Group } from "@/app/data/model/Group"

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit"
}

export function PrimaryInfo({ combination, primaryInfo }: { combination: Combination, primaryInfo: InfoType }) {
    return (
        <div className="px-3 py-1.5 bg-neutral-100 rounded-full items-center font-semibold">
            <InfoContent combinationOrGroup={combination} infoType={primaryInfo}/>
        </div>
    )
}
export function SecondaryInfo({ combination, secondaryInfo }: { combination: Combination, secondaryInfo: InfoType }) {
    return (
        <div className="text-neutral-500">
            <InfoContent combinationOrGroup={combination} infoType={secondaryInfo}/>
        </div>
    )
}

export function InfoContent({ combinationOrGroup, infoType }: { combinationOrGroup: Combination | Group, infoType: InfoType }) {
    const firstListen = (combinationOrGroup instanceof Group) ? combinationOrGroup.combinations[0].listens[0] : combinationOrGroup.listens[0]
    switch(infoType) {
        case InfoType.Date: return <p>{firstListen.timestamp.toLocaleDateString('en-US', dateFormatOptions)}</p>
        case InfoType.Plays: 
            return <div className="flex gap-0.5 items-center">
                <p>
                    <span className="">{combinationOrGroup.visiblePlays}</span>
                    <span className="text-neutral-500 max-sm:hidden">{combinationOrGroup.visiblePlays == 1 ? " play" : " plays"}</span>
                </p>
                <Play className="sm:hidden" size="16px" weight="bold"/>
            </div>
        case InfoType.Playtime: 
            return <div className="flex gap-0.5 items-center">
                <p className="hidden sm:block">{millisToMinsSecs(combinationOrGroup.visiblePlaytime)}</p>
                <p className="sm:hidden">{millisToMinsSecs(combinationOrGroup.visiblePlaytime, true)}</p>
                <Clock className="" size="16px" weight="bold"/>
            </div>
        case InfoType.Percent: 
            return <p>{(combinationOrGroup.percent * 100).toFixed(2)}%</p>
        case InfoType.Fraction:
            return <p>{combinationOrGroup.numerator}<span className="text-neutral-500">/{combinationOrGroup.denominator}</span></p>
    }
}