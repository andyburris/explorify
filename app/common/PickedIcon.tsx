import { Calendar, CalendarPlus, Disc, Headphones, IconWeight, List, ListBullets, MusicNote, Plus, Share, SkipBack, SkipForward, Users } from "phosphor-react-sc";

export interface PickableIcon { name: string, component: (color?: string, size?: string, weight?: IconWeight, className?: string) => React.ReactNode }
export const pickableIcons: PickableIcon[] = [
    { name: "musicnote", component: (color, size, weight, className) => <MusicNote color={color} size={size} weight={weight} className={className}/> },
    { name: "headphones", component: (color, size, weight, className) => <Headphones color={color} size={size} weight={weight} className={className}/> },
    { name: "list", component: (color, size, weight, className) => <List color={color} size={size} weight={weight} className={className}/> },
    { name: "listbullets", component: (color, size, weight, className) => <ListBullets color={color} size={size} weight={weight} className={className}/> },
    { name: "users", component: (color, size, weight, className) => <Users color={color} size={size} weight={weight} className={className}/> },
    { name: "skipforward", component: (color, size, weight, className) => <SkipForward color={color} size={size} weight={weight} className={className}/> },
    { name: "skipback", component: (color, size, weight, className) => <SkipBack color={color} size={size} weight={weight} className={className}/> },
    { name: "calendar", component: (color, size, weight, className) => <Calendar color={color} size={size} weight={weight} className={className}/> },
    { name: "calendarplus", component: (color, size, weight, className) => <CalendarPlus color={color} size={size} weight={weight} className={className}/> },
    { name: "plus", component: (color, size, weight, className) => <Plus color={color} size={size} weight={weight} className={className}/> },
    { name: "share", component: (color, size, weight, className) => <Share color={color} size={size} weight={weight} className={className}/> },
    { name: "disc", component: (color, size, weight, className) => <Disc color={color} size={size} weight={weight} className={className}/> },
]

export function PickedIcon({ iconName, color, size, weight, className }: { iconName: string, color?: string, size?: string, weight?: IconWeight, className?: string }) {
    const pickableIcon = pickableIcons.find(pi => pi.name.toLowerCase() == iconName.toLowerCase())
    if(pickableIcon) {
        return pickableIcon.component(color, size, weight, className)
    }
}