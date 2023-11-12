import { Calendar, CalendarPlus, Headphones, IconWeight, List, ListBullets, MusicNote, SkipBack, SkipForward, Users } from "phosphor-react-sc";

export function PickedIcon({ iconName, color, size, weight }: { iconName: string, color?: string, size?: string, weight?: IconWeight, }) {
    switch(iconName.toLowerCase()) {
        case "musicnote": return <MusicNote color={color} size={size} weight={weight}/>
        case "headphones": return <Headphones color={color} size={size} weight={weight}/>
        case "list": return <List color={color} size={size} weight={weight}/>
        case "listbullets": return <ListBullets color={color} size={size} weight={weight}/>
        case "users": return <Users color={color} size={size} weight={weight}/>
        case "skipforward": return <SkipForward color={color} size={size} weight={weight}/>
        case "skipback": return <SkipBack color={color} size={size} weight={weight}/>
        case "calendar": return <Calendar color={color} size={size} weight={weight}/>
        case "calendarplus": return <CalendarPlus color={color} size={size} weight={weight}/>
    }
}