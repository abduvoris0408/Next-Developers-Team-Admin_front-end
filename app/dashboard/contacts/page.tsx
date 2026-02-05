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
import { useContacts } from '@/lib/api-hooks'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'

export default function ContactsPage() {
	const [page, setPage] = useState(1)
	const { contacts, loading } = useContacts(page, 10)

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'new':
				return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400'
			case 'contacted':
				return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400'
			case 'closed':
				return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400'
			default:
				return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
					Contacts
				</h1>
				<p className='text-slate-600 dark:text-slate-400 mt-2'>
					Manage contact inquiries
				</p>
			</div>

			<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
				<CardContent className='p-0'>
					{loading ? (
						<SpinnerInline />
					) : contacts.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Name
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Email
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Phone
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Subject
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Message
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Status
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Date
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{contacts.map(contact => (
										<TableRow
											key={contact._id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{contact.name}
											</TableCell>
											<TableCell>
												<a
													href={`mailto:${contact.email}`}
													className='text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1'
												>
													<Mail className='w-4 h-4' />
													{contact.email}
												</a>
											</TableCell>
											<TableCell>
												{contact.phone ? (
													<a
														href={`tel:${contact.phone}`}
														className='text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1'
													>
														<Phone className='w-4 h-4' />
														{contact.phone}
													</a>
												) : (
													<span className='text-slate-400'>
														-
													</span>
												)}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{contact.subject}
											</TableCell>
											<TableCell
												className='text-slate-600 dark:text-slate-400 max-w-sm truncate'
												title={contact.message}
											>
												<div className='flex items-center gap-1'>
													<MessageCircle className='w-4 h-4 flex-shrink-0' />
													{contact.message.substring(
														0,
														30,
													)}
													...
												</div>
											</TableCell>
											<TableCell>
												<span
													className={`text-xs px-2 py-1 rounded ${getStatusColor(contact.status)}`}
												>
													{contact.status
														.charAt(0)
														.toUpperCase() +
														contact.status.slice(1)}
												</span>
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400 text-sm'>
												{new Date(
													contact.createdAt,
												).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<PaginationControl
								currentPage={page}
								hasNextPage={contacts.length === 10}
								onPageChange={setPage}
								itemCount={contacts.length}
								pageSize={10}
							/>
						</div>
					) : (
						<div className='flex items-center justify-center p-8'>
							<p className='text-slate-600 dark:text-slate-400'>
								No contacts found
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
