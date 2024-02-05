"use client"

import { useEffect, useState } from 'react'
import { UploadPage } from './import/Upload'
import { HistoryEntry } from './data/model/HistoryEntry';
import { HomePage } from './home/HomePage';
import { getListens } from './data/persist/Database';
import { LoadingPage } from './home/LoadingPage';
import { getPresets, saveDefaultPresets } from './data/persist/PresetRepository';
import { Preset } from './data/model/Preset';
import { usePresetState, usePresets } from './data/utils/presetUtils';

export default function Home() {
  const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
  useEffect(() => { getListens().then(entries => setLoadedEntries(entries))}, [])
  const [savedPresets, setSavedPresets] = usePresetState()

  if (loadedEntries === undefined || savedPresets === undefined) {
    return (<LoadingPage/>)
  } else if(loadedEntries.length <= 0) {
    return (
      <UploadPage hasExisting={false} onUpload={(entries, rememberHistory) => {
        console.log(`uploaded ${entries.length} entries`)
        setSavedPresets(getPresets())
        setLoadedEntries(entries)
      }}/>
    )
  } else {
    return (
      <HomePage listens={loadedEntries} presets={savedPresets} onClear={() => { 
        // clearListens()
      }}/>
    )
  }

}
