import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavMenu } from "./NavMenu";
import { useEffect, useState } from "react";
import AuthDrawer from "./AuthDrawer";
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { supabase } from "@/supabaseClient";


const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl] = useState<string | undefined>(undefined);
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    // Check on mount
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session?.user);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const navigationHelper = useNavigationHelper();

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const appLogo = useSelector((state: RootState) => state.AppSettings.logoUrl);
  const logoSrc = appLogo || logoUrl || "";

  return (
    <section className="flex flex-col mb-[140px]">
      {/* Fixed Header */}
      <header className="text-white fixed w-full top-0 left-0 z-10 shadow-md">
        {/* Main Header */}
        <div
          className={`pl-2 pr-2 bg-[#5dbf13] h-[80px] flex items-center w-full transition-all duration-500 ${
            scrolled ? "hidden" : ""
          }`}
        >
          <div className="w-full pl-2 pr-2">
            <div className="flex items-center justify-between text-lg">
              <span>
                <img
                  src={logoSrc}
                  className="max-w-[80px] cursor-pointer"
                  alt="Logo"
                  onClick={() => navigationHelper.goToHome()}
                />
                
              </span>
              <div className="flex items-center gap-2">
                <span
                  onClick={() => {
                    if (isAuthenticated) {
                      navigationHelper.goToOrders();
                    } else {
                      setAuthOpen(true);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png"  />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </span>
                {isAuthenticated && (
                  <button
                    className="ml-2 px-3 py-1 rounded bg-white text-[#5dbf13] font-semibold hover:bg-gray-100 border border-[#5dbf13] transition"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to sign out?')) {
                        await supabase.auth.signOut();
                      }
                    }}
                  >
                    Sign Out
                  </button>
                )}
                <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Header */}
        <div
          className={`bg-[#1ca301] w-full flex items-center transition-all duration-300 ease-in-out ${
            scrolled
              ? "h-0 fixed top-0 left-0 z-50 overflow-hidden"
              : "h-[60px] fixed z-50"
          }`}
        >
          <div className="w-full z-50">
            <div className="flex items-center justify-between">
              <span>
                <NavMenu />
              </span>
            </div>
          </div>
        </div>

        {/* Alternative Navigation Header (Visible on Scroll) */}
        <div
          className={`bg-[#1ca301] w-full flex items-center transition-all duration-300 ease-in-out ${
            scrolled
              ? "h-[60px] fixed top-0 left-0 z-50"
              : "h-0 fixed top-0 left-0 z-50 overflow-hidden"
          }`}
        >
          <div className="w-full z-50">
            <div className="flex items-center justify-between">
              <span>
                <NavMenu />
              </span>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
