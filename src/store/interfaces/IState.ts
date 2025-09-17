import { IOrderState } from "../OrdersSlice";
import { ICartState } from "./ICartState";
import { ICategoryState } from "./ICategoryState";
import { IProductState } from "./IProductState";

export interface IState {
    Cart: ICartState,
    Products: IProductState,
    Categories: ICategoryState,
    Orders: IOrderState
}