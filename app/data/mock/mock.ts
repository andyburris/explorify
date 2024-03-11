import { RecommendationsResponse, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { HistoryEntry } from "../model/HistoryEntry";

export const SHOW_MOCK = false

const id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
const secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!
export async function generateMockData(historyEntries: HistoryEntry[]): Promise<HistoryEntry[]> {
    const api = SpotifyApi.withClientCredentials(id, secret);

    const uriMapping: Map<string, string[]> = historyEntries.reduce((acc, he) => {
        if(!acc.has(he.uri)) {
            acc.set(he.uri, [he.id])
        } else {
            acc.get(he.uri).push(he.id)
        }
        return acc
    }, new Map())
    console.log(`${uriMapping.size} unique songs`)
    const uris = Array.from(uriMapping.keys())


    const batches: string[][] = []
    while(uris.length) {
        batches.push(uris.splice(0, 50).map(uri => uri.replace("spotify:track:", "")))
    }

    // const tracks = await api.tracks.get(["69M9QCMsCQ5MLsw7BBW0rL","7hav1MHURQf5SAoPk0egqh"])
    // console.log(`name = ${tracks.map(t => t.name).join(", ")}`)
    // if(true) return

    const start = Date.now()
    console.log("starting read")

    // const test = batches.slice(0, 1)
    // console.log(`test (${test[0].length}) = ${test}`)
    const allTrackPromises: Promise<Track[]>[] = batches.map(b => api.tracks.get(b))
    // const allTrackPromises: Promise<Track[]>[] = test.map(b => api.tracks.get(b))
    const allTracks = await Promise.all(allTrackPromises)
        .then(response => response.flat())
        .catch(e => { console.error(e); return []})
    console.log(`finished read of ${allTracks.length} tracks, tooke ${(Date.now() - start) / 1000} seconds`)
    console.log(`average popularity = ${allTracks.reduce((acc, t) => acc + t.popularity, 0) / allTracks.length}`)

    const sortedTracks = allTracks.sort((a, b) => b.popularity - a.popularity).slice(0, 2000)
    const trackBatches: Track[][] = []
    while(sortedTracks.length) {
        trackBatches.push(sortedTracks.splice(0, 80))
    }

    console.log(`requesting recommendations for ${trackBatches.length} batches`)

    const recommendationPromises: Promise<Map<Track, Track | undefined>>[] = trackBatches.map(async (tb, i) => {
        const minPop = tb.reduce((acc, t) => (acc < t.popularity) ? acc : t.popularity, 100)
        const maxPop = tb.reduce((acc, t) => (acc > t.popularity) ? acc : t.popularity, 0)

        await new Promise(r => setTimeout(r, Math.random() * 1000))
        return api.recommendations.get({
            limit: 90,
            seed_genres: ["indie", "pop"],
            min_popularity: minPop,
            max_popularity: maxPop,
        }).then(recs => {
            const mapping = new Map<Track, Track | undefined>()
            recs.tracks.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date))
            // console.log(`batch ${i}: release dates span from ${recs.tracks[0].album.release_date} to ${recs.tracks[recs.tracks.length - 1].album.release_date}`)
            tb.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date))
            tb.forEach(track => {
                // const firstMatch = recs.tracks.findIndex(t => t.album.release_date < track.album.release_date)
                // if(firstMatch >= 0) { mapping.set(track, recs.tracks.splice(firstMatch)[0]) }
                // else { mapping.set(track, undefined) }
                mapping.set(track, recs.tracks.shift())
            })
            return mapping
        })
        .catch(e => { console.error(e); return new Map()})
    })

    const mappings: Map<string, { original: Track, replace: Track | undefined }> = await Promise.all(recommendationPromises)
    .then(response => {
        const totalMap = new Map<string, { original: Track, replace: Track | undefined }>()
        response.forEach(map => map.forEach((r, o) => totalMap.set(o.id, { original: o, replace: r })))
        return totalMap
    })
    .catch(e => { console.error(e); return new Map()})

    console.log(`mapped ${Array.from(mappings.values()).filter(e => e.replace != undefined).length} tracks to replacements`)

    const final: HistoryEntry[] = []
    historyEntries.forEach(he => {
        const key = he.uri.replace("spotify:track:", "")
        const entry = mappings.get(key)
        if(entry === undefined) return
        const { original, replace } = entry
        const playPercent = he.millisecondsPlayed / original.duration_ms
        if(replace === undefined) return
        const mocked: HistoryEntry = { 
            ...he, 
            trackName: replace.name, 
            artistName: replace.artists[0].name,
            albumName: replace.album.name,
            uri: replace.uri,
            millisecondsPlayed: Math.floor(playPercent * replace.duration_ms),
            platform: "Windows 95",
        }
        final.push(mocked)
    })

    return final
}