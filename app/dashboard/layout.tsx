'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SpinnerPage } from '@/components/spinner-custom'
import { ThemeToggle } from '@/components/theme-toggle'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

// Map routes to breadcrumb titles
const routeTitles: Record<string, string> = {
	'/dashboard': 'Dashboard',
	'/dashboard/products': 'Products',
	'/dashboard/team': 'Team Members',
	'/dashboard/technologies': 'Technologies',
	'/dashboard/features': 'Features',
	'/dashboard/testimonials': 'Testimonials',
	'/dashboard/contacts': 'Contacts',
	'/dashboard/awards': 'Awards',
	'/dashboard/attendance': 'Attendance',
	'/dashboard/settings': 'Settings',
	'/dashboard/profile': 'Profile',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()
	const { loading, token } = useAuth()

	useEffect(() => {
		if (!loading && !token) {
			router.push('/login')
		}
	}, [loading, token, router])

	if (loading) {
		return <SpinnerPage />
	}

	if (!token) {
		return null
	}

	const pageTitle = routeTitles[pathname] || 'Dashboard'

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator
							orientation='vertical'
							className='mr-2 h-4'
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className='text-slate-900 dark:text-white font-medium'>
										{pageTitle}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className='flex items-center gap-2 px-4'>
						<ThemeToggle />
					</div>
				</header>
				<main className='flex-1 p-6 bg-white dark:bg-slate-950 min-h-screen'>
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	)
}
