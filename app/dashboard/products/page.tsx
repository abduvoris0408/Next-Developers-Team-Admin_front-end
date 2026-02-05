'use client'

import { PaginationControl } from '@/components/pagination-control'
import { SpinnerInline } from '@/components/spinner-custom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	useCreateProduct,
	useDeleteProduct,
	useProducts,
	useUpdateProduct,
} from '@/lib/api-hooks'
import { Edit2, ImageIcon, Plus, Trash2, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function ProductsPage() {
	const [page, setPage] = useState(1)
	const { products, loading, refetch } = useProducts(page, 10)
	const { create } = useCreateProduct()
	const { update } = useUpdateProduct()
	const { delete_product } = useDeleteProduct()

	const [open, setOpen] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		shortDescription: '',
		fullDescription: '',
		category: 'web-app',
		price: 'custom',
		isFeatured: false,
		imageUrl: '',
	})
	const [imagePreview, setImagePreview] = useState<string>('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [creating, setCreating] = useState(false)
	const [updating, setUpdating] = useState(false)

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				setImagePreview(result)
				setFormData({ ...formData, imageUrl: result })
			}
			reader.readAsDataURL(file)
		}
	}

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setFormData({
				name: '',
				shortDescription: '',
				fullDescription: '',
				category: 'web-app',
				price: 'custom',
				isFeatured: false,
				imageUrl: '',
			})
			setImagePreview('')
			setEditingId(null)
		}
		setOpen(newOpen)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formData.name.trim()) {
			toast.error('Product name is required')
			return
		}

		setIsSubmitting(true)
		if (editingId) {
			setUpdating(true)
		} else {
			setCreating(true)
		}

		try {
			const submitData: any = {
				name: formData.name,
				shortDescription: formData.shortDescription,
				fullDescription: formData.fullDescription,
				category: formData.category,
				price: formData.price,
				isFeatured: formData.isFeatured,
			}

			if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
				submitData.mainImage = { url: formData.imageUrl }
			}

			if (editingId) {
				await update(editingId, submitData)
				toast.success('Product updated successfully')
			} else {
				await create(submitData)
				toast.success('Product created successfully')
			}

			handleOpenChange(false)
			refetch()
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save product',
			)
		} finally {
			setIsSubmitting(false)
			setCreating(false)
			setUpdating(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (confirm('Are you sure you want to delete this product?')) {
			try {
				await delete_product(id)
				toast.success('Product deleted successfully')
				refetch()
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: 'Failed to delete product',
				)
			}
		}
	}

	const handleEdit = (product: any) => {
		setFormData({
			name: product.name || '',
			shortDescription: product.shortDescription || '',
			fullDescription: product.fullDescription || '',
			category: product.category || 'web-app',
			price: product.price || 'custom',
			isFeatured: product.isFeatured || false,
			imageUrl: product.mainImage?.url || '',
		})
		setImagePreview(product.mainImage?.url || '')
		setEditingId(product._id)
		setOpen(true)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Products
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Manage your software products
					</p>
				</div>
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogTrigger asChild>
						<Button className='gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'>
							<Plus className='w-4 h-4' />
							Add Product
						</Button>
					</DialogTrigger>
					<DialogContent className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle className='text-slate-900 dark:text-white'>
								{editingId ? 'Edit Product' : 'Add New Product'}
							</DialogTitle>
						</DialogHeader>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<Label className='text-slate-700 dark:text-slate-300 block mb-2'>
									Product Image
								</Label>
								<div className='flex items-center gap-4'>
									{imagePreview ? (
										<div className='w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden'>
											<img
												src={
													imagePreview ||
													'/placeholder.svg'
												}
												alt='Preview'
												className='w-full h-full object-cover'
											/>
										</div>
									) : (
										<div className='w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center'>
											<ImageIcon className='w-8 h-8 text-slate-400' />
										</div>
									)}
									<label className='cursor-pointer'>
										<input
											type='file'
											accept='image/*'
											onChange={handleImageChange}
											className='hidden'
										/>
										<span className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border dark:border-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 h-9 px-4 py-2 cursor-pointer'>
											<Upload className='w-4 h-4 mr-2' />
											Upload Image
										</span>
									</label>
								</div>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Product Name *
								</Label>
								<Input
									value={formData.name}
									onChange={e =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									placeholder='Enter product name'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									required
								/>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Short Description *
								</Label>
								<Textarea
									value={formData.shortDescription}
									onChange={e =>
										setFormData({
											...formData,
											shortDescription: e.target.value,
										})
									}
									placeholder='Brief description'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									required
								/>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Full Description *
								</Label>
								<Textarea
									value={formData.fullDescription}
									onChange={e =>
										setFormData({
											...formData,
											fullDescription: e.target.value,
										})
									}
									placeholder='Full description'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									required
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Category
									</Label>
									<select
										value={formData.category}
										onChange={e =>
											setFormData({
												...formData,
												category: e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-md'
									>
										<option>web-app</option>
										<option>mobile-app</option>
										<option>desktop-app</option>
										<option>ai-ml</option>
										<option>blockchain</option>
										<option>iot</option>
									</select>
								</div>

								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Price
									</Label>
									<select
										value={formData.price}
										onChange={e =>
											setFormData({
												...formData,
												price: e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-md'
									>
										<option>free</option>
										<option>paid</option>
										<option>custom</option>
									</select>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<input
									type='checkbox'
									id='featured'
									checked={formData.isFeatured}
									onChange={e =>
										setFormData({
											...formData,
											isFeatured: e.target.checked,
										})
									}
									className='w-4 h-4 cursor-pointer'
								/>
								<Label
									htmlFor='featured'
									className='text-slate-700 dark:text-slate-300 cursor-pointer'
								>
									Featured Product
								</Label>
							</div>

							<div className='flex gap-2 pt-4'>
								<Button
									type='submit'
									disabled={isSubmitting}
									className='flex-1 bg-cyan-500 hover:bg-cyan-600 text-white'
								>
									{isSubmitting
										? 'Saving...'
										: 'Save Product'}
								</Button>
								<Button
									type='button'
									variant='outline'
									onClick={() => handleOpenChange(false)}
									className='flex-1 dark:border-slate-600 dark:text-slate-300'
								>
									Cancel
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
				<CardContent className='p-0'>
					{loading ? (
						<SpinnerInline />
					) : products.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Image
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Name
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Category
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Featured
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300 text-right'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map(product => (
										<TableRow
											key={product._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell>
												{product.mainImage?.url ? (
													<img
														src={
															product.mainImage
																.url ||
															'/placeholder.svg'
														}
														alt={product.name}
														className='w-10 h-10 rounded object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center'>
														<ImageIcon className='w-5 h-5 text-slate-400' />
													</div>
												)}
											</TableCell>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{product.name}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400 capitalize'>
												{product.category}
											</TableCell>
											<TableCell>
												{product.isFeatured ? (
													<span className='text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded font-medium'>
														Yes
													</span>
												) : (
													<span className='text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded'>
														No
													</span>
												)}
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex gap-2 justify-end'>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Button
																	size='sm'
																	variant='ghost'
																	onClick={() =>
																		handleEdit(
																			product,
																		)
																	}
																	className='text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-slate-700'
																>
																	<Edit2 className='w-4 h-4' />
																</Button>
															</TooltipTrigger>
															<TooltipContent className='bg-slate-900 dark:bg-slate-700 text-white border-slate-700'>
																Edit
															</TooltipContent>
														</Tooltip>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Button
																	size='sm'
																	variant='ghost'
																	onClick={() =>
																		handleDelete(
																			product._id,
																		)
																	}
																	className='text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-slate-700'
																>
																	<Trash2 className='w-4 h-4' />
																</Button>
															</TooltipTrigger>
															<TooltipContent className='bg-slate-900 dark:bg-slate-700 text-white border-slate-700'>
																Delete
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<PaginationControl
								currentPage={page}
								hasNextPage={products.length === 10}
								onPageChange={setPage}
								itemCount={products.length}
								pageSize={10}
							/>
						</div>
					) : (
						<div className='flex items-center justify-center p-8'>
							<p className='text-slate-600 dark:text-slate-400'>
								No products found. Create one to get started!
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
