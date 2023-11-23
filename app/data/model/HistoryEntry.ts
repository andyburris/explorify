import { randomUUID } from "crypto"

export interface RawHistoryEntry {
    ts: string
    username: string
    platform: string
    ms_played: number
    conn_country: string
    ip_addr_decrypted?: string
    user_agent_decrypted?: string
    master_metadata_track_name?: string
    master_metadata_album_artist_name?: string
    master_metadata_album_album_name?: string
    spotify_track_uri?: string
    episode_name?: string
    episode_show_name?: string
    spotify_episode_uri?: string
    reason_start?: string
    reason_end?: string
    shuffle?: boolean
    skipped?: boolean
    offline?: boolean
    offline_timestamp?: number
    incognito_mode: boolean
}

export interface HistoryEntry {
    id: string,
    timestamp: Date,
    platform: string,
    millisecondsPlayed: number,
    trackName: string,
    artistName: string,
    albumName: string,
    uri: string,
    startReason: StartReason,
    endReason: EndReason,
    shuffle?: boolean,
    skipped?: boolean,
    offline?: boolean,
}

export function rawToHistoryEntry(raw: RawHistoryEntry): HistoryEntry | undefined {
    const mustExist = [raw.master_metadata_track_name, raw.master_metadata_album_artist_name, raw.master_metadata_album_album_name, raw.spotify_track_uri]
    if (mustExist.some(s => s == undefined)) return undefined
    return {
        id: crypto.randomUUID(),
        timestamp: new Date(raw.ts),
        platform: raw.platform,
        millisecondsPlayed: raw.ms_played,
        trackName: raw.master_metadata_track_name!,
        artistName: raw.master_metadata_album_artist_name!,
        albumName: raw.master_metadata_album_album_name!,
        uri: raw.spotify_track_uri!,
        startReason: parseStartReason(raw.reason_start),
        endReason: parseEndReason(raw.reason_end),
        shuffle: raw.shuffle,
        skipped: raw.skipped,
        offline: raw.offline,
    }
}

export enum StartReason {
    AppLoad,
    BackButton,
    ClickRow,
    ForwardButton,
    Persisted,
    PlayButton,
    Remote,
    TrackDone,
    TrackError,
    Unknown,
}

function parseStartReason(raw: string | undefined): StartReason {
    switch(raw?.toLowerCase()) {
        case "appload": return StartReason.AppLoad
        case "backbutton": return StartReason.BackButton
        case "clickrow": return StartReason.ClickRow
        case "forwardbutton": return StartReason.ForwardButton
        case "persisted": return StartReason.Persisted
        case "playbutton": return StartReason.PlayButton
        case "remote": return StartReason.Remote
        case "trackdone": return StartReason.TrackDone
        case "trackerror": return StartReason.TrackError
        case "unknown": return StartReason.Unknown
        default: return StartReason.Unknown
    }
}

export enum EndReason {
    BackButton,
    EndPlay,
    ForwardButton,
    Logout,
    PlayButton,
    Remote,
    TrackDone,
    TrackError,
    UnexpectedExit,
    UnexpectedExitWhilePaused,
    Unknown,
}

function parseEndReason(raw: string | undefined): EndReason {
    switch(raw?.toLowerCase()) {
        case "backbutton": return EndReason.BackButton
        case "endplay": return EndReason.EndPlay
        case "forwardbutton": return EndReason.ForwardButton
        case "logout": return EndReason.Logout
        case "playbutton": return EndReason.PlayButton
        case "remote": return EndReason.Remote
        case "trackdone": return EndReason.TrackDone
        case "trackerror": return EndReason.TrackError
        case "unexpectedexit": return EndReason.UnexpectedExit
        case "unexpectedexitwhilepaused": return EndReason.UnexpectedExitWhilePaused
        case "unknown": return EndReason.Unknown
        default: return EndReason.Unknown
    }
}