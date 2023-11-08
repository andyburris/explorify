import { Preset } from "./model/Preset";

export const defaultPresets: Preset[] = [
    {
        id: "top-songs",
        name: "Top Songs",
        description: "The songs you’ve listened to the most",
        filters: {},
    },
    {
        id: "top-artists",
        name: "Top Artists",
        description: "The artists you’ve listened to the most",
        filters: {},
    },
    {
        id: "most-skipped",
        name: "Most Skipped",
        description: "The songs you’ve skipped the most",
        filters: {},
    },
    {
        id: "listening-history",
        name: "Listening History",
        description: "Every song you’ve ever played",
        filters: {},
    },
    {
        id: "discovery-history",
        name: "Discovery History",
        description: "When you first listened to every song",
        filters: {},
    },
]