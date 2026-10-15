export interface Dish {
    dish_id: number;
    name: string;
    category: 'Other' | 'Soups' | 'Salads' | 'Sandwiches' | 'Entrees' | 'Desserts' | 'Bowls' | 'Sides' | 'Appetizers';
    price: number;
}
export interface MenuDayDish {
    menu_day_dish_id: number;
    stock: number;
    Dishes: Dish;
}
export interface MenuDay {
    menu_day_id: number;
    date: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    MenuDayDishes: MenuDayDish[];
}
export declare const Menu: () => import("react/jsx-runtime").JSX.Element;
