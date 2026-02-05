'use client'

import {
	BarChart3,
	Clock,
	FileText,
	LayoutDashboard,
	MessageSquare,
	Package,
	Settings,
	User,
	Users,
	Zap,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar'

const data = {
	user: {
		name: 'Admin',
		email: 'admin@company.com',
		avatar: '/avatars/admin.jpg',
	},
	teams: [
		{
			name: 'Next Developers Team',
			logo: LayoutDashboard,
			plan: 'Team Hub',
		},
	],
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: 'Products',
			url: '/dashboard/products',
			icon: Package,
			items: [
				{
					title: 'All Products',
					url: '/dashboard/products',
				},
			],
		},
		{
			title: 'Features',
			url: '/dashboard/features',
			icon: BarChart3,
		},
		{
			title: 'Testimonials',
			url: '/dashboard/testimonials',
			icon: MessageSquare,
		},
		{
			title: 'Technologies',
			url: '/dashboard/technologies',
			icon: Zap,
		},
		{
			title: 'Awards',
			url: '/dashboard/awards',
			icon: BarChart3,
		},
		{
			title: 'Team Members',
			url: '/dashboard/team',
			icon: Users,
		},
		{
			title: 'Contacts',
			url: '/dashboard/contacts',
			icon: FileText,
		},
		{
			title: 'Profile',
			url: '/dashboard/profile',
			icon: User,
		},
		{
			title: 'Attendance',
			url: '/dashboard/attendance',
			icon: Clock,
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: Settings,
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<NavUser />
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
