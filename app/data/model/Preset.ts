import { Operations } from "./Operations";
import { ViewOptions } from "./ViewOptions";

export interface Preset {
    id: string,
    name: string,
    description: string,
    icon: string,
    operations: Operations,
}