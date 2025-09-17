import { Button } from "@/components/ui/button";
import { IOption } from "@/interfaces/IProduct";
import { IState } from "@/store/interfaces/IState";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const CartItem = ({ productId, onRemove, onUpdateQuantity }: { productId: number; onRemove: any; onUpdateQuantity: any }) => {
  const cartItem = useSelector((state: IState) =>
    state.Cart.cartitems.find((ci) => ci.product.id === productId)
  );

  if (!cartItem) return null;

  const { product, selectedOptions, quantity } = cartItem;

  const calculateTotalPrice = () => {
    const selectedOptionPrices = Object.values(selectedOptions || {})
      .filter((opt): opt is IOption => opt !== null)
      .reduce((sum, option) => sum + (option.price || 0), 0);

    const basePrice = product?.price || 0;

    return parseFloat(((selectedOptionPrices || basePrice) * quantity).toFixed(2));
  };

  return (
    <div className="flex justify-between items-center py-2 border-b pb-3">
      <div className="flex items-center">
        <img
          src={product?.imageUrls?.[0]}
          alt={product?.name}
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="ml-3 text-sm">
          <h4 className="font-semibold text-gray-800">{product?.name}</h4>

          {/* Selected Options */}
          {selectedOptions &&
            Object.entries(selectedOptions).map(([variantName, option]: any) => (
              <div key={variantName} className="text-gray-600 text-xs">
                {option?.variantName}: <span className="font-medium">{option?.name}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onUpdateQuantity(product.id, Number(e.target.value))}
          className="w-10 text-center text-xs border border-gray-300 rounded-md p-2"
        />
        <span className="text-sm font-bold text-gray-800">₹{calculateTotalPrice()}</span>
        <Button
          variant="link"
          onClick={() => onRemove(product.id)}
          className="text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
