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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
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
	useAwards,
	useCreateAward,
	useDeleteAward,
	useUpdateAward,
} from '@/lib/api-hooks'
import { Edit2, Plus, Trash2, Trophy, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// Valid award categories - add more as needed based on your backend enum
const AWARD_CATEGORIES = [
	'Innovation',
	'Excellence',
	'Achievement',
	'Technical',
	'Design',
	'Service',
	'Other',
]

export default function AwardsPage() {
	const { awards, loading, refetch } = useAwards()
	const { create } = useCreateAward()
	const { update } = useUpdateAward()
	const { delete_award } = useDeleteAward()

	const [open, setOpen] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [imagePreview, setImagePreview] = useState<string>('')
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		organization: '',
		year: new Date().getFullYear(),
		category: '',
		imageUrl: '',
		isFeatured: false,
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
				organization: '',
				year: new Date().getFullYear(),
				category: '',
				imageUrl: '',
				isFeatured: false,
			})
			setImagePreview('')
			setEditingId(null)
		}
		setOpen(newOpen)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formData.title.trim()) {
			toast.error('Award title is required')
			return
		}

		setIsSubmitting(true)
		try {
			const submitData: any = {
				title: formData.title,
				description: formData.description,
				organization: formData.organization,
				year: formData.year,
				category: formData.category,
				isFeatured: formData.isFeatured,
			}

			if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
				submitData.image = { url: formData.imageUrl }
			}

			if (editingId) {
				await update(editingId, submitData)
				toast.success('Award updated successfully')
			} else {
				await create(submitData)
				toast.success('Award created successfully')
			}

			handleOpenChange(false)
			refetch?.()
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Failed to save award',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (confirm('Are you sure?')) {
			try {
				await delete_award(id)
				toast.success('Award deleted successfully')
				refetch?.()
			} catch (error) {
				toast.error('Failed to delete award')
			}
		}
	}

	const handleEdit = (award: any) => {
		setFormData({
			title: award.title || '',
			description: award.description || '',
			organization: award.organization || '',
			year: award.year || new Date().getFullYear(),
			category: award.category || '',
			imageUrl: award.image?.url || '',
			isFeatured: award.isFeatured || false,
		})
		setImagePreview(award.image?.url || '')
		setEditingId(award._id)
		setOpen(true)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Awards
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Manage awards and achievements
					</p>
				</div>
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogTrigger asChild>
						<Button className='gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'>
							<Plus className='w-4 h-4' />
							Add Award
						</Button>
					</DialogTrigger>
					<DialogContent className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle className='text-slate-900 dark:text-white'>
								{editingId ? 'Edit Award' : 'Add New Award'}
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
											<Trophy className='w-8 h-8 text-slate-400' />
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
									placeholder='Enter award title'
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

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Organization
									</Label>
									<Input
										value={formData.organization}
										onChange={e =>
											setFormData({
												...formData,
												organization: e.target.value,
											})
										}
										placeholder='Enter organization'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									/>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Year
									</Label>
									<Input
										type='number'
										value={formData.year}
										onChange={e =>
											setFormData({
												...formData,
												year: parseInt(e.target.value),
											})
										}
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white'
									/>
								</div>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Category *
								</Label>
								<Select
									value={formData.category}
									onValueChange={value =>
										setFormData({
											...formData,
											category: value,
										})
									}
								>
									<SelectTrigger className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white'>
										<SelectValue placeholder='Select a category' />
									</SelectTrigger>
									<SelectContent className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600'>
										{AWARD_CATEGORIES.map(cat => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
									Featured Award
								</Label>
							</div>

							<div className='flex gap-2 pt-4'>
								<Button
									type='submit'
									disabled={isSubmitting}
									className='flex-1 bg-cyan-500 hover:bg-cyan-600 text-white'
								>
									{isSubmitting ? 'Saving...' : 'Save Award'}
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
					) : awards.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Image
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Title
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Organization
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Category
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Year
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
									{awards.map(award => (
										<TableRow
											key={award._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell>
												{award.image?.url ? (
													<img
														src={
															award.image.url ||
															'/placeholder.svg'
														}
														alt={award.title}
														className='w-10 h-10 rounded object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center'>
														<Trophy className='w-5 h-5 text-slate-400' />
													</div>
												)}
											</TableCell>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{award.title}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{award.organization}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{award.category}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{award.year}
											</TableCell>
											<TableCell>
												{award.isFeatured ? (
													<span className='text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded font-medium'>
														Yes
													</span>
												) : (
													<span className='text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded'>
														No
													</span>
												)}
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex gap-2 justify-end'>
													<Button
														size='sm'
														variant='ghost'
														onClick={() =>
															handleEdit(award)
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
																award._id,
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
								No awards found
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
