import React from "react";
import type { DishStat } from "../../../types/analyticsTypes";
type Props = {
    data: DishStat[];
    xKey?: string;
    yKey?: string;
    color?: string;
    emptyMessage?: string;
};
export declare const TopDishes: React.FC<Props>;
export {};
