import { CombineInto, CombineType, InfoType, ItemSortType, PercentDenominator, PercentGrouping, PercentInfo, PercentNumerator, PercentOf, SearchType, SkipFilterType } from "./model/Operations";
import { Preset } from "./model/Preset";

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
    plays: { index: 8, isAscending: true },
    playtime: { index: 9, isAscending: true },
    percent: { index: 10, isAscending: true }
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
    plays: { index: 8, isAscending: true },
    playtime: { index: 9, isAscending: true },
    percent: { index: 10, isAscending: true }
}
export const simpleSortGroupsPlays = {
    hour: { index: 9, isAscending: true },
    dayOfWeek: { index: 8, isAscending: true },
    date: { index: 7, isAscending: true },
    month: { index: 6, isAscending: true },
    year: { index: 5, isAscending: true },
    artist: { index: 3, isAscending: true },
    song: { index: 2, isAscending: true },
    album: { index: 4, isAscending: true },
    plays: { index: 0, isAscending: false },
    playtime: { index: 1, isAscending: false },
    percent: { index: 10, isAscending: false }
}
const defaultPercentInfo: PercentInfo = {
    of: PercentOf.Plays,
    numerator: PercentNumerator.All,
    denominator: PercentDenominator.All,
    grouping: PercentGrouping.Total
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
                minimumPlays: 0,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            info: {
                primaryInfo: InfoType.Plays,
                secondaryInfo: null,
                primaryPercent: defaultPercentInfo,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showGroupRanks: false,
                showItemRanks: true,
                previewGroups: false,
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
                groupBy: { ...groupNone, artist: true },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
                minimumPlays: 0,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            info: {
                primaryInfo: InfoType.Plays,
                secondaryInfo: null,
                primaryPercent: defaultPercentInfo,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showGroupRanks: true,
                showItemRanks: true,
                previewGroups: true,
            },
        },
    },    {
        id: "top-albums",
        name: "Top Albums",
        icon: "disc",
        description: "The albums you’ve listened to the most",
        operations: {
            group: {
                groupBy: { ...groupNone, album: true, artist: true },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
                minimumPlays: 0,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            info: {
                primaryInfo: InfoType.Plays,
                secondaryInfo: null,
                primaryPercent: defaultPercentInfo,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showGroupRanks: true,
                showItemRanks: true,
                previewGroups: true,
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
                groupBy: { ...groupNone, artist: true, song: true },
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.OnlySkips,
                minimumPlays: 10,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: {
                    hour: { index: 10, isAscending: true },
                    dayOfWeek: { index: 9, isAscending: true },
                    date: { index: 8, isAscending: true },
                    month: { index: 7, isAscending: true },
                    year: { index: 6, isAscending: true },
                    artist: { index: 4, isAscending: true },
                    song: { index: 3, isAscending: true },
                    album: { index: 5, isAscending: true },
                    plays: { index: 1, isAscending: false },
                    playtime: { index: 2, isAscending: false },
                    percent: { index: 0, isAscending: false }
                },
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            info: {
                primaryInfo: InfoType.Percent,
                secondaryInfo: InfoType.Fraction,
                primaryPercent: {
                    of: PercentOf.Plays,
                    numerator: PercentNumerator.Skipped,
                    denominator: PercentDenominator.All,
                    grouping: PercentGrouping.Groups,
                },
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: false,
                showGroupRanks: true,
                showItemRanks: true,
                previewGroups: true,
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
                minimumPlays: 0,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsDate,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
            info: {
                primaryInfo: InfoType.Date,
                secondaryInfo: null,
                primaryPercent: defaultPercentInfo,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showGroupRanks: false,
                showItemRanks: false,
                previewGroups: false,
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
                minimumPlays: 0,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsDate,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
            info: {
                primaryInfo: InfoType.Date,
                secondaryInfo: InfoType.Plays,
                primaryPercent: defaultPercentInfo,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showGroupRanks: false,
                showItemRanks: false,
                previewGroups: false,
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
                minimumPlays: 0,
                searchTerm: "",
                searchBy: SearchType.All,
            },
            sort: {
                sortGroupsBy: simpleSortGroupsPlays,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            info: {
                primaryInfo: InfoType.Plays,
                secondaryInfo: InfoType.Date,
                primaryPercent: defaultPercentInfo,
            },
            viewOptions: {
                showSearch: false,
                showGroupSum: true,
                showItems: true,
                showGroupRanks: true,
                showItemRanks: true,
                previewGroups: true,
            },
        },
    },
]