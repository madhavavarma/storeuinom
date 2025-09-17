import { IProduct } from "@/interfaces/IProduct";
import { ProductActions } from "@/store/ProductSlice";
import { Star } from "lucide-react";
import { useDispatch } from "react-redux";

interface ProductProps {
  product: IProduct;
  labels?: string[];
  isHideDrawer?: boolean;
}

const Product2 = ({ product }: ProductProps) => {
  const { name, price, imageUrls } = product;
  const dispatch = useDispatch();

  const setProudctDetail = () => {
    dispatch(ProductActions.setProductDetail(product));
  };

  const rating = 5;
  const reviews = 30;

  return (
    <div
      className="aspect-[2/2] bg-white border border-gray-200 rounded shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col"
      onClick={setProudctDetail}
    >
      {/* Product Image */}
      <div
        className="relative w-full h-48 rounded-t bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${imageUrls[0]})` }}
      >
        {/* Labels on Image */}
        {product.labels.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.labels.map((label, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col justify-between flex-grow px-3 py-3 space-y-2">
       {/* Rating + Price */}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-700 gap-2">
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md font-medium">
            {rating.toFixed(1)}
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Highlighted Price */}
        <span className="text-sm font-extrabold text-white bg-green-500 px-3 py-1 rounded-md shadow-sm">
          ₹{price}
        </span>
      </div>

        {/* Product Name */}
        <p className="font-bold text-gray-900 line-clamp-2 min-h-[42px] uppercase" style={{ fontSize: '12px', letterSpacing: '0.1px' }}>
          {name}
        </p>
      </div>
    </div>
  );
};

export default Product2;
