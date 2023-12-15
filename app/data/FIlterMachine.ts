import { applyOperations } from "./transform/Operating";
import { Operations } from "./model/Operations";
import { Group } from "./model/Group";
import { HistoryEntry } from "./model/HistoryEntry";

class FilterMachine {
    public currentGroups: Group[]
    public currentOperations: Operations

    constructor(listens: HistoryEntry[], initialFilters: Operations) {
        this.currentGroups = applyOperations(listens, initialFilters)
        this.currentOperations = initialFilters
    }

    applyAction(action: FilterAction) {

    }
}

class FilterAction {

}