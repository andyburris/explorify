import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { HistoryEntry } from '../model/HistoryEntry';

export const DATABASE_NAME = "spotify-data-explorer"
export const LISTENS_STORE_NAME = "listens"
export const HAS_LISTENS_NAME = "hasListens"

export function getDatabase() {
    const start = Date.now()
    return openDB(DATABASE_NAME, 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            if(newVersion == 1) {
                const store = db.createObjectStore(LISTENS_STORE_NAME, { keyPath: "id" })
                // const fields = ["timestamp", "platform", "millisecondsPlayed", "trackName", "artistName", "albumName", "uri", "startReason", "endReason", "shuffle", "skipped", "offline"]
                // fields.forEach(f => store.createIndex(f, f, { unique: false }))
            }
        },
        blocked(currentVersion, blockedVersion, event) {
        // …
        },
        blocking(currentVersion, blockedVersion, event) {
        // …
        },
        terminated() {
        // …
        },
    })
    .then(db => {
        db.onerror = (e) => console.log(e)
        return db
    })
    .then(db => {
        console.log(`loading database took ${(Date.now() - start)}ms`)
        return db
    })
}

export function getListens() {
    const start = Date.now()
    return getDatabase()
        .then(db => db.getAll(LISTENS_STORE_NAME) as Promise<HistoryEntry[]>)
        .then(entries => {
            console.log(`loading entries took ${(Date.now() - start)}ms`)
            return entries
        })
}

export function saveListens(listens: HistoryEntry[]) {
    const start = Date.now()
    return getDatabase()
        .then(db => {
            db.clear(LISTENS_STORE_NAME)
            return db
        })
        .then(async db => {
            const transaction = db.transaction(LISTENS_STORE_NAME, "readwrite")
            const store = transaction.objectStore(LISTENS_STORE_NAME)
            listens.forEach(async l => await store.put(l))
            transaction.commit()
        })
        .then(_ => {
            document.cookie = `${HAS_LISTENS_NAME}=1`
            console.log(`saving entries took ${(Date.now() - start)}ms`)
        })
}

export async function clearListens() {
    const start = Date.now()
    return getDatabase()
        .then(db => {
            db.clear(LISTENS_STORE_NAME)
            return db
        })
        .then(_ => {
            document.cookie = `${HAS_LISTENS_NAME}=0`
            console.log(`clear entries took ${(Date.now() - start)}ms`)
        })
}