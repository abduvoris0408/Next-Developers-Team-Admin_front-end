'use client'

import { cn } from '@/lib/utils'
import { LoaderIcon } from 'lucide-react'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
	return (
		<LoaderIcon
			role='status'
			aria-label='Loading'
			className={cn('size-4 animate-spin', className)}
			{...props}
		/>
	)
}

export function SpinnerCustom() {
	return (
		<div className='flex items-center gap-4'>
			<Spinner />
		</div>
	)
}

export function SpinnerPage() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-white dark:bg-slate-950'>
			<div className='flex flex-col items-center gap-3'>
				<Spinner className='size-12 text-cyan-500' />
				<p className='text-slate-600 dark:text-slate-400 text-sm'>
					Loading...
				</p>
			</div>
		</div>
	)
}

export function SpinnerInline() {
	return (
		<div className='flex items-center justify-center p-8'>
			<Spinner className='size-8 text-cyan-500' />
		</div>
	)
}

export { Spinner }
