"use client"

import { useEffect, useState } from 'react';
import { HistoryEntry } from '../data/model/HistoryEntry';
import { getListens } from '../data/persist/Database';
import { usePresets } from '../data/utils/presetUtils';
import { HomePage } from '../home/HomePage';
import { LoadingPage } from '../home/LoadingPage';

export function HomePageLayout() {
    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    useEffect(() => { getListens().then(entries => setLoadedEntries(entries))}, [])
    const savedPresets = usePresets()
  
    return (loadedEntries === undefined || savedPresets === undefined)
        ? <LoadingPage/>
        : <HomePage listens={loadedEntries} presets={savedPresets} />
}