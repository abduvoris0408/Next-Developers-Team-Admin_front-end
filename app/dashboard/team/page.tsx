'use client'

import React from 'react'

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
	useCreateTeamMember,
	useDeleteTeamMember,
	useTeamMembers,
	useUpdateTeamMember,
} from '@/lib/api-hooks'
import { Edit2, Plus, Trash2, Upload, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TeamPage() {
	const [page, setPage] = useState(1)
	const { members, loading, refetch } = useTeamMembers(page, 10)
	const { create } = useCreateTeamMember()
	const { update } = useUpdateTeamMember()
	const { delete_member } = useDeleteTeamMember()

	const [open, setOpen] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [avatarPreview, setAvatarPreview] = useState<string>('')
	const [formData, setFormData] = useState({
		name: '',
		position: '',
		bio: '',
		email: '',
		phone: '',
		department: 'frontend',
		experience: 0,
		avatarUrl: '',
		isFeatured: false,
	})

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				setAvatarPreview(result)
				setFormData({ ...formData, avatarUrl: result })
			}
			reader.readAsDataURL(file)
		}
	}

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setFormData({
				name: '',
				position: '',
				bio: '',
				email: '',
				phone: '',
				department: 'frontend',
				experience: 0,
				avatarUrl: '',
				isFeatured: false,
			})
			setAvatarPreview('')
			setEditingId(null)
		}
		setOpen(newOpen)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formData.name.trim()) {
			toast.error('Name is required')
			return
		}

		setIsSubmitting(true)
		try {
			const submitData: any = {
				name: formData.name,
				position: formData.position,
				bio: formData.bio,
				email: formData.email,
				phone: formData.phone,
				department: formData.department,
				experience: formData.experience,
				isFeatured: formData.isFeatured,
			}

			if (formData.avatarUrl && formData.avatarUrl.startsWith('data:')) {
				submitData.avatar = { url: formData.avatarUrl }
			}

			if (editingId) {
				await update(editingId, submitData)
				toast.success('Team member updated successfully')
			} else {
				await create(submitData)
				toast.success('Team member created successfully')
			}

			handleOpenChange(false)
			refetch?.()
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save team member',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (confirm('Are you sure you want to delete this team member?')) {
			try {
				await delete_member(id)
				toast.success('Team member deleted successfully')
				refetch?.()
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: 'Failed to delete team member',
				)
			}
		}
	}

	const handleEdit = (member: any) => {
		setFormData({
			name: member.name || '',
			position: member.position || '',
			bio: member.bio || '',
			email: member.email || '',
			phone: member.phone || '',
			department: member.department || 'frontend',
			experience: member.experience || 0,
			avatarUrl: member.avatar?.url || '',
			isFeatured: member.isFeatured || false,
		})
		setAvatarPreview(member.avatar?.url || '')
		setEditingId(member._id)
		setOpen(true)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Team Members
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Manage your team members
					</p>
				</div>
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogTrigger asChild>
						<Button className='gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'>
							<Plus className='w-4 h-4' />
							Add Member
						</Button>
					</DialogTrigger>
					<DialogContent className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle className='text-slate-900 dark:text-white'>
								{editingId
									? 'Edit Team Member'
									: 'Add New Team Member'}
							</DialogTitle>
						</DialogHeader>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<Label className='text-slate-700 dark:text-slate-300 block mb-2'>
									Avatar
								</Label>
								<div className='flex items-center gap-4'>
									{avatarPreview ? (
										<div className='w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden'>
											<img
												src={
													avatarPreview ||
													'/placeholder.svg'
												}
												alt='Preview'
												className='w-full h-full object-cover'
											/>
										</div>
									) : (
										<div className='w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center'>
											<User className='w-8 h-8 text-slate-400' />
										</div>
									)}
									<label className='cursor-pointer'>
										<input
											type='file'
											accept='image/*'
											onChange={handleAvatarChange}
											className='hidden'
										/>
										<span className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border dark:border-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 h-9 px-4 py-2 cursor-pointer'>
											<Upload className='w-4 h-4 mr-2' />
											Upload Avatar
										</span>
									</label>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
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
										placeholder='Enter name'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
										required
									/>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Position *
									</Label>
									<Input
										value={formData.position}
										onChange={e =>
											setFormData({
												...formData,
												position: e.target.value,
											})
										}
										placeholder='Enter position'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
										required
									/>
								</div>
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300'>
									Bio
								</Label>
								<Textarea
									value={formData.bio}
									onChange={e =>
										setFormData({
											...formData,
											bio: e.target.value,
										})
									}
									placeholder='Enter bio'
									className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Email
									</Label>
									<Input
										type='email'
										value={formData.email}
										onChange={e =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
										placeholder='Enter email'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									/>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Phone
									</Label>
									<Input
										value={formData.phone}
										onChange={e =>
											setFormData({
												...formData,
												phone: e.target.value,
											})
										}
										placeholder='Enter phone'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Department
									</Label>
									<select
										value={formData.department}
										onChange={e =>
											setFormData({
												...formData,
												department: e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-md'
									>
										<option>frontend</option>
										<option>backend</option>
										<option>fullstack</option>
										<option>mobile</option>
										<option>devops</option>
										<option>design</option>
										<option>qa</option>
									</select>
								</div>
								<div>
									<Label className='text-slate-700 dark:text-slate-300'>
										Experience (years)
									</Label>
									<Input
										type='number'
										value={formData.experience}
										onChange={e =>
											setFormData({
												...formData,
												experience: parseInt(
													e.target.value,
												),
											})
										}
										placeholder='Enter years'
										className='bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white dark:placeholder:text-slate-500'
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
									Featured Member
								</Label>
							</div>

							<div className='flex gap-2 pt-4'>
								<Button
									type='submit'
									disabled={isSubmitting}
									className='flex-1 bg-cyan-500 hover:bg-cyan-600 text-white'
								>
									{isSubmitting ? 'Saving...' : 'Save Member'}
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
					) : members.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Avatar
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Name
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Position
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Department
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Experience
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300 text-right'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{members.map(member => (
										<TableRow
											key={member._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell>
												{member.avatar?.url ? (
													<img
														src={
															member.avatar.url ||
															'/placeholder.svg'
														}
														alt={member.name}
														className='w-10 h-10 rounded-full object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center'>
														<User className='w-5 h-5 text-slate-400' />
													</div>
												)}
											</TableCell>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{member.name}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{member.position}
											</TableCell>
											<TableCell>
												<span className='text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded capitalize'>
													{member.department}
												</span>
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{member.experience} yrs
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
																			member,
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
																			member._id,
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
								hasNextPage={members.length === 10}
								onPageChange={setPage}
								itemCount={members.length}
								pageSize={10}
							/>
						</div>
					) : (
						<div className='flex items-center justify-center p-8'>
							<p className='text-slate-600 dark:text-slate-400'>
								No team members found. Create one to get
								started!
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
