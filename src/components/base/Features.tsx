import { ShoppingCartIcon, DollarSignIcon, HeadphonesIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const iconMapper: Record<string, React.ReactNode> = {
  'shopping-cart': <ShoppingCartIcon className="text-4xl text-green-500" />,
  'dollar-sign': <DollarSignIcon className="text-4xl text-green-500" />,
  'headphones': <HeadphonesIcon className="text-4xl text-green-500" />,
};

const Features = ({ bgColor = 'bg-gray-0' }: { bgColor?: string }) => {
  const appSettings = useSelector((state: RootState) => state.AppSettings);
  const featuresFromStore = appSettings?.branding?.features;

  const featuresList: Feature[] = (featuresFromStore && featuresFromStore.length)
    ? featuresFromStore.map((f: any) => ({
        title: f.title || '',
        description: f.description || '',
        icon: iconMapper[f.icon || ''] || <ShoppingCartIcon className="text-4xl text-green-500" />,
      }))
    : [];

  return (
    <div className={`${bgColor} mt-6 text-xs`}>
      <div className="flex flex-wrap justify-between gap-2">
        {featuresList.map(({ title, description, icon }, index) => (
          <div key={index} className="single_facts w-full md:w-[30%]">
            <Card className={`${bgColor} transition-shadow duration-300 border-0 px-2 text-4xl`}>
              <CardContent className="flex items-center justify-start">
                <div className="facts_icon mr-4 border-2 p-4">{icon}</div>
                <div className="facts_caption text-gray">
                  <h4 className="text-xs font-semibold mb-2">{title}</h4>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
