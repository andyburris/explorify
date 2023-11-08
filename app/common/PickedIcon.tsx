import { Calendar, CalendarPlus, Headphones, List, ListBullets, MusicNote, SkipBack, SkipForward, Users } from "phosphor-react-sc";

export function PickedIcon({ iconName, color, size }: { iconName: string, color?: string, size?: string }) {
    switch(iconName.toLowerCase()) {
        case "musicnote": return <MusicNote color={color} size={size}/>
        case "headphones": return <Headphones color={color} size={size}/>
        case "list": return <List color={color} size={size}/>
        case "listbullets": return <ListBullets color={color} size={size}/>
        case "users": return <Users color={color} size={size}/>
        case "skipforward": return <SkipForward color={color} size={size}/>
        case "skipback": return <SkipBack color={color} size={size}/>
        case "calendar": return <Calendar color={color} size={size}/>
        case "calendarplus": return <CalendarPlus color={color} size={size}/>
    }
}