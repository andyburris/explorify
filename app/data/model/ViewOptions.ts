export enum ViewInfoType {
    Date,
    Plays,
}

export interface ViewOptions {
    showGroupSum: boolean,
    showItems: boolean,
    showItemRanks: boolean,
    previewGroups: boolean, 
    primaryInfo: ViewInfoType,
    secondaryInfo: ViewInfoType | null,
}