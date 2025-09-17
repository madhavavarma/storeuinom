import { useEffect, useRef, useState } from "react";
import Product2 from "./Product2";
import FloatingButtonWithTT from "../Shared/FloatingButtonsWithTT";
import { ShoppingCartIcon } from "lucide-react";
import CartDrawer from "../Cart/CartDrawer";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { IState } from "@/store/interfaces/IState";

const MiniProductList = () => {
  const products = useSelector((state: IState) => state.Products.products);
  const [showCart, setShowCart] = useState(false);

  const cartitems = useSelector((state: IState) => state.Cart.cartitems);
  const cartItemCount = cartitems?.reduce((total, item) => total + item.quantity, 0);

  const [shake, setShake] = useState(false);
  const prevCartRef = useRef<number>(cartItemCount);

  useEffect(() => {
    if (prevCartRef.current !== cartItemCount) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      prevCartRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  return (
    <div className="bg-[#fff] w-full flex flex-col items-center py-2 px-4">
      {/* Section Title */}
      <div className="w-full text-center">
        {/* <p className="text-sm text-green-500 mb-1">Select Products</p> */}
  <h2 className="text-2xl font-semibold text-gray-700 mb-2 tracking-tight" style={{ fontFamily: `'Dancing Script', cursive` }}>
          Our Menu
        </h2>
        <div className="h-0.5 w-12 mx-auto bg-green-200 rounded-full mb-4" />
      </div>

      {/* Product Grid */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-5 md:gap-2 justify-start">
          {products.slice(0,10).map((product) => (
            <Product2 key={product.id} product={product} isHideDrawer={false} />
          ))}
        </div>
      </div>

      {/* Cart Drawer & Floating Button */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)}>
        <Cart />
      </CartDrawer>

      {!showCart && (
        <div className="fixed bottom-20 right-2 z-[9999] flex flex-col space-y-2">
          <div className={`relative ${shake ? "animate-shake" : ""}`}>
            <FloatingButtonWithTT
              icon={<ShoppingCartIcon />}
              onClick={() => setShowCart(!showCart)}
              tooltipContent="See your cart"
            />
            {cartItemCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniProductList;
