'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
	useFeatures,
	useProducts,
	useTeamMembers,
	useTestimonials,
} from '@/lib/api-hooks'
import { BarChart3, MessageSquare, Users, Zap } from 'lucide-react'

export default function DashboardPage() {
	const { products, loading: productsLoading } = useProducts(1, 5)
	const { members, loading: membersLoading } = useTeamMembers(1, 5)
	const { features, loading: featuresLoading } = useFeatures()
	const { testimonials, loading: testimonialsLoading } = useTestimonials(1, 5)

	const StatCard = ({ icon: Icon, label, value, loading }: any) => (
		<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
			<CardContent className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-slate-600 dark:text-slate-400'>
							{label}
						</p>
						{loading ? (
							<Skeleton className='h-8 w-20 mt-2' />
						) : (
							<p className='text-3xl font-bold text-slate-900 dark:text-white mt-2'>
								{value}
							</p>
						)}
					</div>
					<div className='p-3 bg-slate-100 dark:bg-slate-700 rounded-lg'>
						<Icon className='w-6 h-6 text-cyan-500 dark:text-cyan-400' />
					</div>
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
					Dashboard
				</h1>
				<p className='text-slate-600 dark:text-slate-400 mt-2'>
					Welcome back! Here's your overview.
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<StatCard
					icon={BarChart3}
					label='Total Products'
					value={products.length}
					loading={productsLoading}
				/>
				<StatCard
					icon={Users}
					label='Team Members'
					value={members.length}
					loading={membersLoading}
				/>
				<StatCard
					icon={Zap}
					label='Total Features'
					value={features.length}
					loading={featuresLoading}
				/>
				<StatCard
					icon={MessageSquare}
					label='Testimonials'
					value={testimonials.length}
					loading={testimonialsLoading}
				/>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Recent Products */}
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardHeader>
						<CardTitle className='text-slate-900 dark:text-white'>
							Recent Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{productsLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<Skeleton key={i} className='h-12 w-full' />
								))
							) : products.length > 0 ? (
								products.slice(0, 3).map(product => (
									<div
										key={product._id}
										className='flex items-start justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg'
									>
										<div className='flex-1'>
											<p className='font-medium text-slate-900 dark:text-white'>
												{product.name}
											</p>
											<p className='text-sm text-slate-600 dark:text-slate-400'>
												{product.category}
											</p>
										</div>
										<span className='text-xs bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 px-2 py-1 rounded'>
											{product.status}
										</span>
									</div>
								))
							) : (
								<p className='text-slate-600 dark:text-slate-400 text-center py-8'>
									No products yet
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Team Overview */}
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardHeader>
						<CardTitle className='text-slate-900 dark:text-white'>
							Team Members
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{membersLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<Skeleton key={i} className='h-12 w-full' />
								))
							) : members.length > 0 ? (
								members.slice(0, 3).map(member => (
									<div
										key={member._id}
										className='flex items-start justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg'
									>
										<div className='flex-1'>
											<p className='font-medium text-slate-900 dark:text-white'>
												{member.name}
											</p>
											<p className='text-sm text-slate-600 dark:text-slate-400'>
												{member.position}
											</p>
										</div>
										<span className='text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded capitalize'>
											{member.department}
										</span>
									</div>
								))
							) : (
								<p className='text-slate-600 dark:text-slate-400 text-center py-8'>
									No team members yet
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
