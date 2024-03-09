import { ArrowRight } from "phosphor-react-sc";

export interface LandingCardProps { title: string,
    text: React.ReactNode,
    illustration: React.ReactNode,
    hideGradient?: boolean,
    index: number,
    buttonText?: string,
    className?: string,
}
export function LandingCard(
    { title, text, illustration, hideGradient, index, buttonText, className }: LandingCardProps
) {
    return (
        <div className={"flex flex-col rounded-2xl group shadow-outset dark:shadow-outsetDark dark:bg-neutral-100 " + (className ? className : "")}>
            <div className="relative overflow-hidden h-full">
                {illustration}
                <p className="absolute bottom-1 left-6 z-20 font-serif text-2xl font-semibold">{index + 1}.</p> 
                { (hideGradient != true) && <div className="absolute bottom-0 left-0 w-full h-[20%] backdrop-blur-md [mask:linear-gradient(transparent,white_99%)]"></div> }
                { (hideGradient != true) && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white dark:from-neutral-100 to-transparent"></div> }
            </div>
            <div className="flex flex-col p-6 pt-1 gap-4">
                <div className="flex flex-col gap-1">
                    <p className="font-semibold">{title}</p>
                    <p className="text-neutral-600">{text}</p>
                </div>
                { buttonText &&
                    <div className="flex items-center gap-2 text-green-600">
                        <p className="font-semibold relative after:bg-green-500 after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 group-hover:after:w-full after:transition-all after:duration-200">{buttonText}</p>
                        <ArrowRight weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                }
            </div>
        </div>
    )
}