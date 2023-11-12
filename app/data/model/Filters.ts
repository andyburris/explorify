import { GroupType } from "./Group";
import { ViewOptions } from "./ViewOptions";

export interface Filters {
    group: GroupFilter,
    sort: SortFilter,
    viewOptions: ViewOptions,
}

export enum CombineType { None, SameSong, SameArtist }
export enum CombineInto { EarliestPlay, LatestPlay }
export interface GroupFilter {
    groupBy: GroupType,
    combineBy: CombineType,
    combineAcrossGroups: boolean,
    combineInto: CombineInto,
}

export enum GroupSortType { Date, Plays }
export enum ItemSortType { Date, Plays, Name, ArtistName }
export interface SortFilter {
    sortGroupsBy: GroupSortType,
    sortGroupsAscending: boolean,
    sortItemsBy: ItemSortType,
    sortItemsAscending: boolean,
}