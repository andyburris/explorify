import { CombineInto, CombineType, GroupSortType, ItemSortType, SkipFilterType } from "./model/Operations";
import { GroupType } from "./model/Group";
import { Preset } from "./model/Preset";
import { ViewInfoType } from "./model/ViewOptions";

export const defaultPresets: Preset[] = [
    {
        id: "top-songs",
        name: "Top Songs",
        icon: "musicnote",
        description: "The songs you’ve listened to the most",
        operations: {
            group: {
                groupBy: GroupType.None,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
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
                groupBy: GroupType.None,
                combineBy: CombineType.SameArtist,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
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
                groupBy: GroupType.None,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.OnlySkips,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
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
                groupBy: GroupType.Day,
                combineBy: CombineType.None,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            filter: {
                filterSkipsBy: SkipFilterType.All,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
            viewOptions: {
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
                groupBy: GroupType.Day,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: true,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
            viewOptions: {
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
                groupBy: GroupType.Day,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: true,
            },
            filter: {
                filterSkipsBy: SkipFilterType.NoSkips,
            },
            sort: {
                sortGroupsBy: GroupSortType.Plays,
                sortGroupsAscending: false,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
            viewOptions: {
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