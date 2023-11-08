"use client"

import { useEffect, useState } from 'react'
import { UploadPage } from './upload/Upload'
import { HistoryEntry } from './data/model/HistoryEntry';
import { HomePage } from './home/HomePage';
import { LISTENS_STORE_NAME, clearListens, getDatabase, getListens } from './data/Database';

export default function Home() {
  const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
  useEffect(() => { getListens().then(entries => setLoadedEntries(entries))}, [])

  if (loadedEntries === undefined) {
    return (<p>Loading...</p>)
  } else if(loadedEntries.length <= 0) {
    return (
      <UploadPage onUpload={(entries, rememberHistory) => {
        console.log(`uploaded ${entries.length} entries`)
        setLoadedEntries(entries)
      }}/>
    )
  } else {
    return (
      <HomePage listens={loadedEntries} onClear={() => { clearListens() }}/>
    )
  }

}
