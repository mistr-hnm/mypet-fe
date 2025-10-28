import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '../components/ui/navigation-menu';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { Menu, X } from "lucide-react"  // hamburger icons
import { useState } from 'react';

export const Route = createFileRoute('/_home')({
  component: Home,
  beforeLoad: () => {
    const data = localStorage.getItem("auth");
    if (!data) {
      throw redirect({
        to: "/login"
      })
    }
  }
})

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 border-b">

        <div className="font-bold text-lg">
          <Link to="/">Pet Org.</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/pets" search={{ limit: 10, page: 1 }}>Explore Pets</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Logout (desktop right side) */}
          <Link 
            to="/" 
            onClick={() => localStorage.clear()} 
            className="text-red-500 font-medium"
          >
            Logout
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 rounded hover:bg-accent" 
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="flex flex-col gap-2 p-4 border-b md:hidden">
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/pets" search={{ limit: 10, page: 1 }} onClick={() => setMobileOpen(false)}>Explore Pets</Link>
          <Link 
            to="/" 
            onClick={() => { localStorage.clear(); setMobileOpen(false) }} 
            className="text-red-500 font-medium"
          >
            Logout
          </Link>
        </div>
      )}
      <Outlet />
    </div>
  )
}
