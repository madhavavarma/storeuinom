import { useSelector } from "react-redux";
import { IState } from "@/store/interfaces/IState";
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";
import Product2 from "./Product2";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper.min.css'

interface IProps {
  heading: string;
  label: string;
}

const ProductCarousel = ({ heading, label }: IProps) => {
  const products = useSelector((state: IState) => state.Products.products);
  const navigationHelper = useNavigationHelper();

  const filteredProducts = products.filter(p => p.labels.filter(lbl => lbl.toUpperCase() === label.toUpperCase()).length > 0);
  if (filteredProducts.length === 0) return null;

  return (
    <div className="py-8 px-4 bg-white relative">
      {/* Heading */}
      <div className="flex justify-between items-center mb-4 px-0">
        <h2 className="text-xl font-semibold text-gray-700 mb-1 tracking-tight uppercase" style={{ fontFamily: `'Dancing Script', cursive` }}>
          {heading}
        </h2>
        <div className="h-0.5 w-10 bg-green-100 rounded-full mb-1" />
        <Button
          variant="outline"
          onClick={() => navigationHelper.goToProducts("", label)}
          className="bg-green-800 text-white"
        >
          View More <ArrowRight />
        </Button>
      </div>

      {/* Swiper Carousel (No Arrows) */}
      <Swiper
        spaceBetween={2}
        breakpoints={{
          0: {
            slidesPerView: 1.4,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="px-2"
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <Product2 product={product} isHideDrawer={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
