import { Fragment } from "react/jsx-runtime";
import Footer from "../../base/Footer";
import ProductCarousel from "./ProductCarousel";
import MainCarousel from "../../base/HeroCarousel";
import Header from "@/components/base/Header";
import Features from "@/components/base/Features";
import CategoryCarousel from "./CategoryCarousel";
import MiniProductList from "./MiniProductList";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';

const Home: React.FC = () => {
  return (
    <Fragment>

      <Header />
      
      <section >
        <MainCarousel />
        <Features />
        <CategoryCarousel />
        <MiniProductList />
        <MainCarousel />
      </section>

      <section className="">
        {(() => {
          const appSettings = useSelector((state: RootState) => state.AppSettings);
          const carousels = appSettings?.branding?.homeCarousels;
          if (carousels && carousels.length) {
            return carousels.map((c: any, idx: number) => (
              <ProductCarousel key={idx} heading={c.heading} label={c.label} />
            ));
          }
          return (
            <>
              <ProductCarousel heading="Welcome Offer" label="welcome" />
              <ProductCarousel heading="Deals" label="deal" />        
              <ProductCarousel heading="Newly Added" label="new" />        
            </>
          );
        })()}
      </section>
      <Footer />
    </Fragment>
  );
};

export default Home;
