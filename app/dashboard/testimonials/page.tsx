'use client'

import { PaginationControl } from '@/components/pagination-control'
import { SpinnerInline } from '@/components/spinner-custom'
import { Card, CardContent } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useTestimonials } from '@/lib/api-hooks'
import { Star, User } from 'lucide-react'
import { useState } from 'react'

export default function TestimonialsPage() {
	const [page, setPage] = useState(1)
	const { testimonials, loading } = useTestimonials(page, 10)

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }).map((_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < rating
						? 'fill-yellow-400 text-yellow-400'
						: 'text-slate-300 dark:text-slate-600'
				}`}
			/>
		))
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
					Testimonials
				</h1>
				<p className='text-slate-600 dark:text-slate-400 mt-2'>
					View customer testimonials
				</p>
			</div>

			<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
				<CardContent className='p-0'>
					{loading ? (
						<SpinnerInline />
					) : testimonials.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Client
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Company
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Position
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Rating
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Testimonial
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Status
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{testimonials.map(testimonial => (
										<TableRow
											key={testimonial._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell>
												<div className='flex items-center gap-2'>
													{testimonial.clientAvatar
														?.url ? (
														<img
															src={
																testimonial
																	.clientAvatar
																	.url ||
																'/placeholder.svg'
															}
															alt={
																testimonial.clientName
															}
															className='w-8 h-8 rounded-full object-cover'
														/>
													) : (
														<div className='w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center'>
															<User className='w-4 h-4 text-slate-400' />
														</div>
													)}
													<span className='text-slate-900 dark:text-white font-medium'>
														{testimonial.clientName}
													</span>
												</div>
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{testimonial.clientCompany}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{testimonial.clientPosition}
											</TableCell>
											<TableCell>
												<div className='flex gap-1'>
													{renderStars(
														testimonial.rating,
													)}
												</div>
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400 max-w-sm truncate'>
												{testimonial.testimonial}
											</TableCell>
											<TableCell>
												<span
													className={`text-xs px-2 py-1 rounded ${
														testimonial.isFeatured
															? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400'
															: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
													}`}
												>
													{testimonial.isFeatured
														? 'Featured'
														: 'Regular'}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<PaginationControl
								currentPage={page}
								hasNextPage={testimonials.length === 10}
								onPageChange={setPage}
								itemCount={testimonials.length}
								pageSize={10}
							/>
						</div>
					) : (
						<div className='flex items-center justify-center p-8'>
							<p className='text-slate-600 dark:text-slate-400'>
								No testimonials found
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
