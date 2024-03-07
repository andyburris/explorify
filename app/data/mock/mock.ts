import { RecommendationsResponse, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { HistoryEntry } from "../model/HistoryEntry";

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

    const trackBatches: Track[][] = []
    while(allTracks.length) {
        trackBatches.push(allTracks.splice(0, 80))
    }

    const recommendationPromises: Promise<Map<Track, Track | undefined>>[] = trackBatches.map(tb => {
        const minPop = tb.reduce((acc, t) => (acc < t.popularity) ? acc : t.popularity, 100)
        const maxPop = tb.reduce((acc, t) => (acc > t.popularity) ? acc : t.popularity, 0)

        return api.recommendations.get({
            limit: 90,
            seed_genres: ["indie", "pop"],
            min_popularity: minPop,
            max_popularity: maxPop,
        }).then(recs => {
            const mapping = new Map<Track, Track | undefined>()
            tb.forEach(track => {
                const firstMatch = recs.tracks.findIndex(t => t.album.release_date < track.album.release_date)
                if(firstMatch >= 0) { mapping.set(track, recs.tracks.splice(firstMatch)[0]) }
                else { mapping.set(track, undefined) }
            })
            return mapping
        })
    })

    const mappings: Map<string, { original: Track, replace: Track | undefined }> = await Promise.all(recommendationPromises)
    .then(response => {
        const totalMap = new Map<string, { original: Track, replace: Track | undefined }>()
        response.forEach(map => map.forEach((r, o) => totalMap.set(o.id, { original: o, replace: r })))
        return totalMap
    })
    .catch(e => { console.error(e); return new Map()})

    const final: HistoryEntry[] = []
    historyEntries.forEach(he => {
        const { original, replace } = mappings.get(he.uri.replace("spotify:track:", ""))!
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