export enum ViewInfoType {
    Date,
    Plays,
    Playtime,
}

export interface ViewOptions {
    showSearch: boolean,
    showGroupSum: boolean,
    showItems: boolean,
    showItemRanks: boolean,
    previewGroups: boolean, 
    primaryInfo: ViewInfoType,
    secondaryInfo: ViewInfoType | null,
}