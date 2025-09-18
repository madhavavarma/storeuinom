import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "@/components/ui/dialog";
import { IState } from "@/store/interfaces/IState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { IOption } from "@/interfaces/IProduct";
import { ProductActions } from "@/store/ProductSlice";
import emailjs from "@emailjs/browser";
import { ICheckout } from "@/interfaces/ICheckout";
import { getAppSettings } from "@/helpers/api";
import { IAppSettings } from "@/interfaces/IAppSettings";
import { deleteOrder, updateOrder } from "@/helpers/api";
import { IOrder, OrdersActions } from "@/store/OrdersSlice";


export default function OrderSummary() {
  // Handles order cancellation
  const handleCancelOrder = async () => {
    if (!cart?.id) return;
    setDeleting(true);
    try {
      const result = await deleteOrder(cart.id);
      if (result) {
        toast.success("Order cancelled successfully.");
        setShowCancelDialog(false);
        navigationHelper.goToHome();
      } else {
        toast.error("Failed to cancel order. Please try again.");
      }
    } catch (error) {
      toast.error("Error cancelling order. Please try again.");
    } finally {
      setDeleting(false);
    }
  };
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [appSettings, setAppSettings] = useState<IAppSettings | null>(null);
  const cart = useSelector((state: IState) => state.Orders.showOrder);
  const cartitems = useSelector((state: IState) => state.Orders.showOrder?.cartitems || []);
  const totalAmount = cartitems?.reduce((acc, item) => acc + item.totalPrice, 0);
  const navigationHelper = useNavigationHelper();
  const dispatch = useDispatch();
  const checkoutData = useSelector((state: IState) => state.Orders.showOrder?.checkoutdata);
  const isPending = cart?.status === 'Pending';
  const [formData, setFormData] = useState<any>({});
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    getAppSettings().then((settings) => {
      setAppSettings(settings);
      // Build initial form state from config (dynamic)
      const initial: any = {};
      settings?.branding?.checkoutSections?.forEach(section => {
        section.fields.forEach(field => {
          if (checkoutData && checkoutData[field.name] !== undefined) {
            initial[field.name] = checkoutData[field.name];
          } else if ((field.type === "radio" || field.type === "dropdown") && Array.isArray((field as any).options) && (field as any).options.length > 0) {
            if (field.defaultValue !== undefined) {
              initial[field.name] = field.defaultValue;
            } else {
              const defaultOpt = (field as any).options.find((o: any) => o.defaultValue) || (field as any).options.find((o: any) => !o.disabled);
              initial[field.name] = defaultOpt ? defaultOpt.value : "";
            }
          } else if (field.type === "checkbox") {
            initial[field.name] = field.defaultValue !== undefined ? field.defaultValue : false;
          } else {
            initial[field.name] = field.defaultValue !== undefined ? field.defaultValue : "";
          }
        });
      });
      setFormData(initial);
    });
    dispatch(ProductActions.setProductDetail(null));
  }, []);

  useEffect(() => {
    setSameAsPhone(formData.whatsapp === formData.phone && formData.whatsapp !== "");
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
    setFieldErrors((prev: Record<string, boolean>) => ({ ...prev, [field]: false }));
  };

  const handleSameAsPhoneToggle = () => {
    const newValue = !sameAsPhone;
    setSameAsPhone(newValue);
    setFormData((prev: any) => ({
      ...prev,
      whatsapp: newValue ? prev.phone : "",
    }));
  };

  const handlePlaceOrder = async () => {
    // Dynamic validation from config
    const errors: { [key: string]: boolean } = {};
    appSettings?.branding?.checkoutSections?.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          errors[field.name] = true;
        }
      });
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fill all required fields");
      return;
    }

    const orderId = cart?.id || "";
    if (cart) {
      dispatch(OrdersActions.updateCheckoutData(formData));
    }
  var data = JSON.parse(JSON.stringify(cart)) as IOrder; // Deep clone to avoid mutating store
  data.checkoutdata = formData;
  // Remove id from update payload to avoid identity column error
    if (data && typeof data === 'object' && 'id' in data) {
      delete (data as Partial<IOrder>).id;
    }
  updateOrder(orderId, data as IOrder).then(async (order) => {
      if (!order) {
        toast.error("Failed to update order. Please try again.");
        return;
      }
      setIsSendingEmail(true);
      let emailFailed = false;
      try {
        await emailjs.send(
          "service_dek6sgr",
          "template_ql4ymg9",
          {
            ...formData,
            cart_items: JSON.stringify(cartitems, null, 2),
            total_amount: totalAmount.toFixed(2),
            order_id: orderId,
          },
          "efiQJ5NNt1J3GJD--"
        );
      } catch (error) {
        emailFailed = true;
      } finally {
        setIsSendingEmail(false);
        dispatch(OrdersActions.clearCart());
        if (emailFailed) {
          toast.error("Order updated, but confirmation email failed. Proceeding anyway.");
        } else {
          toast.success("Order updated successfully! Confirmation email sent.");
        }
        navigationHelper.goToThankYou(orderId);
      }
    })
  };

  const handleRemoveItem = (item: any) => {
    dispatch(
      OrdersActions.removeItem({
        productId: item.product.id,
        selectedOptions: item.selectedOptions,
      })
    );
  };

  const handleUpdateQuantity = (
    productId: number,
    selectedOptions: { [variantName: string]: IOption },
    isIncrease: boolean
  ) => {
    const item = cartitems.find(
      (item) =>
        item.product.id === productId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );
    if (!item) return;

    if (!isIncrease && item.quantity <= 1) return;

    dispatch(
      isIncrease
        ? OrdersActions.increaseQuantity({ productId, selectedOptions })
        : OrdersActions.decreaseQuantity({ productId, selectedOptions })
    );
  };

  // Status subtext mapping
  const statusSubtext: Record<string, string> = {
    Pending: 'We are preparing your order',
    Shipped: 'Your order is on the way',
    Delivered: 'Your order has been delivered',
    Cancelled: 'Your order was cancelled',
    // Add more as needed
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Order Details Card */}
      <Card className="bg-white border shadow-sm mb-2">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Order Number</span>
            <span className="text-xl font-bold text-green-700">#{cart?.id ?? '--'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-base font-semibold text-green-700">{cart?.status ?? '--'}</span>
            <span className="text-xs text-gray-400">{statusSubtext[cart?.status ?? ''] ?? ''}</span>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full text-center"
        >
        </motion.div>
        <div className="w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Left: Cart Summary */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 space-y-4">
                <h2 className="text-lg font-semibold text-green-800 flex-row  pb-3 border-b">
                  🛒 Order Items     
                  <div className="pl-1 flex items-center gap-2 bg-green-50 rounded-full text-sm font-medium flex-shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                    {cartitems.length} Product{cartitems.length > 1 && "s"}
                    <span className="mx-1">•</span>
                    <PackageCheck className="w-4 h-4" />
                    {cartitems?.reduce((total, item) => total + item.quantity, 0)} Item
                    {cartitems?.reduce((total, item) => total + item.quantity, 0) > 1 && "s"}
                  </div>                         
                </h2>
                {cartitems.map((item, idx) => (
                  <div
                  key={idx}
                  className="flex gap-4 border-b py-4 text-sm relative"
                >
                  <img
                    src={item.product.imageUrls?.[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      {item.product.shortdescription && (
                        <span className="text-xs text-gray-500 line-clamp-1">{item.product.shortdescription}</span>
                      )}
                    </div>
                    {item.selectedOptions &&
                      Object.entries(item.selectedOptions).map(([variantName, option]) => (
                        <p key={variantName} className="text-gray-500 text-xs">
                          {variantName}: <span className="font-medium">{option?.name}</span>
                        </p>
                      ))}
                    <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                        <Button
                          size="icon"
                          className="w-7 h-7 bg-[#5DBF13] text-white rounded-full hover:bg-green-700"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id || 0,
                              item.selectedOptions,
                              false
                            )
                          }
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          className="w-7 h-7 bg-[#5DBF13] text-white rounded-full hover:bg-green-700"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id || 0,
                              item.selectedOptions,
                              true
                            )
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 absolute top-2 right-2"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                ))}
                <div className="pt-2 flex items-center justify-between text-green-800 font-semibold gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-base whitespace-nowrap">Total</span>
                  </div>
                  <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">
                    ₹{totalAmount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Right: Dynamic Checkout Sections */}
        <div className="space-y-6">
          {appSettings?.branding?.checkoutSections?.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-4 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {section.title}
                </h2>
                {section.fields.map((field) => {
                  if (field.type === "text") {
                    return (
                      <Input
                        key={field.id ?? field.name}
                        type={field.name === "email" ? "email" : "text"}
                        placeholder={field.label}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name as any, e.target.value)}
                        className={fieldErrors[field.name] ? "border-red-500" : ""}
                        disabled={!isPending || !!field.disabled}
                        required={!!field.required}
                      />
                    );
                  }
                  if (field.type === "textarea") {
                    return (
                      <textarea
                        key={field.id ?? field.name}
                        placeholder={field.label}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name as any, e.target.value)}
                        className={`w-full rounded border px-3 py-2 ${fieldErrors[field.name] ? "border-red-500" : "border-gray-300"}`}
                        rows={3}
                        disabled={!isPending || !!field.disabled}
                        required={!!field.required}
                      />
                    );
                  }
                  if (field.type === "radio") {
                    return (
                      <RadioGroup
                        key={field.id ?? field.name}
                        value={formData[field.name]}
                        onValueChange={(val) => handleChange(field.name as any, val)}
                        className="space-y-2"
                        disabled={!isPending || !!field.disabled}
                        required={!!field.required}
                      >
                        {('options' in field && Array.isArray(field.options)) && field.options.map((opt: any) => (
                          <div className={`flex items-center gap-2 ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`} key={opt.value}>
                            <RadioGroupItem value={opt.value} id={opt.value} disabled={!!opt.disabled} />
                            <label htmlFor={opt.value} className="text-sm">{opt.label}</label>
                          </div>
                        ))}
                      </RadioGroup>
                    );
                  }
                  if (field.type === "dropdown") {
                    return (
                      <select
                        key={field.id ?? field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name as any, e.target.value)}
                        className={`w-full rounded border px-3 py-2 ${fieldErrors[field.name] ? "border-red-500" : "border-gray-300"}`}
                        disabled={!isPending || !!field.disabled}
                        required={!!field.required}
                      >
                        <option value="" disabled>{field.label}</option>
                        {('options' in field && Array.isArray(field.options)) && field.options.map((opt: any) => (
                          <option key={opt.value} value={opt.value} disabled={!!opt.disabled}>{opt.label}</option>
                        ))}
                      </select>
                    );
                  }
                  if (field.type === "checkbox") {
                    return (
                      <label key={field.id ?? field.name} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!formData[field.name]}
                          onChange={e => handleChange(field.name as any, e.target.checked ? "true" : "false")}
                          disabled={!isPending || !!field.disabled}
                          required={!!field.required}
                        />
                        {field.label}
                      </label>
                    );
                  }
                  return null;
                })}
                {/* Special: Same as phone checkbox for WhatsApp (optional, only if section has a whatsapp field) */}
                {section.fields.some(f => f.name === "whatsapp") && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={handleSameAsPhoneToggle}
                      disabled={!isPending}
                    />
                    Same as phone number
                  </label>
                )}
              </CardContent>
            </Card>
          ))}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-[#5DBF13] hover:bg-green-700 text-white rounded-xl"
                disabled={cartitems.length === 0 || isSendingEmail}
              >
                {isSendingEmail ? "Updating Order..." : "Update Order"}
              </Button>
            </motion.div>
          )}
        <>
          <Button
            className="w-full bg-red-500 hover:bg-red-700 text-white rounded-xl mb-4"
            onClick={() => setShowCancelDialog(true)}
            disabled={deleting}
          >
            {deleting ? "Cancelling..." : "Cancel Order"}
          </Button>
          <Dialog
            open={showCancelDialog}
            title="Cancel Order"
            onClose={() => setShowCancelDialog(false)}
            actions={
              <>
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowCancelDialog(false)}
                  disabled={deleting}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={handleCancelOrder}
                  disabled={deleting}
                >
                  {deleting ? "Cancelling..." : "Yes"}
                </button>
              </>
            }
          >
            Are you sure you want to cancel this order?
          </Dialog>
        </>
      
        </div>
      </div>
    </div>
  );
}