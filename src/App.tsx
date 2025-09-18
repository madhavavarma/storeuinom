import './App.css'
import 'tailwindcss/tailwind.css'
import Routing from './Routing';
import Footer from './components/base/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { IProduct } from './interfaces/IProduct';
import { getCategories, getProducts, getAppSettings } from './helpers/api';
import { ProductActions } from './store/ProductSlice';
import { ICategory } from './interfaces/ICategory';
import { CategoryActions } from './store/CategorySlice';
import RightDrawer from './components/pages/Shared/RightDrawer';
import ProductDetail from './components/pages/Products/ProductDetail';
import { IState } from './store/interfaces/IState';
import { CartActions } from './store/CartSlice';
import { AppSettingsActions } from './store/AppSettingsSlice';
import CartSynk from './components/pages/Cart/CartSynk';
 

const App: React.FC = () => {

  const dispatch = useDispatch();

  const productDetail = useSelector((state: IState) => state.Products.productDetail);

  const hideProductDetail = () => {
    dispatch(ProductActions.setProductDetail(null))
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products: IProduct[] = await getProducts();
        dispatch(ProductActions.setProducts(products));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories: ICategory[] = await getCategories();
        dispatch(CategoryActions.setCategories(categories));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    // load app settings first so header/logo is available
    const loadAppSettings = async () => {
      try {
        const settings = await getAppSettings();
        dispatch(AppSettingsActions.setAppSettings(settings));
      } catch (e) {
        console.error('Failed to load app settings', e);
      }
    };     

    loadAppSettings().then(() => {
      fetchProducts();
      fetchCategories();
    });

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch(CartActions.loadCart(parsed)); // We'll add this reducer below
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }
    } else {
      console.log("no cart items")
    }
    
  }, [dispatch]);
  
  return (
    <main className='bg-[#fff] flex flex-col flex-1' style={{ maxWidth: "1300px", margin: "0 auto", minHeight: "100vh" }}>
      <Routing />

      {/* Product Detail Drawer */}
      {productDetail && (
        <RightDrawer isOpen onClose={() => hideProductDetail()}>
          <ProductDetail product={productDetail} closeRightDrawer={hideProductDetail} />
        </RightDrawer>
      )}

      <CartSynk />

      <Footer />
    </main>
  );
};

export default App;
