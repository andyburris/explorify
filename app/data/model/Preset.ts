import { Filters } from "./Filters";
import { ViewOptions } from "./ViewOptions";

export interface Preset {
    id: string,
    name: string,
    description: string,
    icon: string,
    filters: Filters,
}