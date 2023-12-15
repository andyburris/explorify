import { Base64 } from "../utils/base64";
import { Combination } from "./Combination";
import { GroupType } from "./Operations";

export class GroupKey {
    public constructor(
        public hour: number | null,
        public dayOfWeek: number | null,
        public date: number | null,
        public month: number | null,
        public year: number | null,
        public artist: string | null,
        public song: string | null,
        public album: string | null,
    ) {}

    hashCode(): string { return ""
        + (this.hour != null ? `*h${this.hour}` : "*h")
        + (this.dayOfWeek != null ? `*w${this.dayOfWeek}` : "*w")
        + (this.date != null ? `*d${this.date}` : "*d")
        + (this.month != null ? `*m${this.month}` : "*m")
        + (this.year != null ? `*y${this.year}` : "*y")
        + (this.artist != null ? `*a${Base64.encode(this.artist)}` : "*a")
        + (this.song != null ? `*s${Base64.encode(this.song)}` : "*s")
        + (this.album != null ? `*l${Base64.encode(this.album)}` : "*l")
    }
}

export function groupKeyFromHashCode(hashCode: string) {
    const [hour, dayOfWeek, date, month, year, artist, song, album] = hashCode.split("*").filter(s => s.length > 0).map(s => s.substring(1))
    return new GroupKey(
        hour.length > 0 ? Number(hour) : null, 
        dayOfWeek.length > 0 ? Number(dayOfWeek) : null, 
        date.length > 0 ? Number(date) : null, 
        month.length > 0 ? Number(month) : null, 
        year.length > 0 ? Number(year) : null,
        Base64.decode(artist), Base64.decode(song), Base64.decode(album))
}

export class Group {
    public id: string = crypto.randomUUID()
    public totalPlays: number
    constructor(
        public type: GroupType,
        public key: GroupKey,
        public combinations: Combination[],
    ){
        this.totalPlays = combinations.reduce((acc, c) => acc + c.listens.length, 0)
    }

    headerStrings(short?: boolean): { primary: string, secondary: string | undefined } {
        const song = songStrings(this.key.song, this.key.album, this.key.artist) 
        const date = dateString(this.key, this.combinations[0].listens[0].timestamp)
        var out = (song && date) 
            ? { primary: `${song.primary}, ${date}`, secondary: song.secondary }
            : song
                ? song
            : date
                ? { primary: date, secondary: undefined }
                : { primary: "All time", secondary: undefined }
        // out = { primary: out.primary, secondary: (out.secondary ?? "") + " " + this.key.hashCode() }
        return out
    }
}

function songStrings(song: string | null, album: string | null, artist: string | null): { primary: string, secondary: string | undefined } | undefined {
    if(song && album && artist) return { primary: song, secondary: `- ${artist}, ${album}` }
    if(song && !album && artist) return { primary: song, secondary: `- ${artist}` }
    if(song && album && !artist) return { primary: song, secondary: `from ${album}` }
    if(song && !album && !artist) return { primary: song, secondary: undefined }
    if(!song && album && artist) return { primary: album, secondary: `- ${artist}` }
    if(!song && album && !artist) return { primary: album, secondary: undefined }
    if(!song && !album && artist) return { primary: artist, secondary: undefined }
    return undefined
}

function dateString(key: GroupKey, defaultDate: Date): string | undefined {
    if(key.year != null || key.month != null || key.date != null || key.dayOfWeek != null || key.hour != null) {
        const date = new Date(key.year ?? defaultDate.getFullYear(), key.month ?? defaultDate.getMonth(), key.date ?? defaultDate.getDate(), key.hour ?? defaultDate.getHours(), 1)
        const dateFormatOptions: Intl.DateTimeFormatOptions = {
            year: key.year != null ? "numeric" : undefined,
            month: key.month != null ? "long" : undefined,
            day: key.date != null ? "numeric" : undefined,
            weekday: key.dayOfWeek != null ? "long" : undefined,
            hour: key.hour != null ? "numeric" : undefined,
        }
        return date.toLocaleString('en-us', dateFormatOptions)
    }
    return undefined
}