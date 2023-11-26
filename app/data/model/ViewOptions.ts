export enum ViewInfoType {
    Date,
    Plays,
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