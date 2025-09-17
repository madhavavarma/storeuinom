import * as React from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useNavigationHelper } from "@/hooks/use-navigate-helper";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

export function NavMenu() {

  const navigationHelper = useNavigationHelper();
  const appSettings = useSelector((state: RootState) => state.AppSettings);
  const branding = appSettings?.branding || {};
  const siteTitle = branding.siteTitle || "Farmers Vibe";
  const welcomeText = branding.welcomeText || "Welcome to Farmers Vibe. Your One-Stop Destination for Healthy & Nutritious Food!";
  const tagline = branding.tagline || "Pure, natural, and healthy - no chemicals, refined sugar, preservatives or artificial additives for a better lifestyle!";
  const menuTexts = branding.menu || {};
  const menuHome = menuTexts.home || "Enjoy a wholesome shopping experience!";
  const menuProducts = menuTexts.products || "Discover a wide range of nutritious and wholesome foods!";
  const menuAbout = menuTexts.about || "Committed to a healthier you. Click to know about us.";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
            <NavigationMenuTrigger className="uppercase font-bold text-white-700" style={{ fontSize: '12px', letterSpacing: '1.2px' }}>SHOP</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <ListItem
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    onClick={() => navigationHelper.goToHome()}
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className="mb-2 mt-4 text-lg font-medium">{siteTitle}</div>
                    <p className="text-sm leading-tight text-muted-foreground">{welcomeText}</p>
                    <p className="text-sm leading-tight text-muted-foreground mt-2"><i>{tagline}</i></p>
                  </ListItem>
                </NavigationMenuLink>
              </li>
              <li>
              <ListItem onClick={() => navigationHelper.goToHome()} title="Home">
                {menuHome}
              </ListItem>
              </li>
              <ListItem onClick={() => navigationHelper.goToProducts()} title="Products">
                {menuProducts}
              </ListItem>
              <ListItem onClick={() => navigationHelper.goToAboutus()} title="About Us">
                {menuAbout}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <NavigationMenuTrigger className="uppercase font-bold text-white-700" style={{ fontSize: '12px', letterSpacing: '1.2px' }}>Contact</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {(branding?.nav?.contact)?.map((component: any) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  onClick={() => navigationHelper.goToAboutus()}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <NavigationMenuTrigger className="uppercase font-bold text-white-700" style={{ fontSize: '12px', letterSpacing: '1.2px' }}>Questions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3  md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {(branding?.nav?.faq)?.map((component: any) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  onClick={() => navigationHelper.goToFAQ()}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
