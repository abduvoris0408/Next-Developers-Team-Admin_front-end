'use client'

import { SpinnerPage } from '@/components/spinner-custom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getApiBaseUrl } from '@/lib/config'
import { CheckCircle2, Mail, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserProfile {
	_id: string
	name: string
	email: string
	role: string
	isActive: boolean
	createdAt: string
	updatedAt: string
	lastLogin: string
}

export default function ProfilePage() {
	const { toast } = useToast()
	const [user, setUser] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [editMode, setEditMode] = useState(false)
	const [formData, setFormData] = useState({ name: '', email: '' })

	useEffect(() => {
		fetchUserProfile()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const fetchUserProfile = async () => {
		try {
			const token = localStorage.getItem('auth_token')
			const apiUrl = getApiBaseUrl()

			if (!token) {
				toast({
					title: 'Error',
					description: 'Not authenticated',
					variant: 'destructive',
				})
				setLoading(false)
				return
			}

			const response = await fetch(`${apiUrl}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Cache-Control': 'no-cache',
				},
				cache: 'no-store',
			})

			console.debug('auth/me response status:', response.status)

			if (response.status === 200 || response.status === 304) {
				let result: any = null
				try {
					result = await response.json()
				} catch (err) {
					// 304 responses sometimes have no body; fallback to cached copy
					console.warn(
						'No JSON body in response, attempting local cache fallback',
					)
					const cached = localStorage.getItem('auth_me_cache')
					if (cached) {
						try {
							result = JSON.parse(cached)
						} catch (e) {
							result = null
						}
					}
				}

				if (!result || !result.data) {
					throw new Error('Empty profile data')
				}

				setUser(result.data)
				setFormData({
					name: result.data.name,
					email: result.data.email,
				})

				try {
					localStorage.setItem(
						'auth_me_cache',
						JSON.stringify(result),
					)
				} catch (e) {
					// ignore
				}
			} else {
				let errMsg = 'Failed to fetch profile'
				try {
					const payload = await response.json()
					errMsg = payload?.message || errMsg
				} catch (e) {
					// ignore
				}
				throw new Error(errMsg)
			}
		} catch (error) {
			console.error('Profile fetch error:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to load profile',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleSaveProfile = async () => {
		try {
			const token = localStorage.getItem('auth_token')
			const apiUrl = getApiBaseUrl()

			if (!token || !user) return

			const response = await fetch(`${apiUrl}/users/${user._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			})

			if (!response.ok) {
				let errMsg = 'Failed to update profile'
				try {
					const payload = await response.json()
					errMsg = payload?.message || errMsg
				} catch (e) {
					// ignore
				}
				throw new Error(errMsg)
			}

			setUser({ ...user, ...formData })
			setEditMode(false)
			toast({
				title: 'Success',
				description: 'Profile updated successfully',
			})
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to update profile',
				variant: 'destructive',
			})
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getRoleBadgeColor = (role: string) => {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
			case 'user':
				return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
			case 'moderator':
				return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30'
			default:
				return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30'
		}
	}

	if (loading) {
		return <SpinnerPage />
	}

	if (!user) {
		return (
			<div className='space-y-6'>
				<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
					Profile
				</h1>
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardContent className='pt-6'>
						<p className='text-slate-600 dark:text-slate-400'>
							Failed to load profile
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
					Profile
				</h1>
				<p className='text-slate-600 dark:text-slate-400 mt-2'>
					Manage your account information
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Profile Card */}
				<Card className='lg:col-span-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle className='text-slate-900 dark:text-white flex items-center gap-2'>
							<User className='w-5 h-5 text-cyan-500' />
							Personal Information
						</CardTitle>
						{!editMode && (
							<Button
								onClick={() => setEditMode(true)}
								variant='outline'
								size='sm'
								className='border-slate-200 dark:border-slate-600'
							>
								Edit
							</Button>
						)}
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<Label className='text-slate-700 dark:text-slate-300 text-sm font-medium'>
									Full Name
								</Label>
								{editMode ? (
									<Input
										value={formData.name}
										onChange={e =>
											setFormData({
												...formData,
												name: e.target.value,
											})
										}
										placeholder='Enter your name'
										className='mt-2 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white'
									/>
								) : (
									<p className='mt-2 text-slate-900 dark:text-slate-100 font-medium'>
										{user.name}
									</p>
								)}
							</div>

							<div>
								<Label className='text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2'>
									<Mail className='w-4 h-4' />
									Email Address
								</Label>
								{editMode ? (
									<Input
										type='email'
										value={formData.email}
										onChange={e =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
										placeholder='Enter your email'
										className='mt-2 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white'
									/>
								) : (
									<p className='mt-2 text-slate-900 dark:text-slate-100'>
										{user.email}
									</p>
								)}
							</div>
						</div>

						{editMode && (
							<div className='flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700'>
								<Button
									onClick={handleSaveProfile}
									className='flex-1 bg-cyan-600 hover:bg-cyan-700 text-white'
								>
									Save Changes
								</Button>
								<Button
									onClick={() => {
										setEditMode(false)
										setFormData({
											name: user.name,
											email: user.email,
										})
									}}
									variant='outline'
									className='flex-1 border-slate-200 dark:border-slate-600'
								>
									Cancel
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Account Status Card */}
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardHeader>
						<CardTitle className='text-slate-900 dark:text-white flex items-center gap-2'>
							<Shield className='w-5 h-5 text-cyan-500' />
							Account Status
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400 mb-2'>
								Role
							</p>
							<Badge
								className={`${getRoleBadgeColor(user.role)} border`}
							>
								{user.role.charAt(0).toUpperCase() +
									user.role.slice(1)}
							</Badge>
						</div>

						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400 mb-2'>
								Status
							</p>
							<div className='flex items-center gap-2'>
								<CheckCircle2
									className={`w-5 h-5 ${user.isActive ? 'text-green-500' : 'text-red-500'}`}
								/>
								<span
									className={`font-medium ${user.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
								>
									{user.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>

						<div className='pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3'>
							<div>
								<p className='text-xs text-slate-600 dark:text-slate-400 mb-1'>
									Member Since
								</p>
								<p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
									{formatDate(user.createdAt)}
								</p>
							</div>

							<div>
								<p className='text-xs text-slate-600 dark:text-slate-400 mb-1'>
									Last Login
								</p>
								<p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
									{formatDate(user.lastLogin)}
								</p>
							</div>

							<div>
								<p className='text-xs text-slate-600 dark:text-slate-400 mb-1'>
									Last Updated
								</p>
								<p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
									{formatDate(user.updatedAt)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
