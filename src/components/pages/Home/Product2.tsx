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
  const { name, price, imageUrls, productvariants } = product;
  const dispatch = useDispatch();

  // Out of stock logic: if all published options of all published variants are out of stock
  const isOutOfStock = productvariants && productvariants.length > 0
    ? productvariants.filter(v => v.ispublished).every(variant =>
        variant.productvariantoptions.filter(o => o.ispublished).every(option => option.isoutofstock)
      )
    : false;

  const setProudctDetail = () => {
    if (!isOutOfStock) {
      dispatch(ProductActions.setProductDetail(product));
    }
  };

  const rating = 5;
  const reviews = 30;

  return (
    <div
      className={`aspect-[2/2] bg-white border border-gray-200 rounded shadow-sm flex flex-col transition-all relative ${isOutOfStock ? 'opacity-60 pointer-events-none' : 'hover:shadow-md cursor-pointer'}`}
      onClick={setProudctDetail}
      tabIndex={isOutOfStock ? -1 : 0}
      aria-disabled={isOutOfStock}
    >
      {/* Out of Stock Note */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md text-center">
          Out of Stock
        </div>
      )}
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

        {/* Product Name and Short Description */}
        <div className="min-h-[42px]">
          <p className="font-bold text-gray-900 line-clamp-2 uppercase" style={{ fontSize: '12px', letterSpacing: '0.1px' }}>
            {name}
          </p>
          {product.shortdescription && (
            <span className="block text-xs text-gray-500 line-clamp-1 mt-1">{product.shortdescription}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product2;
