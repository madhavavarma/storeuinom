import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleMinus, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { IProduct, IOption } from "@/interfaces/IProduct";
import { CartActions } from "@/store/CartSlice";

interface IProps {
  product: IProduct;
  closeRightDrawer: any;
}

const ProductDetail = ({ product, closeRightDrawer }: IProps) => {
  const dispatch = useDispatch();

  const [openSections, setOpenSections] = useState<number>(product.productdescriptions[0]?.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [variantName: string]: IOption | null }>({});

  useEffect(() => {
    if (product.productvariants) {
      const initialOptions: { [variantName: string]: IOption | null } = {};
      
      product.productvariants.forEach((variant) => {
        if (variant.ispublished) {
          // Check for the default option in the variant
          const defaultOption = variant.productvariantoptions.find(option => option.isdefault);
          
          // If a default option exists, set it, otherwise set it as null
          initialOptions[variant.name] = defaultOption || null;
        }
      });
  
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  const toggleSection = (id: number) => {
    setOpenSections(id);
  };

  const handleOptionSelect = (variantName: string, option: IOption) => {
    setSelectedOptions((prev) => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    const cartItem = {
      product,
      selectedOptions: selectedOptions as { [variantName: string]: IOption },
      quantity,
      totalPrice: calculateTotalPrice(),
    };

    console.log("Added to cart:", cartItem);
    dispatch(CartActions.addItem(cartItem));
    closeRightDrawer(null);
  };

  const calculateTotalPrice = () => {
    const selectedOptionPrices = Object.values(selectedOptions)
      .filter((opt): opt is IOption => opt !== null)
      .reduce((sum, option) => sum + (option.price || 0), 0);
  
    return parseFloat(((selectedOptionPrices) * quantity).toFixed(2));
  };


  // Out of stock logic: if all published options of all published variants are out of stock
  const isOutOfStock = product.productvariants && product.productvariants.length > 0
    ? product.productvariants.filter(v => v.ispublished).every(variant =>
        variant.productvariantoptions.filter(o => o.ispublished).every(option => option.isoutofstock)
      )
    : false;

  const allOptionsSelected =
    !isOutOfStock &&
    selectedOptions &&
    Object.values(selectedOptions).every((option) => option !== null) &&
    Object.keys(selectedOptions).length === (product.productvariants?.filter(v => v.ispublished).length || 0);

  return (
    <div className="height-full flex flex-col">
      <div className="w-full px-4 pb-10 space-y-4 mb-[60px]">
        {/* Out of Stock Note */}
        {isOutOfStock && (
          <div className="mb-4 w-full bg-red-500 text-white text-xs font-bold px-2 py-2 rounded shadow-md text-center">
            Out of Stock
          </div>
        )}
        {/* Product Image Slider */}
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {product.imageUrls.map((image, index) => (
              <CarouselItem key={index} className="basis-full">
                <CardContent className="flex items-center justify-center p-0 ">
                  <img
                    src={image}
                    className="rounded-lg h-[450px] object-contain"
                    alt={`Product Image ${index + 1}`}
                  />
                </CardContent>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        {/* Product Title & Price */}

        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">₹{calculateTotalPrice()}</span>
          </div>
          {product.shortdescription && (
            <span className="block text-xs text-gray-500 line-clamp-1">{product.shortdescription}</span>
          )}
          {product.deliverydescription && (
            <span className="block text-xs text-green-700 line-clamp-1 font-medium italic">{product.deliverydescription}</span>
          )}
        </div>

        {/* Variant and Quantity Card */}
        <Card className="p-4 bg-gray-200 rounded-lg shadow-md">
          <div className="space-y-3">
            {/* Dynamic Product Variants */}
            {product.productvariants?.map(
              (variant) =>
                variant.ispublished && (
                  <div key={variant.name} className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{variant.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {variant.productvariantoptions
                        .filter((option) => option.ispublished)
                        .map((option) => {
                          const selectedOption = selectedOptions && selectedOptions[variant.name];
                          const isSelected = selectedOption?.name === option.name;

                          return (
                            <Button
                              key={option.id}
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => handleOptionSelect(variant.name, option)}
                              disabled={option.isoutofstock}
                              className="text-xs px-3 py-1 disabled:opacity-50"
                            >
                              {option.name}
                            </Button>
                          );
                        })}
                    </div>
                  </div>
                )
            )}

            {/* Quantity Control */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 py-1"
                >
                  <CircleMinus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold">{quantity}</span>
                <Button
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 py-1"
                >
                  <CirclePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Expandable Sections */}
        <div className="space-y-3">
          {product.productdescriptions.map(({ id, title, content }) => (
            <div key={title} className="border-b py-2">
              <button
                className="flex justify-between w-full text-sm font-medium"
                onClick={() => toggleSection(id)}
              >
                {title}
                {openSections === id ? (
                  <CircleMinus className="h-4 w-4" />
                ) : (
                  <CirclePlus className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence>
                {openSections === id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-gray-600 text-xs mt-2"
                  >
                    {content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute w-full bottom-0 right-0 p-4 bg-white shadow-md">
        <Button
          className="bg-[#5DBF13] text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={isOutOfStock || !allOptionsSelected}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
