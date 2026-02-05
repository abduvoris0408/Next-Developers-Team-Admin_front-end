'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getApiBaseUrl } from '@/lib/config'
import { Check, Copy, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
	const { toast } = useToast()
	const [apiUrl, setApiUrl] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		setApiUrl(getApiBaseUrl())
	}, [])

	const handleApiUrlSave = async () => {
		if (!apiUrl.trim()) {
			toast({
				title: 'Error',
				description: 'API URL cannot be empty',
				variant: 'destructive',
			})
			return
		}

		setIsSaving(true)
		try {
			localStorage.setItem('api_base_url', apiUrl)
			toast({
				title: 'Success',
				description: 'API URL saved successfully',
			})
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to save API URL',
				variant: 'destructive',
			})
		} finally {
			setIsSaving(false)
		}
	}

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(apiUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
					Settings
				</h1>
				<p className='text-slate-600 dark:text-slate-400 mt-2'>
					Configure API settings
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* API Configuration */}
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardHeader>
						<CardTitle className='text-slate-900 dark:text-white flex items-center gap-2'>
							API Configuration
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label className='text-slate-700 dark:text-slate-300'>
								API Base URL
							</Label>
							<p className='text-xs text-slate-600 dark:text-slate-500 mb-2'>
								The base URL for all API calls. Default:
								http://localhost:5000/api/v1
							</p>
							<div className='flex gap-2'>
								<Input
									value={apiUrl}
									onChange={e => setApiUrl(e.target.value)}
									placeholder='http://localhost:5000/api/v1'
									className='bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white flex-1'
								/>
								<Button
									onClick={handleCopyUrl}
									variant='outline'
									size='icon'
									className='border-slate-200 dark:border-slate-600 bg-transparent'
								>
									{copied ? (
										<Check className='w-4 h-4 text-green-500' />
									) : (
										<Copy className='w-4 h-4' />
									)}
								</Button>
							</div>
						</div>

						<Button
							onClick={handleApiUrlSave}
							disabled={isSaving}
							className='w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2'
						>
							<Save className='w-4 h-4' />
							{isSaving ? 'Saving...' : 'Save API URL'}
						</Button>

						<div className='p-3 bg-slate-100 dark:bg-slate-700/50 rounded border border-slate-200 dark:border-slate-600'>
							<p className='text-xs text-slate-600 dark:text-slate-400'>
								<span className='font-semibold'>
									Current URL:
								</span>
								<br />
								<span className='text-cyan-600 dark:text-cyan-400 font-mono'>
									{apiUrl}
								</span>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
