import { IState } from "@/store/interfaces/IState";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const CartSync = () => {
  const cart = useSelector((state: IState) => state.Cart);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // ⛔ Skip the first render to avoid overwriting
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return null;
};

export default CartSync;