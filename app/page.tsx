"use client"

import { useEffect, useState } from 'react'
import { ImportPage } from './import/ImportPage'
import { HistoryEntry } from './data/model/HistoryEntry';
import { HomePage } from './home/HomePage';
import { getListens, hasListens } from './data/persist/Database';
import { LoadingPage } from './home/LoadingPage';
import { getPresets, saveDefaultPresets } from './data/persist/PresetRepository';
import { Preset } from './data/model/Preset';
import { usePresetState, usePresets } from './data/utils/presetUtils';
import { LandingPage } from './landing/Landing';

export default function Home() {
  const hasEntries = hasListens()
  const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
  useEffect(() => { getListens().then(entries => setLoadedEntries(entries))}, [])
  const savedPresets = usePresets()

  if(!hasEntries) {
    return <LandingPage/>
  } else if (loadedEntries === undefined || savedPresets === undefined) {
    return (<LoadingPage/>)
  } else {
    return (
      <HomePage listens={loadedEntries} presets={savedPresets} />
    )
  }

}
