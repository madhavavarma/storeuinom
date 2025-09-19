import { useSelector, useDispatch } from "react-redux";
import { IState } from "@/store/interfaces/IState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Wallet,
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAppSettings } from "@/helpers/api";
import { IAppSettings } from "@/interfaces/IAppSettings";
import { toast } from "sonner";
import { CartActions } from "@/store/CartSlice";
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { IOption } from "@/interfaces/IProduct";
import { ProductActions } from "@/store/ProductSlice";
import emailjs from "@emailjs/browser";
import { createOrder } from "@/helpers/api";
import { ICartState } from "@/store/interfaces/ICartState";


export default function CheckoutPage() {
  const cart = useSelector((state: IState) => state.Cart);
  const cartitems = useSelector((state: IState) => state.Cart.cartitems);
  const totalAmount = cartitems?.reduce((acc, item) => acc + item.totalPrice, 0);
  const navigationHelper = useNavigationHelper();
  const dispatch = useDispatch();
  const checkoutData = useSelector((state: IState) => state.Cart.checkoutdata);

  const [appSettings, setAppSettings] = useState<IAppSettings | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Load app settings from Supabase branding
  useEffect(() => {
    getAppSettings().then((settings) => {
      setAppSettings(settings);
      // Build initial form state from config
      const initial: any = {};
      settings?.branding?.checkoutSections?.forEach(section => {
        section.fields.forEach(field => {
          if (checkoutData && checkoutData[field.name] !== undefined) {
            initial[field.name] = checkoutData[field.name];
          } else if ((field.type === "radio" || field.type === "dropdown") && Array.isArray((field as any).options) && (field as any).options.length > 0) {
            // Use defaultValue from field if present, else from first enabled option, else blank
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
    dispatch(CartActions.setCheckoutData(formData));
    setSameAsPhone(formData.whatsapp === formData.phone && formData.whatsapp !== "");
  }, [formData]);

  const handleChange = (field: string, value: any, regex?: string, errorMessage?: string) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
    // If regex is provided, validate immediately
    if (regex && value !== undefined) {
      try {
        const re = new RegExp(regex);
        if (!re.test(value)) {
          setFieldErrors((prev: Record<string, string | boolean>) => ({ ...prev, [field]: errorMessage || 'Invalid format' }));
        } else {
          setFieldErrors((prev: Record<string, string | boolean>) => ({ ...prev, [field]: false }));
        }
      } catch {
        setFieldErrors((prev: Record<string, string | boolean>) => ({ ...prev, [field]: errorMessage || 'Invalid regex' }));
      }
    } else {
      setFieldErrors((prev: Record<string, string | boolean>) => ({ ...prev, [field]: false }));
    }
  };

  const handleSameAsPhoneToggle = () => {
    const newValue = !sameAsPhone;
    setSameAsPhone(newValue);
  setFormData((prev: Record<string, any>) => ({
      ...prev,
      whatsapp: newValue ? prev.phone : "",
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate required fields and regex from config
    const errors: { [key: string]: string | boolean } = {};
    appSettings?.branding?.checkoutSections?.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          errors[field.name] = true;
        }
        // Regex validation for text/textarea
        if ((field.type === 'text' || field.type === 'textarea') && field.regex && formData[field.name]) {
          try {
            const re = new RegExp(field.regex);
            if (!re.test(formData[field.name])) {
              errors[field.name] = field.regexError || 'Invalid format';
            }
          } catch {
            errors[field.name] = field.regexError || 'Invalid regex';
          }
        }
      });
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fill all required fields correctly");
      return;
    }

  const orderId = `${Date.now()}_${formData.phone || "guest"}`;

    createOrder(cart as ICartState).then(async (order) => {

      if (!order) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      setIsSendingEmail(true);
      try {
        await emailjs.send(
          "service_dek6sgr",
          "template_ql4ymg9",
          {
            to_email: formData.email,
            user_phone: formData.phone,
            user_email: formData.email,
            user_address: formData.address,
            user_city: formData.city,
            user_pincode: formData.pincode,
            cart_items: JSON.stringify(cartitems, null, 2),
            total_amount: totalAmount.toFixed(2),
            order_id: orderId,
          },
          "efiQJ5NNt1J3GJD--"
        );
        console.log("Order placed successfully! Confirmation email sent.");
        dispatch(CartActions.clearCart());
        navigationHelper.goToThankYou(order.id || "");
      } catch (error) {
        console.error("Email sending error:", error);
        toast.error("Order placed, but confirmation email failed.");
        dispatch(CartActions.clearCart());
        navigationHelper.goToThankYou(order.id || "");
      } finally {
        setIsSendingEmail(false);
      }
    })
  };

  const handleRemoveItem = (item: any) => {
    dispatch(
      CartActions.removeItem({
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
        ? CartActions.increaseQuantity({ productId, selectedOptions })
        : CartActions.decreaseQuantity({ productId, selectedOptions })
    );
  };

  return (
  <div className="bg-[#fff] p-4 sm:p-6 md:p-8 w-full mx-auto space-y-8 mt-8 rounded-lg shadow-lg" >
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="flex items-center text-sm text-gray-600 hover:text-green-700"
          onClick={() => navigationHelper.goToProducts()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-lime-500 text-transparent bg-clip-text flex justify-center items-center gap-2">
            <Wallet className="w-8 h-8" />
            Checkout
          </h1>
          <div className="mt-2 h-1 w-24 bg-green-400 mx-auto rounded-full" />
        </motion.div>

        <div className="w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cart Summary */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-green-50 border-green-200 w-full" style={{minWidth: '100%', maxWidth: '100%'}}>
              <CardContent className="p-4 space-y-4 w-full sm:max-w-full lg:min-w-[500px] lg:w-auto">
                <h2 className="text-lg font-semibold text-green-800 flex-row  pb-3 border-b">
                  🛒 Order Items
                  {/* Product & Item Count */}
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
                    {/* Product Image */}
                    <img
                      src={item.product.imageUrls?.[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-800 truncate">
                          {item.product.name}
                        </p>
                        {item.product.shortdescription && (
                          <span className="block text-xs text-gray-500 line-clamp-1">{item.product.shortdescription}</span>
                        )}
                        {item.product.deliverydescription && (
                          <span className="block text-xs text-green-700 line-clamp-1 font-medium italic">{item.product.deliverydescription}</span>
                        )}
                      </div>
                      {item.selectedOptions &&
                        Object.entries(item.selectedOptions).map(([variantName, option]) => (
                          <p key={variantName} className="text-gray-500 text-xs">
                            {variantName}: <span className="font-medium">{option?.name}</span>
                          </p>
                        ))}

                      {/* Quantity & Price Section */}
                      <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                        {/* Quantity Controls */}
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

                        {/* Price */}
                        <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
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
                    {/* Label */}
                    <span className="text-base whitespace-nowrap">Total</span>
                  </div>

                  {/* Amount */}
                  <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">
                    ₹{totalAmount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right: Address + Contact */}
        <div className="space-y-6">
          {appSettings?.branding?.checkoutSections?.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-4 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {section.id === '1' && <Phone className="w-4 h-4" />} 
                  {section.id === '2' && <MapPin className="w-4 h-4" />} 
                  {section.id === '3' && <Wallet className="w-4 h-4" />} 
                  {section.title}
                </h2>
                {section.fields.map((field) => {
                  if (field.type === "text") {
                    return (
                      <div key={field.id ?? field.name} className="space-y-1">
                        <Input
                          type={field.name === "email" ? "email" : "text"}
                          placeholder={field.label}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value, field.regex, field.regexError)}
                          className={fieldErrors[field.name] ? "border-red-500" : ""}
                          disabled={!!field.disabled}
                          required={!!field.required}
                        />
                        {fieldErrors[field.name] && typeof fieldErrors[field.name] === 'string' && (
                          <span className="text-xs text-red-500">{fieldErrors[field.name]}</span>
                        )}
                      </div>
                    );
                  }
                  if (field.type === "textarea") {
                    return (
                      <div key={field.id ?? field.name} className="space-y-1">
                        <textarea
                          placeholder={field.label}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value, field.regex, field.regexError)}
                          className={`w-full rounded border px-3 py-2 ${fieldErrors[field.name] ? "border-red-500" : "border-gray-300"}`}
                          rows={3}
                          disabled={!!field.disabled}
                          required={!!field.required}
                        />
                        {fieldErrors[field.name] && typeof fieldErrors[field.name] === 'string' && (
                          <span className="text-xs text-red-500">{fieldErrors[field.name]}</span>
                        )}
                      </div>
                    );
                  }
                  if (field.type === "radio") {
                    return (
                      <RadioGroup
                        key={field.id ?? field.name}
                        value={formData[field.name]}
                        onValueChange={(val) => handleChange(field.name, val)}
                        className="space-y-2"
                        disabled={!!field.disabled}
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
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`w-full rounded border px-3 py-2 ${fieldErrors[field.name] ? "border-red-500" : "border-gray-300"}`}
                        disabled={!!field.disabled}
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
                          onChange={e => handleChange(field.name, !!e.target.checked)}
                          disabled={!!field.disabled}
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
                    />
                    Same as phone number
                  </label>
                )}
              </CardContent>
            </Card>
          ))}
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
              {isSendingEmail ? "Placing Order..." : "Place Order"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}