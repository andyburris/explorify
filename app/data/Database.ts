import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { HistoryEntry } from './model/HistoryEntry';

export const DATABASE_NAME = "spotify-data-explorer"
export const LISTENS_STORE_NAME = "listens"

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
        .then(db => {
            listens.slice(0, 50000).forEach(e => db.put(LISTENS_STORE_NAME, e))
            db.transaction(LISTENS_STORE_NAME).commit()
        })
        .then(_ => {
            console.log(`saving entries took ${(Date.now() - start)}ms`)
        })
}

export function clearListens() {
    const start = Date.now()
    return getDatabase()
        .then(db => {
            db.clear(LISTENS_STORE_NAME)
            return db
        })
        .then(_ => {
            console.log(`clear entries took ${(Date.now() - start)}ms`)
        })
}