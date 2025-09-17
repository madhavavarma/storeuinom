import { OrderStatus } from "../OrdersSlice";
import { ICheckout } from "@/interfaces/ICheckout";
import { IOption, IProduct } from "@/interfaces/IProduct";

export interface ICartItem {
  product: IProduct;
  selectedOptions: { [variantName: string]: IOption };
  quantity: number;
  totalPrice: number;
}

export interface ICartState {
  cartitems: ICartItem[];
  totalquantity: number;
  totalprice: number;
  checkoutdata?: ICheckout;
  status?: OrderStatus; // e.g., 'pending', 'completed'
}
  
  
  