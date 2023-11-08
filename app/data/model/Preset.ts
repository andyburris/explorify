import { Filters } from "./Filters";

export interface Preset {
    id: string,
    name: string,
    description: string,
    // icon: string,
    filters: Filters,
}