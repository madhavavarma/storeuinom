import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICartItem } from "@/store/interfaces/ICartState";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store/interfaces/IState";
import { CartActions } from "@/store/CartSlice";

export default function ShoppingCart() {
  const cartitems = useSelector((state: IState) => state.Cart.cartitems);
  const dispatch = useDispatch();

  const updateQuantity = (item: ICartItem, isIncrease = true) => {
    const payload = {
      productId: item.product.id || 0,
      selectedOptions: item.selectedOptions as { [variantName: string]: any }, // Cast to string-keyed object
    };

    dispatch(
      isIncrease
        ? CartActions.increaseQuantity(payload)
        : CartActions.decreaseQuantity(payload)
    );
  };

  const removeItem = (item: ICartItem) => {
    const payload = {
      productId: item.product.id || 0,
      selectedOptions: item.selectedOptions as { [variantName: string]: any },
    };
    dispatch(CartActions.removeItem(payload));
  };

  return (
    <div className="w-full bg-white shadow-md rounded-md p-4">
      {cartitems.map((item: ICartItem, index: number) => (
        <div
          key={index}
          className="flex flex-col py-3 border-b border-gray-200"
        >
          <div className="flex justify-between items-start">
            {/* Product Image & Info */}
            <div className="flex items-start w-full">
              <img
                src={item.product.imageUrls[0]}
                alt={item.product.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="ml-3 text-sm">
                <div className="flex flex-col">
                  <p className="font-medium">{item.product.name}</p>
                  {item.product.shortdescription && (
                    <span className="block text-xs text-gray-500 line-clamp-1 mt-1">{item.product.shortdescription}</span>
                  )}
                </div>
                {/* Selected Options */}
                {item.selectedOptions &&
                  Object.entries(item.selectedOptions).map(
                    ([variantName, option]) => (
                      <p key={variantName} className="text-gray-500 text-xs">
                        {variantName}:{" "}
                        <span className="font-medium">{option?.name}</span>
                      </p>
                    )
                  )}
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => removeItem(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
              <Button
                size="icon"
                className="w-7 h-7 bg-[#5DBF13] text-white rounded-full hover:bg-green-700"
                onClick={() => updateQuantity(item, false)}
              >
                <Minus size={14} />
              </Button>

              <span className="text-sm font-semibold w-6 text-center">
                {item.quantity}
              </span>

              <Button
                size="icon"
                className="w-7 h-7 bg-[#5DBF13] text-white rounded-full hover:bg-green-700"
                onClick={() => updateQuantity(item)}
              >
                <Plus size={14} />
              </Button>
            </div>

            {/* Price */}
            <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">
              ₹{item.totalPrice}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}