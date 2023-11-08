import { applyFilters } from "./Filtering";
import { Filters } from "./model/Filters";
import { Group } from "./model/Group";
import { HistoryEntry } from "./model/HistoryEntry";

class FilterMachine {
    public currentGroups: Group[]
    public currentFilters: Filters

    constructor(listens: HistoryEntry[], initialFilters: Filters) {
        this.currentGroups = applyFilters(listens, initialFilters)
        this.currentFilters = initialFilters
    }

    applyAction(action: FilterAction) {

    }
}

class FilterAction {

}