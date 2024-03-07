import { ArrowRight, Link as LinkIcon, Upload } from "phosphor-react-sc"
import { CalloutCard } from "../common/CalloutCard"
import Link from "next/link"

export function Instructions() {
    return (
        <div className="flex flex-col">
            <InstructionItem
                index={0}
                title="Request your extended streaming history from Spotify"
                text={<div>
                    <p>Scroll to the "Download your data" section. Before clicking "Request data", be sure to: </p>
                    <ul className="text-green-600 font-semibold list-disc ml-4 py-1">
                        <li>Uncheck “Select account data”</li>
                        <li>Check “Select extended streaming history”</li>
                    </ul>
                </div>}
                link={{ title: "Spotify Privacy Page", link: "https://www.spotify.com/us/account/privacy/", icon: (cn) => <LinkIcon className={cn}/> }}
                />
            <InstructionItem
                index={1}
                title="Confirm the data request in your email"
                />
            <InstructionItem
                index={2}
                title="Wait ~2 weeks for Spotify to collect and send you your extended history"
                text={<p>Best we can figure, it takes them this long becasue they need to scrape through their archived databases to get all that information. It's a while to wait, but it’s worth it</p>}
                />
            <InstructionItem
                index={3}
                title="Download the .zip file from the button in the email"
                text={<div>
                    <p>Be sure the email they send you has the subject “Your extended streaming history is ready to download”</p>
                </div>}
                />
            <InstructionItem
                index={4}
                title="Come back to Explorify, import your .zip file, and start exploring!"
                link={{ title: "Import", linkPath: "/import", icon: (cn) => <Upload className={cn}/> }}
                last
                />
        </div>
    )
}

interface InstructionLink { icon: (className: string) => React.ReactNode, title: string, link?: string, linkPath?: string }
function InstructionItem({ index, last, title, text, link, }: { index: number, last?: boolean, title: string, text?: React.ReactNode, link?: InstructionLink, }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-semibold rounded-full bg-green-600 text-green-50">
                    {index + 1}
                </div>
                <div className={`w-0.5 bg-green-600 h-full flex-shrink ${last ? "opacity-0" : "opacity-40"}`}></div>
            </div>
            <div className={"flex flex-col justify-center w-full gap-3 min-h-14 " + (last ? "" : "pb-6")}>
                <div className="flex flex-col gap-0.5 w-full text-neutral-600">
                    <p className="font-semibold text-neutral-900">{title}</p>
                    { text && text }
                </div>
                { link?.link && 
                    <a href={link.link}>
                        <CalloutCard
                            leftIcon={(cn) => link.icon(cn)}
                            rightIcon={<ArrowRight/>}
                            text={<p className="font-semibold">{link.title}</p>}
                            />
                    </a>
                }
                { link?.linkPath && 
                    <Link href={link.linkPath}>
                        <CalloutCard
                            leftIcon={(cn) => link.icon(cn)}
                            rightIcon={<ArrowRight/>}
                            text={<p className="font-semibold">{link.title}</p>}
                            />
                    </Link>
                }
            </div>
        </div>
    )
}