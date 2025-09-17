import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { ICategory } from "@/interfaces/ICategory";

interface IProps {
  category: ICategory;
}

const Category = (props: IProps) => {
  const navigationHelper = useNavigationHelper();

  const handleClick = () => {
    navigationHelper.goToProducts(props.category.id?.toString());
  };

  return (
    <div
      className="relative w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      {/* Background Image */}
      <img
        src={props.category.image_url}
        alt={props.category.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay Text */}
      <div className="absolute inset-0 bg-black/30 flex items-start justify-start p-3">
        <span className="text-white text-lg font-semibold drop-shadow">
          {props.category.name}
        </span>
      </div>
    </div>
  );
};

export default Category;
