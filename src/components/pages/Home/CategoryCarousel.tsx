import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IState } from '@/store/interfaces/IState';
import Category from './Category';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css'

const CategoryCarousel = () => {
  const categories = useSelector((state: IState) => state.Categories.categories);
  const [swiper, setSwiper] = useState<any>(null);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') swiper?.slidePrev?.();
      if (e.key === 'ArrowRight') swiper?.slideNext?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [swiper]);

  return (
    <div className="bg-[#fff] text-center w-full py-6 px-2">
      {/* "Choose Categories" Text in Green */}
      {/* <p className="text-sm text-green-500 mb-">Choose Categories</p> */}

      {/* "Explore Categories" Heading */}
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-12">Explore Categories</h2> */}

      <div className=" mx-auto relative">
        {/* Left / Right minimal arrows */}
        <button
          aria-label="Previous categories"
          onClick={() => swiper?.slidePrev?.()}
          className={`flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 p-3 md:p-2 rounded-full shadow-md ${showPulse ? 'animate-pulse' : ''}`}
        >
          <ChevronLeft className="w-6 h-6 md:w-5 md:h-5" />
        </button>
        <button
          aria-label="Next categories"
          onClick={() => swiper?.slideNext?.()}
          className={`flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 p-3 md:p-2 rounded-full shadow-md ${showPulse ? 'animate-pulse' : ''}`}
        >
          <ChevronRight className="w-6 h-6 md:w-5 md:h-5" />
        </button>
        <Swiper
          spaceBetween={10}
          onSwiper={setSwiper}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="p-1">
                <div className="rounded-none border-none bg-transparent shadow-none">
                  <Category category={category} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryCarousel;
