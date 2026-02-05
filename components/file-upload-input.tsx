'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface FileUploadInputProps {
	label: string
	accept?: string
	maxSize?: number
	onChange: (file: File | null) => void
	value?: string
	preview?: boolean
}

export function FileUploadInput({
	label,
	accept = 'image/*',
	maxSize = 5242880, // 5MB
	onChange,
	value,
	preview = true,
}: FileUploadInputProps) {
	const [file, setFile] = useState<File | null>(null)
	const [preview_url, setPreviewUrl] = useState<string | null>(value || null)
	const [error, setError] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null)
		const selectedFile = e.target.files?.[0]

		if (!selectedFile) {
			setFile(null)
			setPreviewUrl(null)
			onChange(null)
			return
		}

		if (selectedFile.size > maxSize) {
			setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
			return
		}

		setFile(selectedFile)
		onChange(selectedFile)

		if (preview && selectedFile.type.startsWith('image/')) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(selectedFile)
		}
	}

	const handleClear = () => {
		setFile(null)
		setPreviewUrl(null)
		setError(null)
		onChange(null)
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	return (
		<div className='space-y-2'>
			<Label className='text-slate-700 dark:text-slate-300'>
				{label}
			</Label>
			<div className='space-y-3'>
				<div className='relative group'>
					<input
						ref={inputRef}
						type='file'
						accept={accept}
						onChange={handleFileChange}
						className='absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full'
					/>
					<Button
						type='button'
						variant='outline'
						className='w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex gap-2 bg-white dark:bg-transparent pointer-events-none'
					>
						<Upload className='w-4 h-4' />
						{file ? `${file.name}` : 'Choose file'}
					</Button>
				</div>

				{error && <p className='text-sm text-red-400'>{error}</p>}

				{preview_url && (
					<div className='relative w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden'>
						<img
							src={preview_url || '/placeholder.svg'}
							alt='Preview'
							className='w-full h-full object-cover'
						/>
						<Button
							type='button'
							size='sm'
							variant='ghost'
							onClick={handleClear}
							className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white'
						>
							<X className='w-4 h-4' />
						</Button>
					</div>
				)}

				{file && !preview_url && (
					<div className='flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg'>
						<span className='text-sm text-slate-700 dark:text-slate-300'>
							{file.name}
						</span>
						<Button
							type='button'
							size='sm'
							variant='ghost'
							onClick={handleClear}
							className='text-red-600 dark:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-600'
						>
							<X className='w-4 h-4' />
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
