import { EndReason, HistoryEntry, StartReason } from "@/app/data/model/HistoryEntry";
import { Cloud, CloudSlash, Devices, Hourglass, Link, Minus, MusicNote, Play, Plus, Shuffle, SkipForward, Stop, User, VinylRecord } from "phosphor-react-sc";
import { useState } from "react";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
}

const timeFormatOptions: Intl.DateTimeFormatOptions = {
    minute: "numeric",
    second: "2-digit"
}

export function ListenItem({ listen, isFirst, isLast, previewSongInfo }: { listen: HistoryEntry, isFirst: boolean, isLast: boolean, previewSongInfo: boolean }) {
    const [isExpanded, setExpanded] = useState(false)

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={"w-[1px] h-5 flex-shrink-0" + (isFirst ? "" : "  bg-neutral-200")}></div>
                <div className="w-2 h-2 bg-neutral-200 rounded-full flex-shrink-0"></div>
                <div className={"w-[1px] h-full flex-shrink" + (isLast ? "" : "  bg-neutral-200")}></div>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center py-2 gap-2 min-h-[32px]">
                    <div className="flex flex-col flex-grow flex-shrink w-min">
                        <p className="font-semibold [word-break:break-word]">{listen.timestamp.toLocaleDateString('en-US', dateFormatOptions)}</p>
                        { (previewSongInfo && !isExpanded) && <p className="text-neutral-500 [word-break:break-word]">{listen.trackName}</p> }

                    </div>
                    <div className="flex gap-1">
                        <div 
                            className="flex gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-full items-center text-neutral-500 cursor-pointer"
                            onClick={() => setExpanded(!isExpanded)}
                        >
                            <span className="text-md">{ isExpanded ? <Minus/> : <Plus/>}</span>
                            <span className="max-sm:hidden">{isExpanded ? "Show less" : "More"}</span>
                        </div>
                    </div>
                    
                </div>
                {isExpanded && 
                    <div className="flex flex-col gap-3 pb-4">
                        <InfoItem text={listen.trackName} icon={<MusicNote/>}/>
                        <InfoItem description="by" text={listen.artistName} icon={<User/>}/>
                        <InfoItem description="on" text={listen.albumName} icon={<VinylRecord/>}/>
                        <InfoItem description="played for" text={millisToMinsSecs(listen.millisecondsPlayed)} icon={<Hourglass/>}/>
                        <InfoItem description="started because:" text={startReasonInfo(listen.startReason)} icon={<Play/>}/>
                        <InfoItem description="ended because:" text={endReasonInfo(listen.endReason)} icon={<Stop/>}/>
                        <InfoItem text={listen.offline ? "Offline" : "Online"} icon={listen.offline ? <CloudSlash/> : <Cloud/>}/>
                        <InfoItem text={listen.shuffle ? "Shuffled" : "Not shuffled"} icon={listen.shuffle ? <Shuffle/> : <Shuffle/>}/>
                        <InfoItem description="played on" text={listen.platform} icon={<Devices/>}/>
                        <InfoItem text={listen.uri} icon={<Link/>} />
                    </div>
                }
            </div>
        </div>        
    )
}

function InfoItem({ description, text, icon, className }: { description?: string, text: string, icon: React.ReactNode, className?: string }) {
    return (
        <div className={"flex gap-3 items-center" + (className != undefined ? ` ${className}` : "") }>
            <span className="text-md text-neutral-500 flex-shrink-0">{icon}</span>
            <p>
                { description && <span className="text-neutral-500">{description} </span> }
                <span className="">{text}</span>
            </p>
        </div>
    )
}

export function millisToMinsSecs(milliseconds: number) {
    const seconds = milliseconds / 1000
    const roundedSeconds = Math.round(seconds)
    const minutes = Math.round(roundedSeconds / 60)
    const remainingSeconds = roundedSeconds % 60
    const hours = Math.round(roundedSeconds / (60 * 60))
    const remainingMinutes = minutes % 60
    return (hours > 0) 
        ? `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        : `${minutes}${remainingSeconds.toString().padStart(2, '0')}`
}

function startReasonInfo(startReason: StartReason): string {
    switch (startReason) {
        case StartReason.AppLoad: return "App loaded"
        case StartReason.BackButton: return "Back button pressed"
        case StartReason.ClickRow: return "Song clicked"
        case StartReason.ForwardButton: return "Forward button pressed"
        case StartReason.Persisted: return "Persisted"
        case StartReason.PlayButton: return "Play button pressed"
        case StartReason.Remote: return "Remote"
        case StartReason.TrackDone: return "Previous track ended"
        case StartReason.TrackError: return "Previous track invalid"
        case StartReason.Unknown: return "Unknown"
    }
}

function endReasonInfo(endReason: EndReason): string {
    switch (endReason) {
        case EndReason.BackButton: return "Back button pressed"
        case EndReason.EndPlay: return "Song clicked"
        case EndReason.ForwardButton: return "Forward button pressed"
        case EndReason.Logout: return "Logout"
        case EndReason.PlayButton: return "Play button pressed"
        case EndReason.Remote: return "Remote"
        case EndReason.TrackDone: return "Track ended"
        case EndReason.TrackError: return "Track invalid"
        case EndReason.UnexpectedExit: return "Unexpected exit"
        case EndReason.UnexpectedExitWhilePaused: return "Unexpected exit while paused"
        case EndReason.Unknown: return "Unknown"
    }
}