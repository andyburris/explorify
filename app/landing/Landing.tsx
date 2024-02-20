"use client"

import { ArrowRight, Globe, Upload } from "phosphor-react-sc";
import { Container } from "../common/Container";
import { Logo } from "../common/Logo";
import { Button, LinkButton, StaticButton } from "../common/button/Button";
import { LandingPreview, PresetScreenPreview } from "./LandingPreview";
import { defaultPresets } from "../data/Defaults";
import Link from "next/link";
import { LandingCard } from "./LandingCard";
import Image from "next/image";

export function LandingPage() {
    return (
        <Container>
            <div className="flex items-center gap-3 py-4">
                <Logo/>
                <h2 className="font-serif tracking-tight text-3xl font-semibold w-full">Quantify</h2>
                <LinkButton icon={<Upload/>} text="Import" linkPath="/import" className="flex-shrink-0"/>
            </div>
            <LandingPreview
                overlayContent={
                    <div className="flex flex-col gap-2 px-4 py-4">
                        <h1 className="font-serif font-semibold tracking-tight text-5xl/[50px] max-w-96 text-balance">Change how you view your music</h1>
                        <p className="text-neutral-600">Quantify lets you explore everything you want to know about your streaming history, down to the last listen.</p>
                    </div>
                }/>
            <Link href="/import" className="flex gap-4 p-4 rounded-2xl bg-green-50 border border-green-200">
                <div className="flex flex-col">
                    <p className="font-serif tracking-tight text-2xl font-semibold text-green-900">Already have your listening history?</p>
                    <p className="text-green-700">Import the .zip file you got from Spotify and start exploring your listening! </p>
                </div>
                <ArrowRight className="text-green-700 text-2xl flex-shrink-0" />
            </Link>
            <div className="flex flex-col p-4 gap-1">
                <h2 className="font-serif tracking-tight text-3xl font-semibold w-full">How it works</h2>
                <p className="text-neutral-600">Spotify lets you export a record of <span className="font-semibold">every single stream</span>. It’s incredibly cool. But it’s a long, hard to understand file—that’s what Quantify helps with.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <button className="text-left" onClick={() => {}}>
                    <LandingCard
                        title="Export your Extended Streaming History from Spotify"
                        text="The process is a little complicated, but we’ll walk you through it—it’s worth it."
                        illustration={<div className="flex flex-col items-center p-3 gap-3">
                            <div className="flex items-center justify-center gap-1 p-1 w-full max-w-48 bg-neutral-100 border border-neutral-200 rounded-xl">
                                <Globe className="text-neutral-400 text-base"/>
                                <p className="text-neutral-500 text-base">spotify.com</p>
                            </div>
                            <div className="bg-[#121212] p-3 rounded-t-xl shadow-outset">
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
                </button>
                <Link href="/import">
                    <LandingCard
                        title="Import your history to Quantify"
                        text="Your data stays on your device and is never uploaded to any servers."
                        illustration={<div className="flex flex-col items-center justify-center h-full p-3 gap-3">
                            <StaticButton icon={<Upload/>} text="Import" />
                        </div>}
                        hideGradient
                        index={1}
                        buttonText="Import"
                        className="h-96"
                        />
                </Link>
                <LandingCard
                    title="Explore preset views"
                    text="See everything from your top albums to the days you discovered the most music. All with precise play counts, timestamps, and more."
                    illustration={<div className="flex flex-col items-center justify-center h-full p-3 gap-3">
                        <StaticButton icon={<Upload/>} text="Import" />
                    </div>}
                    index={2}
                    className="h-96"
                    />
                <LandingCard
                    title="Create your own views"
                    text="With Quantify’s customizable filtering and sorting options, you can easily answer any question you have about your listening."
                    illustration={<div className="flex flex-col items-center justify-center h-full p-3 gap-3">
                        <StaticButton icon={<Upload/>} text="Import" />
                    </div>}
                    index={3}
                    className="h-96"
                    />
            </div>
        </Container>
    )
}