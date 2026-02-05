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
	useCreateTechnology,
	useDeleteTechnology,
	useTechnologies,
	useUpdateTechnology,
} from '@/lib/api-hooks'
import { Edit2, Plus, Trash2, Upload, Zap } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TechnologiesPage() {
	const { technologies, loading, refetch } = useTechnologies()
	const { create } = useCreateTechnology()
	const { update } = useUpdateTechnology()
	const { delete_technology } = useDeleteTechnology()

	const [open, setOpen] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [iconPreview, setIconPreview] = useState<string>('')
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		category: 'frontend',
		type: 'library',
		proficiencyLevel: 'expert',
		yearsOfExperience: 1,
		color: '#0ea5e9',
		iconUrl: '',
		isFeatured: false,
	})

	const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				setIconPreview(result)
				setFormData({ ...formData, iconUrl: result })
			}
			reader.readAsDataURL(file)
		}
	}

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setFormData({
				name: '',
				description: '',
				category: 'frontend',
				type: 'library',
				proficiencyLevel: 'expert',
				yearsOfExperience: 1,
				color: '#0ea5e9',
				iconUrl: '',
				isFeatured: false,
			})
			setIconPreview('')
			setEditingId(null)
		}
		setOpen(newOpen)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formData.name.trim()) {
			toast.error('Technology name is required')
			return
		}

		setIsSubmitting(true)
		try {
			const submitData: any = {
				name: formData.name,
				description: formData.description,
				category: formData.category,
				type: formData.type,
				proficiencyLevel: formData.proficiencyLevel,
				yearsOfExperience: formData.yearsOfExperience,
				color: formData.color,
				isFeatured: formData.isFeatured,
			}

			if (formData.iconUrl && formData.iconUrl.startsWith('data:')) {
				submitData.icon = { url: formData.iconUrl }
			}

			if (editingId) {
				await update(editingId, submitData)
				toast.success('Technology updated successfully')
			} else {
				await create(submitData)
				toast.success('Technology created successfully')
			}

			handleOpenChange(false)
			refetch?.()
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save technology',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (confirm('Are you sure?')) {
			try {
				await delete_technology(id)
				toast.success('Technology deleted successfully')
				refetch?.()
			} catch (error) {
				toast.error('Failed to delete technology')
			}
		}
	}

	const handleEdit = (tech: any) => {
		setFormData({
			name: tech.name || '',
			description: tech.description || '',
			category: tech.category || 'frontend',
			type: tech.type || 'library',
			proficiencyLevel: tech.proficiencyLevel || 'expert',
			yearsOfExperience: tech.yearsOfExperience || 1,
			color: tech.color || '#0ea5e9',
			iconUrl: tech.icon?.url || '',
			isFeatured: tech.isFeatured || false,
		})
		setIconPreview(tech.icon?.url || '')
		setEditingId(tech._id)
		setOpen(true)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Technologies
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Manage technology stack
					</p>
				</div>
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogTrigger asChild>
						<Button className='gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'>
							<Plus className='w-4 h-4' />
							Add Technology
						</Button>
					</DialogTrigger>
					<DialogContent className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle className='text-slate-900 dark:text-white'>
								{editingId
									? 'Edit Technology'
									: 'Add New Technology'}
							</DialogTitle>
						</DialogHeader>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<Label className='text-slate-700 dark:text-slate-300 block mb-2'>
									Icon
								</Label>
								<div className='flex items-center gap-4'>
									{iconPreview ? (
										<div className='w-16 h-16 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden'>
											<img
												src={
													iconPreview ||
													'/placeholder.svg'
												}
												alt='Icon'
												className='w-full h-full object-cover'
											/>
										</div>
									) : (
										<div className='w-16 h-16 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center'>
											<Zap className='w-8 h-8 text-slate-400' />
										</div>
									)}
									<label className='cursor-pointer'>
										<input
											type='file'
											accept='image/*'
											onChange={handleIconChange}
											className='hidden'
										/>
										<span className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border dark:border-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 h-9 px-4 py-2 cursor-pointer'>
											<Upload className='w-4 h-4 mr-2' />
											Upload Icon
										</span>
									</label>
								</div>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Name *
								</Label>
								<Input
									value={formData.name}
									onChange={e =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									placeholder='e.g., React.js'
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
										<option>frontend</option>
										<option>backend</option>
										<option>database</option>
										<option>mobile</option>
										<option>devops</option>
									</select>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Type
									</Label>
									<select
										value={formData.type}
										onChange={e =>
											setFormData({
												...formData,
												type: e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-md'
									>
										<option>framework</option>
										<option>library</option>
										<option>tool</option>
										<option>platform</option>
									</select>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Proficiency
									</Label>
									<select
										value={formData.proficiencyLevel}
										onChange={e =>
											setFormData({
												...formData,
												proficiencyLevel:
													e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-md'
									>
										<option>beginner</option>
										<option>intermediate</option>
										<option>advanced</option>
										<option>expert</option>
									</select>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Years of Experience
									</Label>
									<Input
										type='number'
										value={formData.yearsOfExperience}
										onChange={e =>
											setFormData({
												...formData,
												yearsOfExperience: parseInt(
													e.target.value,
												),
											})
										}
										min='0'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white'
									/>
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
									Featured Technology
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
										: 'Save Technology'}
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
					) : technologies.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Icon
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Name
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Category
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Type
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Proficiency
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300 text-right'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{technologies.map(tech => (
										<TableRow
											key={tech._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell>
												{tech.icon?.url ? (
													<img
														src={
															tech.icon.url ||
															'/placeholder.svg'
														}
														alt={tech.name}
														className='w-8 h-8 rounded'
													/>
												) : (
													<Zap className='w-5 h-5 text-slate-400' />
												)}
											</TableCell>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{tech.name}
											</TableCell>
											<TableCell>
												<span className='text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-400 px-2 py-1 rounded capitalize'>
													{tech.category}
												</span>
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400 capitalize'>
												{tech.type}
											</TableCell>
											<TableCell>
												<span className='text-xs bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 px-2 py-1 rounded capitalize'>
													{tech.proficiencyLevel}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex gap-2 justify-end'>
													<Button
														size='sm'
														variant='ghost'
														onClick={() =>
															handleEdit(tech)
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
																tech._id,
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
								No technologies found
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
