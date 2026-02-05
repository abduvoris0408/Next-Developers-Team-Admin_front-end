'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'

export function DashboardHeader() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<header className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 dark:border-slate-700 px-6 bg-white dark:bg-slate-900'>
			<SidebarTrigger className='-ml-1 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200' />
			<Separator
				orientation='vertical'
				className='h-4 bg-slate-200 dark:bg-slate-700'
			/>
			<div className='ml-auto flex items-center gap-2'>
				<ThemeToggle />
			</div>
		</header>
	)
}
