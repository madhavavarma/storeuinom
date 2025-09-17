import { useState } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { IProduct } from "@/interfaces/IProduct";

const Product3 = ({ product }: { product: IProduct }) => {
  const { name, price, imageUrls } = product;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium");


 

  return (
    <div className="max-w-xs mx-auto min-w-[180px] flex-col">
      {/* Product Rating */}
      <section className="flex flex-col items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${index < 4 ? "text-green-400 fill-current" : "text-gray-300"}`}
            />
          ))}
        </div>
      </section>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img src={imageUrls[0]} alt={name} className="object-cover" />
      </div>

      {/* Product Name */}
      <section className="flex justify-center">
        <Badge variant="default">{name}</Badge>
      </section>

      {/* Product Info */}
      <div className="mt-3">
        {/* Size Selection */}
        <div className="mt-3">
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <span>{selectedSize} - {price}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small">Small {price}</SelectItem>
              <SelectItem value="Medium">Medium {price}</SelectItem>
              <SelectItem value="Large">Large {price}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          {/* Quantity Input */}
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-10 text-center text-xs border border-gray-300 rounded-md p-2"
          />

          {/* Add to Cart Button */}
          {/* <Button
            variant="default"
            size="sm"
            onClick={() => handleAddToCart(product)}
            className="px-3 py-1 text-xs font-medium bg-[#5DBF13] flex items-center"
          >
            <ShoppingCartIcon className="w-4 h-4 mr-1" /> Add to Cart
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Product3;
