"use client"

import { useEffect, useState } from 'react'
import { UploadPage } from './upload/Upload'
import { HistoryEntry } from './data/model/HistoryEntry';
import { HomePage } from './home/HomePage';
import { getListens } from './data/persist/Database';
import { LoadingPage } from './home/LoadingPage';
import { getPresets, saveDefaultPresets } from './data/persist/PresetRepository';

export default function Home() {
  const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
  useEffect(() => { getListens().then(entries => setLoadedEntries(entries))}, [])
  const [savedPresets, _] = useState(getPresets())

  if (loadedEntries === undefined) {
    return (<LoadingPage/>)
  } else if(loadedEntries.length <= 0) {
    return (
      <UploadPage onUpload={(entries, rememberHistory) => {
        console.log(`uploaded ${entries.length} entries`)
        if(getPresets().length <= 0) saveDefaultPresets()
        setLoadedEntries(entries)
      }}/>
    )
  } else {
    return (
      <HomePage listens={loadedEntries} presets={savedPresets} onClear={() => { 
        // clearListens()
        setLoadedEntries([])
      }}/>
    )
  }

}
