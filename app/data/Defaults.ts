import { CombineInto, CombineType, GroupSortType, ItemSortType } from "./model/Filters";
import { GroupType } from "./model/Group";
import { Preset } from "./model/Preset";

export const defaultPresets: Preset[] = [
    {
        id: "top-songs",
        name: "Top Songs",
        icon: "musicnote",
        description: "The songs you’ve listened to the most",
        filters: {
            group: {
                groupBy: GroupType.None,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
        },
    },
    {
        id: "top-artists",
        name: "Top Artists",
        icon: "users",
        description: "The artists you’ve listened to the most",
        filters: {
            group: {
                groupBy: GroupType.None,
                combineBy: CombineType.SameArtist,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
        },
    },
    {
        id: "most-skipped",
        name: "Most Skipped",
        icon: "skipforward",
        description: "The songs you’ve skipped the most",
        filters: {
            group: {
                groupBy: GroupType.None,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
        },
    },
    {
        id: "listening-history",
        name: "Listening History",
        icon: "headphones",
        description: "Every song you’ve ever played",
        filters: {
            group: {
                groupBy: GroupType.Day,
                combineBy: CombineType.None,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: false,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
        },
    },
    {
        id: "discovery-history",
        name: "Discovery History",
        icon: "headphones",
        description: "When you first listened to every song",
        filters: {
            group: {
                groupBy: GroupType.Day,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: true,
            },
            sort: {
                sortGroupsBy: GroupSortType.Date,
                sortGroupsAscending: true,
                sortItemsBy: ItemSortType.Date,
                sortItemsAscending: true,
            },
        },
    },
    {
        id: "best-discovery-days",
        name: "Best Discovery Days",
        icon: "calendarplus",
        description: "What days did you discover the music you listen to the most?",
        filters: {
            group: {
                groupBy: GroupType.Day,
                combineBy: CombineType.SameSong,
                combineInto: CombineInto.EarliestPlay,
                combineAcrossGroups: true,
            },
            sort: {
                sortGroupsBy: GroupSortType.Plays,
                sortGroupsAscending: false,
                sortItemsBy: ItemSortType.Plays,
                sortItemsAscending: false,
            },
        },
    },
]