import { CombineInto, CombineType, ItemSortType, SearchType, SkipFilterType } from "./model/Operations";
import { Preset } from "./model/Preset";
import { ViewInfoType } from "./model/ViewOptions";

const groupNone = { hour: false, dayOfWeek: false, date: false, month: false,year: false, artist: false, song: false, album: false, }
const sortGroupsDate = {
    hour: { index: 4, isAscending: true },
    dayOfWeek: { index: 3, isAscending: true },
    date: { index: 2, isAscending: true },
    month: { index: 1, isAscending: true },
    year: { index: 0, isAscending: true },
    artist: { index: 6, isAscending: true },
    song: { index: 5, isAscending: true },
    album: { index: 7, isAscending: true },
}
const sortGroupsSong = {
    hour: { index: 7, isAscending: true },
    dayOfWeek: { index: 6, isAscending: true },
    date: { index: 5, isAscending: true },
    month: { index: 4, isAscending: true },
    year: { index: 3, isAscending: true },
    artist: { index: 1, isAscending: true },
    song: { index: 0, isAscending: true },
    album: { index: 2, isAscending: true },
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
                sortGroupsBy: sortGroupsDate,
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
                sortGroupsBy: sortGroupsDate,
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
                sortGroupsBy: sortGroupsDate,
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
                groupBy: { ...groupNone, date: true },
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
                sortGroupsBy: sortGroupsDate,
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
                groupBy: { ...groupNone, date: true },
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
                sortGroupsBy: sortGroupsDate,
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
                groupBy: { ...groupNone, date: true },
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
                sortGroupsBy: sortGroupsSong,
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