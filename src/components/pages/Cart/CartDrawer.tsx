import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { IState } from "@/store/interfaces/IState";
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { PackageCheck, ShoppingBag } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CartDrawer({ isOpen, onClose, children }: CartDrawerProps) {
  const cart = useSelector((state: IState) => state.Cart);
  const navigationHelper = useNavigationHelper();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={onClose}
          ></motion.div>

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[90%] lg:w-[25%] bg-white shadow-lg z-[9998] flex flex-col rounded-l-xl"
            initial={{ x: "100%", opacity: 0.5, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{
              x: "100%",
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="border-b flex justify-between items-center px-4 py-4 bg-[#5DBF13] text-white">
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 text-lg">
                ✕
              </button>
            </div>

            {/* Cart Summary */}
            <div className="border-b px-4 py-3 flex justify-between items-center bg-gray-100">
              <h2 className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg text-sm text-green-800 font-medium w-fit">
                  <ShoppingBag className="w-4 h-4" />
                  {cart.cartitems?.length} Product(s)
                  <span className="mx-1">•</span>
                  <PackageCheck className="w-4 h-4" />
                  {cart.cartitems?.reduce((total, item) => total + item.quantity, 0)} Items
                </div>
              </h2>
              <p className="text-lg font-bold text-[#5DBF13]">
                ₹{cart?.totalprice?.toFixed(2)}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 px-2">{children}</div>

            {/* Footer */}
            <div className="border-t p-4 bg-white shadow-md">
              <Button
                className="bg-[#5DBF13] text-white px-4 py-2 rounded-lg w-full hover:bg-green-700"
                onClick={() => navigationHelper.cancel()}
              >
                Checkout
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
