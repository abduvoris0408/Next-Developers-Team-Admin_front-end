'use client'

import React from 'react'

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
	useCreateFeature,
	useDeleteFeature,
	useFeatures,
	useUpdateFeature,
} from '@/lib/api-hooks'
import { Edit2, Plus, Trash2, Upload, Zap } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FeaturesPage() {
	const { features, loading, refetch } = useFeatures()
	const { create } = useCreateFeature()
	const { update } = useUpdateFeature()
	const { delete_feature } = useDeleteFeature()

	const [open, setOpen] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [imagePreview, setImagePreview] = useState<string>('')
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		icon: 'fas fa-code',
		benefits: '',
		category: 'development',
		imageUrl: '',
		isActive: true,
	})

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
				title: '',
				description: '',
				icon: 'fas fa-code',
				benefits: '',
				category: 'development',
				imageUrl: '',
				isActive: true,
			})
			setImagePreview('')
			setEditingId(null)
		}
		setOpen(newOpen)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formData.title.trim()) {
			toast.error('Feature title is required')
			return
		}

		setIsSubmitting(true)
		try {
			const submitData: any = {
				title: formData.title,
				description: formData.description,
				icon: formData.icon,
				benefits: formData.benefits.split('\n').filter(b => b.trim()),
				category: formData.category,
				isActive: formData.isActive,
			}

			if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
				submitData.image = { url: formData.imageUrl }
			}

			if (editingId) {
				await update(editingId, submitData)
				toast.success('Feature updated successfully')
			} else {
				await create(submitData)
				toast.success('Feature created successfully')
			}

			handleOpenChange(false)
			refetch?.()
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save feature',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (confirm('Are you sure?')) {
			try {
				await delete_feature(id)
				toast.success('Feature deleted successfully')
				refetch?.()
			} catch (error) {
				toast.error('Failed to delete feature')
			}
		}
	}

	const handleEdit = (feature: any) => {
		setFormData({
			title: feature.title || '',
			description: feature.description || '',
			icon: feature.icon || 'fas fa-code',
			benefits: Array.isArray(feature.benefits)
				? feature.benefits.join('\n')
				: '',
			category: feature.category || 'development',
			imageUrl: feature.image?.url || '',
			isActive: feature.isActive !== false,
		})
		setImagePreview(feature.image?.url || '')
		setEditingId(feature._id)
		setOpen(true)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Features
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Manage service features
					</p>
				</div>
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogTrigger asChild>
						<Button className='gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'>
							<Plus className='w-4 h-4' />
							Add Feature
						</Button>
					</DialogTrigger>
					<DialogContent className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle className='text-slate-900 dark:text-white'>
								{editingId ? 'Edit Feature' : 'Add New Feature'}
							</DialogTitle>
						</DialogHeader>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<Label className='text-slate-700 dark:text-slate-300 block mb-2'>
									Image
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
											<Zap className='w-8 h-8 text-slate-400' />
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
									Title *
								</Label>
								<Input
									value={formData.title}
									onChange={e =>
										setFormData({
											...formData,
											title: e.target.value,
										})
									}
									placeholder='Enter feature title'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									required
								/>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Description
								</Label>
								<Textarea
									value={formData.description}
									onChange={e =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									placeholder='Enter description'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
								/>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Benefits (one per line)
								</Label>
								<Textarea
									value={formData.benefits}
									onChange={e =>
										setFormData({
											...formData,
											benefits: e.target.value,
										})
									}
									placeholder='Enter benefits, one per line'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									rows={4}
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Icon Class
									</Label>
									<Input
										value={formData.icon}
										onChange={e =>
											setFormData({
												...formData,
												icon: e.target.value,
											})
										}
										placeholder='fas fa-code'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									/>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Category
									</Label>
									<Input
										value={formData.category}
										onChange={e =>
											setFormData({
												...formData,
												category: e.target.value,
											})
										}
										placeholder='development'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									/>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<input
									type='checkbox'
									id='active'
									checked={formData.isActive}
									onChange={e =>
										setFormData({
											...formData,
											isActive: e.target.checked,
										})
									}
									className='w-4 h-4 cursor-pointer'
								/>
								<Label
									htmlFor='active'
									className='text-slate-700 dark:text-slate-300 cursor-pointer'
								>
									Active
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
										: 'Save Feature'}
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
					) : features.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Title
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Category
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Benefits Count
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Status
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300 text-right'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{features.map(feature => (
										<TableRow
											key={feature._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{feature.title}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400 capitalize'>
												{feature.category}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{feature.benefits?.length || 0}
											</TableCell>
											<TableCell>
												<span
													className={`text-xs px-2 py-1 rounded ${
														feature.isActive
															? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400'
															: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
													}`}
												>
													{feature.isActive
														? 'Active'
														: 'Inactive'}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex gap-2 justify-end'>
													<Button
														size='sm'
														variant='ghost'
														onClick={() =>
															handleEdit(feature)
														}
														className='text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-slate-700'
													>
														<Edit2 className='w-4 h-4' />
													</Button>
													<Button
														size='sm'
														variant='ghost'
														onClick={() =>
															handleDelete(
																feature._id,
															)
														}
														className='text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-slate-700'
													>
														<Trash2 className='w-4 h-4' />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className='flex items-center justify-center p-8'>
							<p className='text-slate-600 dark:text-slate-400'>
								No features found
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
