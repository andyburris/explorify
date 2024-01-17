import { Calendar, CalendarPlus, Disc, Headphones, IconWeight, List, ListBullets, MusicNote, Plus, Share, SkipBack, SkipForward, Users } from "phosphor-react-sc";

export interface PickableIcon { name: string, component: (color?: string, size?: string, weight?: IconWeight) => React.ReactNode }
export const pickableIcons: PickableIcon[] = [
    { name: "musicnote", component: (color, size, weight) => <MusicNote color={color} size={size} weight={weight}/> },
    { name: "headphones", component: (color, size, weight) => <Headphones color={color} size={size} weight={weight}/> },
    { name: "list", component: (color, size, weight) => <List color={color} size={size} weight={weight}/> },
    { name: "listbullets", component: (color, size, weight) => <ListBullets color={color} size={size} weight={weight}/> },
    { name: "users", component: (color, size, weight) => <Users color={color} size={size} weight={weight}/> },
    { name: "skipforward", component: (color, size, weight) => <SkipForward color={color} size={size} weight={weight}/> },
    { name: "skipback", component: (color, size, weight) => <SkipBack color={color} size={size} weight={weight}/> },
    { name: "calendar", component: (color, size, weight) => <Calendar color={color} size={size} weight={weight}/> },
    { name: "calendarplus", component: (color, size, weight) => <CalendarPlus color={color} size={size} weight={weight}/> },
    { name: "plus", component: (color, size, weight) => <Plus color={color} size={size} weight={weight}/> },
    { name: "share", component: (color, size, weight) => <Share color={color} size={size} weight={weight}/> },
    { name: "disc", component: (color, size, weight) => <Disc color={color} size={size} weight={weight}/> },
]

export function PickedIcon({ iconName, color, size, weight }: { iconName: string, color?: string, size?: string, weight?: IconWeight, }) {
    const pickableIcon = pickableIcons.find(pi => pi.name.toLowerCase() == iconName.toLowerCase())
    if(pickableIcon) {
        return pickableIcon.component(color, size, weight)
    }
}