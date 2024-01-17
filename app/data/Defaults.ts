import { CombineInto, CombineType, ItemSortType, SearchType, SkipFilterType } from "./model/Operations";
import { Preset } from "./model/Preset";
import { ViewInfoType } from "./model/ViewOptions";

export const groupNone = { hour: false, dayOfWeek: false, date: false, month: false,year: false, artist: false, song: false, album: false, }

export const simpleSortGroupsDate = {
    hour: { index: 4, isAscending: true },
    dayOfWeek: { index: 3, isAscending: true },
    date: { index: 2, isAscending: true },
    month: { index: 1, isAscending: true },
    year: { index: 0, isAscending: true },
    artist: { index: 6, isAscending: true },
    song: { index: 5, isAscending: true },
    album: { index: 7, isAscending: true },
    totalPlays: { index: 8, isAscending: true },
    totalPlaytime: { index: 9, isAscending: true },
}
export const simpleSortGroupsSong = {
    hour: { index: 7, isAscending: true },
    dayOfWeek: { index: 6, isAscending: true },
    date: { index: 5, isAscending: true },
    month: { index: 4, isAscending: true },
    year: { index: 3, isAscending: true },
    artist: { index: 1, isAscending: true },
    song: { index: 0, isAscending: true },
    album: { index: 2, isAscending: true },
    totalPlays: { index: 8, isAscending: true },
    totalPlaytime: { index: 9, isAscending: true },
}
export const simpleSortGroupsPlays = {
    hour: { index: 8, isAscending: true },
    dayOfWeek: { index: 7, isAscending: true },
    date: { index: 6, isAscending: true },
    month: { index: 5, isAscending: true },
    year: { index: 4, isAscending: true },
    artist: { index: 2, isAscending: true },
    song: { index: 1, isAscending: true },
    album: { index: 3, isAscending: true },
    totalPlays: { index: 0, isAscending: false },
    totalPlaytime: { index: 9, isAscending: false },
}

export const defaultPresets: Preset[] = [
    {
        id: "top-songs",
        name: "Top Songs",
        icon: "musicnote",
        description: "The songs you’ve listened to the most",
        operations: {
            group: {
                groupBy: { ...groupNone },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
                searchTerm: "",
                searchBy: SearchType.All,
                rerankSearch: false,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showItemRanks: true,
                previewGroups: false,
                primaryInfo: ViewInfoType.Plays,
                secondaryInfo: null,
            },
        },
    },
    {
        id: "top-artists",
        name: "Top Artists",
        icon: "users",
        description: "The artists you’ve listened to the most",
        operations: {
            group: {
                groupBy: { ...groupNone },
                combineBy: CombineType.SameArtist,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
                searchTerm: "",
                searchBy: SearchType.All,
                rerankSearch: false,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showItemRanks: true,
                previewGroups: false,
                primaryInfo: ViewInfoType.Plays,
                secondaryInfo: null,
            },
        },
    },
    {
        id: "most-skipped",
        name: "Most Skipped",
        icon: "skipforward",
        description: "The songs you’ve skipped the most",
        operations: {
            group: {
                groupBy: { ...groupNone },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.OnlySkips,
                searchTerm: "",
                searchBy: SearchType.All,
                rerankSearch: false,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsDate,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: false,
                showItems: true,
                showItemRanks: true,
                previewGroups: false,
                primaryInfo: ViewInfoType.Plays,
                secondaryInfo: null,
            },
        },
    },
    {
        id: "listening-history",
        name: "Listening History",
        icon: "headphones",
        description: "Every song you’ve ever played",
        operations: {
            group: {
                groupBy: { ...groupNone, year: true, month: true, date: true },
                combineBy: CombineType.None,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.All,
                searchTerm: "",
                searchBy: SearchType.All,
                rerankSearch: false,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsDate,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showItemRanks: false,
                previewGroups: false,
                primaryInfo: ViewInfoType.Date,
                secondaryInfo: null,
            },
        },
    },
    {
        id: "discovery-history",
        name: "Discovery History",
        icon: "headphones",
        description: "When you first listened to every song",
        operations: {
            group: {
                groupBy: { ...groupNone, year: true, month: true, date: true },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: true,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
                searchTerm: "",
                searchBy: SearchType.All,
                rerankSearch: false,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsDate,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showItemRanks: false,
                previewGroups: false,
                primaryInfo: ViewInfoType.Date,
                secondaryInfo: ViewInfoType.Plays,
            },
        },
    },
    {
        id: "best-discovery-days",
        name: "Best Discovery Days",
        icon: "calendarplus",
        description: "What days did you discover the music you listen to the most?",
        operations: {
            group: {
                groupBy: { ...groupNone, year: true, month: true, date: true },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: true,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
                searchTerm: "",
                searchBy: SearchType.All,
                rerankSearch: false,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showItemRanks: true,
                previewGroups: true,
                primaryInfo: ViewInfoType.Plays,
                secondaryInfo: ViewInfoType.Date,
            },
        },
    },
]