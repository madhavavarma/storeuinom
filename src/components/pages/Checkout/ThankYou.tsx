import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ThankYouPage() {
  const navigationHelper = useNavigationHelper();
  const location = useLocation();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");
    setOrderId(id);
  }, [location]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-lime-200 to-yellow-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col items-center justify-center py-20 px-4"
      >
        <motion.div
          initial={{ rotate: -30, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <CheckCircle className="text-green-600 w-24 h-24 md:w-32 md:h-32" />
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold text-green-800 mb-4"
        >
          Thank You!
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 text-lg md:text-2xl mb-6 max-w-2xl mx-auto"
        >
          Your order was placed successfully.<br className="hidden md:block" /> We’ll get started on it right away!
        </motion.p>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 mb-8 px-6 py-4 bg-green-50 border border-green-200 rounded-2xl text-lg text-green-800 font-semibold mx-auto max-w-xl shadow-sm"
          >
            <span className="mr-2">Order ID:</span>
            <span className="break-all text-gray-700 font-mono text-base">{orderId}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2"
        >
          <Button
            onClick={navigationHelper.goToHome}
            className="bg-[#5DBF13] hover:bg-green-700 text-white px-10 py-4 rounded-2xl shadow-lg text-lg font-bold tracking-wide"
          >
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
