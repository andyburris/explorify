import { HistoryEntry } from "./HistoryEntry";

export enum ViewState { Visible, Hidden, Invalid }
export interface Listen extends HistoryEntry {
    hiddenSkip: boolean,
    hiddenSearched: boolean,
    // viewState: ViewState,
}