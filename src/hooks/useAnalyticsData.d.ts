import type { DishStat, BuyerStat, TrendStat, DayStat } from "../types/analyticsTypes";
export declare const useAnalyticsData: () => {
    isLoading: boolean;
    error: Error | null;
    dishStats: DishStat[];
    buyerStats: BuyerStat[];
    buyerStatsByOrders: BuyerStat[];
    timeStats: any[];
    trendStats: TrendStat[];
    dayStats: DayStat[];
    kpis: any;
    dayHourMatrix: number[][];
    dayHourMax: number;
};
