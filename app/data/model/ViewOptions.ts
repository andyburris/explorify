export enum ViewInfoType {
    Date,
    Plays,
    Playtime,
    PercentTotalPlays,
    PercentTotalPlaytime,
    PercentGroupPlays,
    PercentGroupPlaytime,
}

export type ViewInfoTypePercent = ViewInfoType.PercentTotalPlays | ViewInfoType.PercentTotalPlaytime | ViewInfoType.PercentGroupPlays | ViewInfoType.PercentGroupPlaytime

export interface ViewOptions {
    showSearch: boolean,
    showGroupSum: boolean,
    showItems: boolean,
    showItemRanks: boolean,
    previewGroups: boolean, 
    primaryInfo: ViewInfoType,
    secondaryInfo: ViewInfoType | null,
}