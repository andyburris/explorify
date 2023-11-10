export enum ViewInfoType {
    Date,
    Plays,
}

export interface ViewOptions {
    showGroupSum: boolean,
    showItems: boolean,
    showRanks: boolean,
    previewGroups: boolean, 
    primaryInfo: ViewInfoType,
    secondaryInfo: ViewInfoType,
}