import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, Globe, List, ListNumbers, MagnifyingGlass, MusicNote, Percent, Play, SkipForward, SortAscending, Upload, User } from "phosphor-react-sc";
import { CalloutCard } from "../common/CalloutCard";
import { Container } from "../common/Container";
import { Logo } from "../common/Logo";
import { PickedIcon } from "../common/PickedIcon";
import { LinkButton, StaticButton } from "../common/button/Button";
import { defaultPresets } from "../data/Defaults";
import { LandingCard } from "./LandingCard";
import { LandingPreview } from "./LandingPreview";

export function LandingPage() {
    return (
        <Container>
            <div className="flex items-center gap-3 py-4">
                <Logo/>
                <h2 className="font-serif tracking-tight text-3xl font-semibold w-full">Explorify</h2>
                <LinkButton icon={<Upload/>} text="Import" linkPath="/import" className="flex-shrink-0"/>
            </div>
            <LandingPreview
                overlayContent={
                    <div className="flex flex-col gap-2 px-4 py-4">
                        <h1 className="font-serif font-semibold tracking-tight text-5xl/[50px] max-w-96 text-balance">Change how you view your music</h1>
                        <p className="text-neutral-600">Explorify shows you everything you want to know about your streaming history, down to the last listen.</p>
                    </div>
                }/>
            <Link href="/import">
                <CalloutCard
                    title="Already have your streaming history?"
                    text="Import the .zip file you got from Spotify and start exploring your listening!"
                    leftIcon={cn => <Upload className={cn}/>}
                    rightIcon={<ArrowRight/>}
                />
            </Link>
            <div className="flex flex-col p-4 gap-1">
                <h2 className="font-serif tracking-tight text-3xl font-semibold w-full">How it works</h2>
                <p className="text-neutral-600">Spotify lets you export a record of <span className="font-semibold">every time you've streamed a song</span>. It’s incredibly cool. But it’s a long, hard to understand file—that’s what Explorify helps with.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/instructions">
                    <LandingCard
                        title="Export your Extended Streaming History from Spotify"
                        text="The process is a little complicated, but we’ll walk you through it—it’s worth it."
                        illustration={<div className="flex flex-col items-center p-3 gap-3">
                            <div className="flex items-center justify-center gap-1 p-1 w-full max-w-48 bg-neutral-100 group-hover:bg-green-100 border border-neutral-200 group-hover:border-green-200 rounded-xl transition-colors">
                                <Globe className="text-neutral-400 group-hover:text-green-600 text-base transition-colors"/>
                                <p className="text-neutral-500 group-hover:text-green-700 text-base transition-colors">spotify.com</p>
                            </div>
                            <div className="bg-[#121212] p-3 rounded-t-xl shadow-outset relative after:absolute after:-inset-0.5 after:-z-10 after:bg-gradient-to-r after:from-green-400 after:to-green-600 after:blur-sm after:rounded-t-2xl after:opacity-0 group-hover:after:opacity-70 after:transition-all">
                                <Image 
                                    src="/SpotifyPrivacyPageCropped.png"
                                    width={200}
                                    height={200}
                                    sizes="50vw, 25vw, 12vw, 5vw"
                                    alt="The Spotify Privacy page"/>
                            </div>
                        </div>}
                        index={0}
                        buttonText="Instructions"
                        className="h-96"
                        />
                </Link>
                <Link href="/import">
                    <LandingCard
                        title="Import your history to Explorify"
                        text="Your data stays on your device and is never uploaded to any servers."
                        illustration={<div className="flex flex-col items-center justify-center h-full p-3 gap-3">
                            <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-200 group-hover:bg-green-50 border border-neutral-200 group-hover:border-green-100 transition-colors">
                                <div className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-300 group-hover:bg-green-100 border border-neutral-300 group-hover:border-green-200 transition-colors">
                                    <StaticButton icon={<Upload/>} text="Import" className="!bg-neutral-600 !text-neutral-50 group-hover:!bg-green-600 group-hover:!text-green-50" />
                                </div>
                            </div>
                        </div>}
                        hideGradient
                        index={1}
                        buttonText="Import"
                        className="h-96"
                        />
                </Link>
                <LandingCard
                    title="Explore default views"
                    text="See everything from your top albums to the days you discovered the most music. All with precise play counts, timestamps, and more."
                    illustration={<div className="flex flex-col h-full p-2 gap-2">
                        { Array.from({ length: 4 }, (_, i) => {
                            return (
                                <div className={"flex gap-2 items-stretch " + (i % 3 == 0 ? "justify-start" : i % 3 == 1 ? "justify-center" : "justify-end")} key={i}>
                                    { defaultPresets.map(p => 
                                        <div 
                                            className="flex flex-col justify-end gap-1 bg-neutral-100 text-neutral-500 group-hover:bg-green-100 group-hover:text-green-700 transition-colors p-3 pt-6 pr-5 rounded-xl w-fit" 
                                            key={p.id}
                                            >
                                            <PickedIcon iconName={p.icon}/>
                                            <p className="w-max font-semibold text-base">{p.name}</p>
                                        </div>
                                    ) }
                                </div>
                            )
                        })}
                    </div>}
                    index={2}
                    className="h-80"
                    />
                <LandingCard
                    title="Create your own views"
                    text="With Explorify’s customizable grouping, filtering, and sorting options, you can easily answer any question you have about your listening."
                    illustration={<div className="flex flex-col h-full p-2 gap-2">
                        <div className="flex gap-2 w-full">
                            <FilterChip icon={<Clock/>} text="Group by hour"/>
                            <FilterChip icon={<SkipForward/>} text="No skips" selected/>
                            <FilterChip icon={<User/>} text="Sort by artist name"/>
                            <FilterChip icon={<MagnifyingGlass/>} text="Search by"/>
                        </div>
                        <div className="flex gap-2 w-full justify-center">
                            <FilterChip icon={<Calendar/>} text="Sort by day of week"/>
                            <FilterChip icon={<MusicNote/>} text="Combine same song" selected/>
                            <FilterChip icon={<CalendarBlank/>} text="Group by year"/>
                        </div>
                        <div className="flex gap-2 w-full justify-end">
                            <FilterChip icon={<ArrowsOutLineVertical/>} text="Combine across groups"/>
                            <FilterChip icon={<Clock/>} text="Sort by playtime" selected/>
                            <FilterChip icon={<ListNumbers/>} text="Show group ranks"/>
                        </div>
                        <div className="flex gap-2 w-full">
                            <FilterChip icon={<Play/>} text="Sort items by plays"/>
                            <FilterChip icon={<Percent/>} text="Show percent" selected/>
                            <FilterChip icon={<List/>} text="Show items"/>
                            <FilterChip icon={<SortAscending/>} text="Sort by month"/>
                        </div>
                    </div>}
                    index={3}
                    className="h-80"
                    />
            </div>
        </Container>
    )
}

function FilterChip({ icon, text, selected }: { icon: React.ReactNode, text: string, selected?: boolean }) {
    return (
        <div 
            className={`flex items-center px-3 py-2 gap-2 rounded-full border transition-colors ${selected ? "text-neutral-900 bg-neutral-100 border-neutral-200 group-hover:bg-green-100 group-hover:border-green-200 group-hover:text-green-900" : "text-neutral-500 border-neutral-100"}`
            }>
            {icon}
            <p className={`text-base w-max`}>{text}</p>
        </div>
    )
}