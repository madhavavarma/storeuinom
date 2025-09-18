
import { Card, CardContent } from '../ui/card';
import { ShoppingCartIcon, DollarSignIcon, HeadphonesIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAppSettings } from '@/helpers/api';

const Footer = () => {
  const [siteTitle, setSiteTitle] = useState('');

  useEffect(() => {
    getAppSettings().then(settings => {
      setSiteTitle(settings?.branding?.siteTitle || '');
    });
  }, []);

  return (
    <footer className="dark-footer skin-dark-footer style-2 flex flex-col justify-between mt-auto w-full">
      {/* Before Footer */}
      <div className="before-footer bg-gray-900 pt-4 hidden">
        <div className="flex flex-wrap justify-between gap-2">
          {/* Free Home Delivery */}
          <div className="single_facts w-full md:w-[30%]">
            <Card className="bg-gray-900 p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300  border-0">
              <CardContent className="flex items-center justify-start">
                <div className="facts_icon text-4xl text-green-500 mr-4">
                  <ShoppingCartIcon />
                </div>
                <div className="facts_caption text-white">
                  <h4 className="text-xl font-semibold mb-2">Home Delivery</h4>
                  <p className="text-sm text-gray-400">Enjoy hassle-free delivery, on us!.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Money Back Guarantee */}
          <div className="single_facts w-full md:w-[30%]">
            <Card className="bg-gray-900 p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300  border-0">
              <CardContent className="flex items-center justify-start">
                <div className="facts_icon text-4xl text-green-500 mr-4">
                  <DollarSignIcon />
                </div>
                <div className="facts_caption text-white">
                  <h4 className="text-xl font-semibold mb-2">Money Back Guarantee</h4>
                  <p className="text-sm text-gray-400">Not happy? Get a full refund, no questions asked.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 24x7 Online Support */}
          <div className="single_facts w-full md:w-[30%]">
            <Card className="bg-gray-900 p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardContent className="flex items-center justify-start">
                <div className="facts_icon text-4xl text-green-500 mr-4">
                  <HeadphonesIcon />
                </div>
                <div className="facts_caption text-white">
                  <h4 className="text-xl font-semibold mb-2">24x7 Online Support</h4>
                  <p className="text-sm text-gray-400">Always here, anytime you need us.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


      {/* Footer Middle */}
      {false && <div className="footer-middle bg-gray-800 py-8 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          

          {/* Categories */}
          <div className="footer_widget text-left">
            <h4 className="text-white text-lg font-semibold">Categories</h4>
            <ul className="footer-menu text-gray-400 space-y-2">
              <li><a href="#">Organic</a></li>
              <li><a href="#">Grocery</a></li>
              <li><a href="#">Education</a></li>
              <li><a href="#">Furniture</a></li>
            </ul>
          </div>

          {/* Our Company */}
          <div className="footer_widget text-left">
            <h4 className="text-white text-lg font-semibold">Our Company</h4>
            <ul className="footer-menu text-gray-400 space-y-2">
              <li><a href="#">About Us</a></li>
              <li><a href="#">My company</a></li>
              <li><a href="#">Our Studio</a></li>
              <li><a href="#">Nightlife</a></li>
            </ul>
          </div>

          {/* Latest News */}
          <div className="footer_widget text-left">
            <h4 className="text-white text-lg font-semibold">Latest News</h4>
            <ul className="footer-menu text-gray-400 space-y-2">
              <li><a href="#">Offers &amp; Deals</a></li>
              <li><a href="#">My Account</a></li>
              <li><a href="#">My Products</a></li>
              <li><a href="#">Favorites</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer_widget text-left text-xs">
            <h4 className="text-white text-lg font-semibold">Contact Us</h4>
            <p className="text-gray-400 mb-4">
              Let's hear all about it! <a href="#" className="text-green-500">Get in touch</a>
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-center">
                {/* <HomeIcon className="text-green-500 mr-2" /> */}
                <span>Durganagar, Chandrampalem</span>
              </li>
              <li className="flex items-center">
                {/* <HomeIcon className="text-green-500 mr-2" /> */}
                <span>Madhurawada, Visakhapatnam</span>
              </li>
              <li className="flex items-center">
                {/* <HomeIcon className="text-green-500 mr-2" /> */}
                <span>Andhra Pradesh 530041</span>
              </li>
              <li className="flex items-center">
                {/* <PhoneIcon className="text-green-500 mr-2" /> */}
                (+91) 9666030129
              </li>
            </ul>
          </div>
        </div>
      </div> }


      {/* Footer Bottom */}
      <div className="footer-bottom bg-gray-900 p-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
            {/* Footer Left */}
            <div className="text-gray-400 mb-2 lg:mb-0">
              <p className="mb-0">© Copyright 2020 {siteTitle}. Designed By <a href="https://bootstrapdesigns.net" className="text-green-500">Madhava</a>.</p>
            </div>

            {/* Footer Social Links */}
            <div className="footer_social_links flex space-x-4">
              {/* Uncomment and add social links if needed */}
              {/* <a href="#" className="text-gray-400 hover:text-green-500"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-green-500"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-green-500"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-green-500"><FaLinkedin /></a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
