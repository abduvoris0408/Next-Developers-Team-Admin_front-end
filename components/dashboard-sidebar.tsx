'use client'

import { DashboardUserMenu } from '@/components/dashboard-user-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import {
	Award,
	Box,
	Clock,
	FileText,
	Home,
	MessageSquare,
	Settings,
	User,
	Users,
	Zap,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function DashboardSidebar() {
	const router = useRouter()
	const pathname = usePathname()
	const { state } = useSidebar()

	const mainMenuItems = [
		{
			title: 'Dashboard',
			icon: Home,
			href: '/dashboard',
		},
	]

	const contentMenuItems = [
		{
			title: 'Products',
			icon: Box,
			href: '/dashboard/products',
		},
		{
			title: 'Team Members',
			icon: Users,
			href: '/dashboard/team',
		},
		{
			title: 'Technologies',
			icon: Zap,
			href: '/dashboard/technologies',
		},
		{
			title: 'Features',
			icon: FileText,
			href: '/dashboard/features',
		},
		{
			title: 'Testimonials',
			icon: MessageSquare,
			href: '/dashboard/testimonials',
		},
		{
			title: 'Awards',
			icon: Award,
			href: '/dashboard/awards',
		},
		{
			title: 'Contacts',
			icon: FileText,
			href: '/dashboard/contacts',
		},
		{
			title: 'Attendance',
			icon: Clock,
			href: '/dashboard/attendance',
		},
	]

	const settingsMenuItems = [
		{
			title: 'Profile',
			icon: User,
			href: '/dashboard/profile',
		},
		{
			title: 'Settings',
			icon: Settings,
			href: '/dashboard/settings',
		},
	]

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(href + '/')

	return (
		<Sidebar className='border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
			<SidebarHeader className='border-b border-slate-200 dark:border-slate-700 pb-4 bg-white dark:bg-slate-900'>
				<div className='flex items-center gap-3 px-2'>
					<div className='w-10 h-10 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30'>
						<span className='text-white font-bold text-sm'>ND</span>
					</div>
					{state === 'expanded' && (
						<div>
							<span className='font-bold text-sm text-white block'>
								Next Developers Team
							</span>
							<span className='text-xs text-slate-400'>
								Enterprise
							</span>
						</div>
					)}
				</div>
			</SidebarHeader>

			<SidebarContent className='flex flex-col justify-between bg-white dark:bg-slate-900'>
				<div className='space-y-4'>
					<SidebarGroup>
						{state === 'expanded' && (
							<SidebarGroupLabel className='text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider px-2 mb-2'>
								Platform
							</SidebarGroupLabel>
						)}
						<SidebarGroupContent>
							<SidebarMenu>
								{mainMenuItems.map(item => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											onClick={() =>
												router.push(item.href)
											}
											isActive={isActive(item.href)}
											className={`cursor-pointer rounded-md transition-all my-1 ${
												isActive(item.href)
													? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
													: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
											}`}
										>
											<item.icon className='w-4 h-4' />
											{state === 'expanded' && (
												<span>{item.title}</span>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarGroup>
						{state === 'expanded' && (
							<SidebarGroupLabel className='text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider px-2 mb-2'>
								Content Management
							</SidebarGroupLabel>
						)}
						<SidebarGroupContent>
							<SidebarMenu>
								{contentMenuItems.map(item => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											onClick={() =>
												router.push(item.href)
											}
											isActive={isActive(item.href)}
											className={`cursor-pointer rounded-md transition-all my-1 ${
												isActive(item.href)
													? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
													: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
											}`}
										>
											<item.icon className='w-4 h-4' />
											{state === 'expanded' && (
												<span>{item.title}</span>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarGroup>
						{state === 'expanded' && (
							<SidebarGroupLabel className='text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider px-2 mb-2'>
								System
							</SidebarGroupLabel>
						)}
						<SidebarGroupContent>
							<SidebarMenu>
								{settingsMenuItems.map(item => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											onClick={() =>
												router.push(item.href)
											}
											isActive={isActive(item.href)}
											className={`cursor-pointer rounded-md transition-all my-1 ${
												isActive(item.href)
													? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
													: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
											}`}
										>
											<item.icon className='w-4 h-4' />
											{state === 'expanded' && (
												<span>{item.title}</span>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</div>
			</SidebarContent>

			<SidebarFooter className='border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'>
				<DashboardUserMenu />
			</SidebarFooter>
		</Sidebar>
	)
}
