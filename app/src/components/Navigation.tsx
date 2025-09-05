"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  CogIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MapIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  children?: NavigationItem[];
}

const Navigation: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Réservations',
      href: '/bookings',
      icon: CalendarIcon,
      badge: 3,
      children: [
        { name: 'Nouvelles réservations', href: '/bookings/new', icon: CalendarIcon },
        { name: 'En cours', href: '/bookings/active', icon: ClockIcon },
        { name: 'Historique', href: '/bookings/history', icon: DocumentTextIcon },
      ]
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: UsersIcon,
      children: [
        { name: 'Liste des clients', href: '/clients/list', icon: UsersIcon },
        { name: 'Ajouter client', href: '/clients/new', icon: UserCircleIcon },
      ]
    },
    {
      name: 'Véhicules',
      href: '/vehicles',
      icon: TruckIcon,
      children: [
        { name: 'Ma flotte', href: '/vehicles/fleet', icon: TruckIcon },
        { name: 'Maintenance', href: '/vehicles/maintenance', icon: CogIcon },
      ]
    },
    {
      name: 'Itinéraires',
      href: '/routes',
      icon: MapIcon,
    },
    {
      name: 'Factures',
      href: '/invoices',
      icon: CurrencyEuroIcon,
      children: [
        { name: 'En attente', href: '/invoices/pending', icon: ClockIcon },
        { name: 'Payées', href: '/invoices/paid', icon: CurrencyEuroIcon },
        { name: 'En retard', href: '/invoices/overdue', icon: DocumentTextIcon },
      ]
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: CogIcon,
      children: [
        { name: 'Profil', href: '/settings/profile', icon: UserCircleIcon },
        { name: 'Préférences', href: '/settings/preferences', icon: CogIcon },
        { name: 'Notifications', href: '/settings/notifications', icon: BellIcon },
      ]
    },
  ];

  // Check if current path is active
  const isActiveRoute = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Toggle expanded items
  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Handle mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-expand current section
  useEffect(() => {
    navigationItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => isActiveRoute(child.href));
        if (hasActiveChild && !expandedItems.includes(item.name)) {
          setExpandedItems(prev => [...prev, item.name]);
        }
      }
    });
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = isActiveRoute(item.href);
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.name} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`
                flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${level > 0 ? 'ml-2' : ''}
              `}
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          ) : (
            <Link href={item.href}>
              <div
                className={`
                  flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${level > 0 ? 'ml-2' : ''}
                `}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>
        
        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-8 border-b border-gray-200">
        <Link href="/dashboard">
          <div className="flex items-center space-x-2">
            <TruckIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VTC Connect Pro</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map(item => renderNavigationItem(item))}
      </nav>

      {/* User info and logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'email@example.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            <Link href="/dashboard">
              <div className="flex items-center space-x-2">
                <TruckIcon className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">VTC Connect Pro</span>
              </div>
            </Link>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
      )}

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobile 
          ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0'
        }
        md:relative md:translate-x-0
      `}>
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
        
        <SidebarContent />
      </aside>

      {/* Main content spacer for desktop */}
      {!isMobile && <div className="w-64 flex-shrink-0" />}
      
      {/* Mobile content spacer */}
      {isMobile && <div className="h-16" />}
    </>
  );
};

export default Navigation;
