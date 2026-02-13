'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import { usePathname } from 'next/navigation'
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
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import BrokerDrawer from '@/components/BrokerDrawer'
import SubmitPlacementDrawer from '@/components/SubmitPlacementDrawer'
import SharedLayout from "@/components/SharedLayout";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Life', href: '/life', icon: UserGroupIcon },
  { 
    name: 'Non-Life', 
    href: '/non-life', 
    icon: UserGroupIcon,
    children: [
      { name: 'Broker', href: '#', icon: UserGroupIcon, isDrawer: true },
      { name: 'Submit a Placement', href: '#', icon: DocumentTextIcon, isDrawer: true },
      { name: 'Insurer', href: '/non-life/insurer', icon: ChartBarIcon },
      { name: 'Clients', href: '/broker/clients', icon: UserGroupIcon },
      { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    ],
  },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Register Company', href: '/register-company', icon: BuildingOfficeIcon },
  { name: 'Learning Portal', href: '/learning-portal', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout>{children}</SharedLayout>
  );
} 