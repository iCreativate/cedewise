'use client'

import { Fragment, useState, useMemo, useEffect } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  WifiIcon,
  BanknotesIcon,
  ScaleIcon,
  BoltIcon,
  FireIcon,
  ShieldExclamationIcon,
  ArrowsPointingOutIcon,
  CloudIcon,
  ArrowTrendingDownIcon,
  BeakerIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import BrokerDrawer from '@/components/BrokerDrawer'
import { useUser } from '@/context/UserContext'
import NotificationBar from '@/components/NotificationBar'
import GlobalNotificationBar from '@/components/GlobalNotificationBar'

// Navigation type definitions
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string, titleId?: string }>;
  children?: NavigationSubItem[];
  isDrawer?: boolean;
}

interface NavigationSubItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string, titleId?: string }>;
  isDrawer?: boolean;
  children?: NavigationSubItem[];
}

// Base navigation - common across all roles
const baseNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'My Quote', href: '/my-quote', icon: ClipboardDocumentListIcon },
  { name: 'My Documents', href: '/my-documents', icon: DocumentTextIcon },
  { name: 'Currency Convertor', href: '/currency-convertor', icon: BanknotesIcon },
  { name: 'Learning Portal', href: '/learning-portal', icon: AcademicCapIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// Move handleNavigationClick above the NavigationItem component
export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isBrokerDrawerOpen, setIsBrokerDrawerOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const router = useRouter()
  const { userRole, userName, logout } = useUser()

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    // Check initial status
    setIsOnline(navigator.onLine);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toggle online/offline mode manually
  const toggleOnlineMode = () => {
    setIsOnline(!isOnline);
    
    // Here you would implement any app-wide behavior changes for offline mode
    if (!isOnline) {
      // Switching to online mode
      console.log("Switching to online mode");
      // You could sync any cached data here
    } else {
      // Switching to offline mode
      console.log("Switching to offline mode");
      // You could prepare offline data cache here
    }
  };

  // Handle logout with navigation to landing page
  const handleLogout = () => {
    logout()
    // Force redirect to landing page
    window.location.href = '/'
  }

  const handleNavigationClick = (item: NavigationItem | NavigationSubItem) => {
    if (item.isDrawer) {
      if (item.name === 'Broker') {
        setIsBrokerDrawerOpen(true)
      }
    }
  }

  // Create navigation based on user role
  const navigation = useMemo<NavigationItem[]>(() => {
    let nav = [...baseNavigation]
    
    if (userRole === 'broker') {
      // Broker-specific navigation
      nav.splice(1, 0, { 
        name: 'Non-Life', 
        href: '/non-life', 
        icon: UserGroupIcon,
        children: [
          { name: 'Broker', href: '/non-life/broker', icon: UserGroupIcon },
          { 
            name: 'Treaty', 
            href: '#', // Changed to # to ensure it acts as an expandable parent only
            icon: DocumentTextIcon,
            children: [
              { 
                name: 'Proportional', 
                href: '/non-life/treaty/proportional', 
                icon: ScaleIcon,
                children: [
                  { name: 'Surplus', href: '/non-life/treaty/proportional/surplus', icon: BanknotesIcon },
                  { name: 'Quota share', href: '/non-life/treaty/proportional/quota-share', icon: ArrowsPointingOutIcon }
                ]
              },
              { 
                name: 'Non-Proportional', 
                href: '/non-life/treaty/non-proportional', 
                icon: ChartBarIcon,
                children: [
                  { name: 'Risk Excess of Loss (Risk XoL)', href: '/non-life/treaty/non-proportional/risk-xol', icon: ShieldExclamationIcon },
                  { name: 'Cat/Event XoL', href: '/non-life/treaty/non-proportional/cat-xol', icon: CloudIcon },
                  { name: 'Aggregate XoL', href: '/non-life/treaty/non-proportional/aggregate-xol', icon: ArrowTrendingDownIcon },
                  { name: 'Stop Loss', href: '/non-life/treaty/non-proportional/stop-loss', icon: FireIcon }
                ]
              }
            ]
          },
          { 
            name: 'Facultative', 
            href: '#', 
            icon: BeakerIcon,
            children: [
              { name: 'Proportional', href: '/non-life/facultative/proportional', icon: ScaleIcon },
              { name: 'Non-Proportional', href: '/non-life/facultative/non-proportional', icon: ChartBarIcon },
              { name: 'Fac Facility', href: '/non-life/facultative/fac-facility', icon: BoltIcon }
            ]
          },
        ],
      })
      nav.splice(2, 0, { name: 'Clients', href: '/clients', icon: UserGroupIcon })
      nav.splice(3, 0, { name: 'Calendar', href: '/calendar', icon: CalendarIcon })
      nav.splice(4, 0, { name: 'Submissions', href: '/submissions', icon: ClipboardDocumentListIcon })
    } else if (userRole === 'insurer') {
      // Insurer-specific navigation
      nav.splice(1, 0, { 
        name: 'Non-Life', 
        href: '/non-life', 
        icon: UserGroupIcon,
        children: [
          { name: 'Broker/Insurer Submissions', href: '/non-life/reinsurer', icon: ChartBarIcon },
          { 
            name: 'Treaty', 
            href: '#', // Changed to # to ensure it acts as an expandable parent only
            icon: DocumentTextIcon,
            children: [
              { 
                name: 'Proportional', 
                href: '/non-life/treaty/proportional', 
                icon: ScaleIcon,
                children: [
                  { name: 'Surplus', href: '/non-life/treaty/proportional/surplus', icon: BanknotesIcon },
                  { name: 'Quota share', href: '/non-life/treaty/proportional/quota-share', icon: ArrowsPointingOutIcon }
                ]
              },
              { 
                name: 'Non-Proportional', 
                href: '/non-life/treaty/non-proportional', 
                icon: ChartBarIcon,
                children: [
                  { name: 'Risk Excess of Loss (Risk XoL)', href: '/non-life/treaty/non-proportional/risk-xol', icon: ShieldExclamationIcon },
                  { name: 'Cat/Event XoL', href: '/non-life/treaty/non-proportional/cat-xol', icon: CloudIcon },
                  { name: 'Aggregate XoL', href: '/non-life/treaty/non-proportional/aggregate-xol', icon: ArrowTrendingDownIcon },
                  { name: 'Stop Loss', href: '/non-life/treaty/non-proportional/stop-loss', icon: FireIcon }
                ]
              }
            ]
          },
          { 
            name: 'Facultative', 
            href: '#',
            icon: BeakerIcon,
            children: [
              { name: 'Proportional', href: '/non-life/facultative/proportional', icon: ScaleIcon },
              { name: 'Non-Proportional', href: '/non-life/facultative/non-proportional', icon: ChartBarIcon },
              { name: 'Fac Facility', href: '/non-life/facultative/fac-facility', icon: BoltIcon }
            ]
          },
        ],
      })
    } else if (userRole === 'reinsurer') {
      // Reinsurer-specific navigation with updated structure
      nav = [
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { 
        name: 'Non-Life', 
        href: '/non-life', 
        icon: UserGroupIcon,
        children: [
            { name: 'Broker/Insurer Submissions', href: '/non-life/reinsurer', icon: ChartBarIcon },
          { name: 'Reinsurer List', href: '/reinsurer/list', icon: UserGroupIcon },
            { 
              name: 'Treaty', 
              href: '#',
              icon: DocumentTextIcon,
              children: [
                { name: 'Proportional', href: '/non-life/reinsurer/treaty/proportional', icon: ScaleIcon },
                { name: 'Surplus', href: '/non-life/reinsurer/treaty/surplus', icon: BanknotesIcon },
                { name: 'Quota share', href: '/non-life/reinsurer/treaty/quota-share', icon: ArrowsPointingOutIcon },
                { 
                  name: 'Non-Proportional', 
                  href: '/non-life/reinsurer/treaty/non-proportional', 
                  icon: ChartBarIcon,
                  children: [
                    { name: 'Risk XoL', href: '/non-life/reinsurer/treaty/non-proportional/risk-xol', icon: ShieldExclamationIcon },
                    { name: 'Cat/Event XoL', href: '/non-life/reinsurer/treaty/non-proportional/cat-xol', icon: CloudIcon },
                    { name: 'Aggregate XoL', href: '/non-life/reinsurer/treaty/non-proportional/aggregate-xol', icon: ArrowTrendingDownIcon },
                    { name: 'Stop Loss', href: '/non-life/reinsurer/treaty/non-proportional/stop-loss', icon: FireIcon }
                  ]
                }
              ]
            },
            { 
              name: 'Facultative', 
              href: '#',
              icon: BeakerIcon,
              children: [
                { name: 'Proportional', href: '/non-life/reinsurer/facultative/proportional', icon: ScaleIcon },
                { name: 'Non-Proportional', href: '/non-life/reinsurer/facultative/non-proportional', icon: ChartBarIcon },
                { name: 'Fac Facility', href: '/non-life/reinsurer/facultative/fac-facility', icon: BoltIcon }
              ]
            }
          ],
        },
        { name: 'My Quote', href: '/my-quote', icon: ClipboardDocumentListIcon },
        { name: 'My Documents', href: '/my-documents', icon: DocumentTextIcon },
        { name: 'Currency Convertor', href: '/currency-convertor', icon: BanknotesIcon },
        { name: 'Learning Portal', href: '/learning-portal', icon: AcademicCapIcon },
        { name: 'Profile', href: '/profile', icon: UserCircleIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
      ];
    } else {
      // Default/fallback navigation (when role not determined)
      nav.splice(1, 0, { 
        name: 'Non-Life', 
        href: '/non-life', 
        icon: UserGroupIcon,
        children: [
          { name: 'Overview', href: '/non-life', icon: ChartBarIcon },
          { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
          { 
            name: 'Treaty', 
            href: '#', // Changed to # to ensure it acts as an expandable parent only
            icon: DocumentTextIcon,
            children: [
              { 
                name: 'Proportional', 
                href: '/non-life/treaty/proportional', 
                icon: ScaleIcon,
                children: [
                  { name: 'Surplus', href: '/non-life/treaty/proportional/surplus', icon: BanknotesIcon },
                  { name: 'Quota share', href: '/non-life/treaty/proportional/quota-share', icon: ArrowsPointingOutIcon }
                ]
              },
              { 
                name: 'Non-Proportional', 
                href: '/non-life/treaty/non-proportional', 
                icon: ChartBarIcon,
                children: [
                  { name: 'Risk Excess of Loss (Risk XoL)', href: '/non-life/treaty/non-proportional/risk-xol', icon: ShieldExclamationIcon },
                  { name: 'Cat/Event XoL', href: '/non-life/treaty/non-proportional/cat-xol', icon: CloudIcon },
                  { name: 'Aggregate XoL', href: '/non-life/treaty/non-proportional/aggregate-xol', icon: ArrowTrendingDownIcon },
                  { name: 'Stop Loss', href: '/non-life/treaty/non-proportional/stop-loss', icon: FireIcon }
                ]
              }
            ]
          },
          { 
            name: 'Facultative', 
            href: '#',
            icon: BeakerIcon,
            children: [
              { name: 'Proportional', href: '/non-life/facultative/proportional', icon: ScaleIcon },
              { name: 'Non-Proportional', href: '/non-life/facultative/non-proportional', icon: ChartBarIcon },
              { name: 'Fac Facility', href: '/non-life/facultative/fac-facility', icon: BoltIcon }
            ]
          },
        ],
      })
    }
    
    // Add Profile and Settings at the end for all roles
    nav.push({ name: 'Profile', href: '/profile', icon: UserCircleIcon })
    nav.push({ name: 'Settings', href: '/settings', icon: Cog6ToothIcon })
    
    return nav
  }, [userRole])

  // Add debugging code after navigation is defined
  useEffect(() => {
    // Log the current user role and navigation state
    console.log('SharedLayout: Current user role:', userRole)
    console.log('SharedLayout: Current navigation:', navigation)
    
    // Store navigation data for debugging purposes
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug_navigation', JSON.stringify(navigation))
      localStorage.setItem('debug_userRole', userRole || 'none')
      localStorage.setItem('debug_lastUpdated', new Date().toISOString())
    }
  }, [userRole, navigation])

  // Create a recursive navigation component to handle arbitrary nesting
  const NavigationItem = ({ item, pathname }: { item: NavigationItem | NavigationSubItem, pathname: string }) => {
    const isExpanded = expandedItems[item.name] || false;
    
    const toggleExpand = (e: React.MouseEvent) => {
      e.preventDefault();
      setExpandedItems(prev => ({
        ...prev,
        [item.name]: !prev[item.name]
      }));
    };
    
    return (
      <li key={item.name}>
        {item.isDrawer ? (
          <button
            onClick={() => handleNavigationClick(item)}
            className={classNames(
              'text-gray-400 hover:text-white hover:bg-gray-800',
              'group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            )}
          >
            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            {item.name}
          </button>
        ) : (
          <div>
            <div className="flex items-center">
              <Link
                href={item.children && item.children.length > 0 ? '#' : item.href}
                onClick={item.children && item.children.length > 0 ? toggleExpand : undefined}
                className={classNames(
                  pathname === item.href || pathname.startsWith(item.href)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full'
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
              {item.children && item.children.length > 0 && (
                <button
                  onClick={toggleExpand}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            {item.children && isExpanded && (
              <ul role="list" className="mt-1 px-2">
                {item.children.map((subItem) => (
                  <SubNavigationItem key={subItem.name} item={subItem} pathname={pathname} level={1} />
                ))}
              </ul>
            )}
          </div>
        )}
      </li>
    );
  };

  // Component to handle submenu items at any level
  const SubNavigationItem = ({ 
    item, 
    pathname, 
    level = 1
  }: { 
    item: NavigationSubItem, 
    pathname: string,
    level: number
  }) => {
    const isExpanded = expandedItems[item.name] || false;
    
    const toggleExpand = (e: React.MouseEvent) => {
      e.preventDefault();
      setExpandedItems(prev => ({
        ...prev,
        [item.name]: !prev[item.name]
      }));
    };

    // Calculate padding based on level
    const getPaddingLeft = (level: number) => {
      switch(level) {
        case 1: return 'pl-9';
        case 2: return 'pl-12';
        case 3: return 'pl-16';
        default: return 'pl-20';
      }
    };

    // Calculate text size based on level
    const getTextSize = (level: number) => {
      return level === 1 ? 'text-sm' : 'text-xs';
    };

    // Calculate icon size based on level
    const getIconSize = (level: number) => {
      return level === 1 ? 'h-5 w-5' : 'h-4 w-4';
    };

    // Calculate font weight based on level
    const getFontWeight = (level: number) => {
      return level === 1 ? 'font-semibold' : 'font-medium';
    };
    
    return (
      <li key={item.name}>
        {item.isDrawer ? (
          <button
            onClick={() => handleNavigationClick(item)}
            className={classNames(
              'text-gray-400 hover:text-white hover:bg-gray-800',
              'group flex w-full gap-x-3 rounded-md py-2 pl-9 pr-2 text-sm leading-6 font-semibold'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {item.name}
          </button>
        ) : (
          <div>
            <div className="flex items-center">
              <Link
                href={item.children && item.children.length > 0 ? '#' : item.href}
                onClick={item.children && item.children.length > 0 ? toggleExpand : undefined}
                className={classNames(
                  pathname === item.href || pathname.startsWith(item.href)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                  'group flex gap-x-3 rounded-md py-2 pr-2',
                  getPaddingLeft(level),
                  getTextSize(level),
                  getFontWeight(level),
                  'leading-6 w-full'
                )}
              >
                <item.icon className={`${getIconSize(level)} shrink-0`} aria-hidden="true" />
                <span className="truncate">{item.name}</span>
              </Link>
              {item.children && item.children.length > 0 && (
                <button
                  onClick={toggleExpand}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            {item.children && isExpanded && (
              <ul role="list" className="mt-1 space-y-1">
                {item.children.map((subItem) => (
                  <SubNavigationItem key={subItem.name} item={subItem} pathname={pathname} level={level + 1} />
                ))}
              </ul>
            )}
          </div>
        )}
      </li>
    );
  };

  // Automatically expand parent items of the current page on initial load
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean);
      
      // For expanding parent items based on current path
      navigation.forEach(item => {
        if (item.children && pathname.startsWith(item.href) && item.href !== '#') {
          setExpandedItems(prev => ({ ...prev, [item.name]: true }));
          
          // Also expand Treaty and Facultative items if we're in their paths
          item.children.forEach(child => {
            if ((child.name === 'Treaty' || child.name === 'Facultative') && 
                pathname.includes(child.name.toLowerCase())) {
              setExpandedItems(prev => ({ ...prev, [child.name]: true }));
              
              // Expand Proportional and Non-Proportional items if needed
              if (child.children) {
                child.children.forEach(grandChild => {
                  if (pathname.includes(grandChild.name.toLowerCase())) {
                    setExpandedItems(prev => ({ ...prev, [grandChild.name]: true }));
                  }
                });
              }
            }
          });
        }
      });
    }
  }, [pathname, navigation]);

  return (
    <div>
      <BrokerDrawer isOpen={isBrokerDrawerOpen} onClose={() => setIsBrokerDrawerOpen(false)} />
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href="/dashboard" className="text-white">
                      <span className="text-2xl font-bold tracking-tight">Cedewise</span>
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <NavigationItem key={item.name} item={item} pathname={pathname} />
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="text-white">
              <span className="text-2xl font-bold tracking-tight">Cedewise</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <NavigationItem key={item.name} item={item} pathname={pathname} />
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Online/Offline Toggle */}
              <div className="flex items-center">
                <Switch
                  checked={isOnline}
                  onChange={toggleOnlineMode}
                  className={`${
                    isOnline ? 'bg-green-600' : 'bg-gray-400'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Toggle online mode</span>
                  <span
                    className={`${
                      isOnline ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <div className="ml-2 flex items-center">
                  <WifiIcon className={`h-5 w-5 ${isOnline ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="ml-1 text-xs font-medium text-gray-700">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <NotificationBar />
              {userName && (
                <div className="flex items-center gap-x-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium overflow-hidden mr-2">
                      {userRole === 'broker' ? (
                        <img 
                          src="/broker-avatar.png" 
                          alt="Broker Avatar"
                          onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.textContent = userName?.charAt(0) || 'B';
                            e.currentTarget.style.display = 'flex';
                            e.currentTarget.style.alignItems = 'center';
                            e.currentTarget.style.justifyContent = 'center';
                          }}
                          className="h-full w-full object-cover"
                        />
                      ) : userRole === 'reinsurer' ? (
                        <span>R</span>
                      ) : userRole === 'insurer' ? (
                        <span>I</span>
                      ) : (
                        <span>U</span>
                      )}
                    </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Offline Mode Banner */}
        {!isOnline && (
          <div className="bg-amber-50 border-y border-amber-200">
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="flex p-1 rounded-lg bg-amber-100">
                    <WifiIcon className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  </span>
                  <p className="ml-3 text-sm font-medium text-amber-800">
                    You are in offline mode. Some features may be limited.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-amber-600 hover:text-amber-500 text-sm font-medium"
                  onClick={() => setIsOnline(true)}
                >
                  Switch to online
                </button>
              </div>
            </div>
          </div>
        )}

        <GlobalNotificationBar />

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
} 