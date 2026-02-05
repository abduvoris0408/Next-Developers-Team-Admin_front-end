'use client'

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
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function AttendancePage() {
	const [loading] = useState(false)

	// Sample attendance data
	const attendanceData = [
		{
			id: '1',
			name: 'John Doe',
			date: '2024-02-05',
			status: 'present',
			checkIn: '09:00 AM',
			checkOut: '05:30 PM',
		},
		{
			id: '2',
			name: 'Jane Smith',
			date: '2024-02-05',
			status: 'present',
			checkIn: '08:45 AM',
			checkOut: '05:45 PM',
		},
		{
			id: '3',
			name: 'Bob Johnson',
			date: '2024-02-05',
			status: 'late',
			checkIn: '10:15 AM',
			checkOut: '06:00 PM',
		},
		{
			id: '4',
			name: 'Alice Williams',
			date: '2024-02-05',
			status: 'absent',
			checkIn: '-',
			checkOut: '-',
		},
	]

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'present':
				return (
					<CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
				)
			case 'late':
				return (
					<Clock className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
				)
			case 'absent':
				return (
					<XCircle className='w-5 h-5 text-red-600 dark:text-red-400' />
				)
			default:
				return null
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'present':
				return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400'
			case 'late':
				return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400'
			case 'absent':
				return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'
			default:
				return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
		}
	}

	const stats = {
		total: attendanceData.length,
		present: attendanceData.filter(a => a.status === 'present').length,
		late: attendanceData.filter(a => a.status === 'late').length,
		absent: attendanceData.filter(a => a.status === 'absent').length,
	}

	return (
		<div className='space-y-6'>
			<div>
				<div className='flex items-center gap-2 mb-2'>
					<Calendar className='w-6 h-6 text-cyan-600 dark:text-cyan-400' />
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Attendance
					</h1>
				</div>
				<p className='text-slate-600 dark:text-slate-400 mt-2'>
					Track team attendance and check-in records
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardContent className='p-4'>
						<p className='text-sm text-slate-600 dark:text-slate-400'>
							Total
						</p>
						<p className='text-2xl font-bold text-slate-900 dark:text-white mt-1'>
							{stats.total}
						</p>
					</CardContent>
				</Card>
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardContent className='p-4'>
						<p className='text-sm text-green-600 dark:text-green-400 font-medium'>
							Present
						</p>
						<p className='text-2xl font-bold text-green-600 dark:text-green-400 mt-1'>
							{stats.present}
						</p>
					</CardContent>
				</Card>
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardContent className='p-4'>
						<p className='text-sm text-yellow-600 dark:text-yellow-400 font-medium'>
							Late
						</p>
						<p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1'>
							{stats.late}
						</p>
					</CardContent>
				</Card>
				<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<CardContent className='p-4'>
						<p className='text-sm text-red-600 dark:text-red-400 font-medium'>
							Absent
						</p>
						<p className='text-2xl font-bold text-red-600 dark:text-red-400 mt-1'>
							{stats.absent}
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className='border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
				<CardContent className='p-0'>
					{loading ? (
						<SpinnerInline />
					) : attendanceData.length > 0 ? (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Name
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Date
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Status
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Check In
										</TableHead>
										<TableHead className='text-slate-700 dark:text-slate-300'>
											Check Out
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{attendanceData.map(record => (
										<TableRow
											key={record.id}
											className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
										>
											<TableCell className='text-slate-900 dark:text-white font-medium'>
												{record.name}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{record.date}
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													{getStatusIcon(
														record.status,
													)}
													<span
														className={`text-xs px-2 py-1 rounded ${getStatusColor(record.status)}`}
													>
														{record.status
															.charAt(0)
															.toUpperCase() +
															record.status.slice(
																1,
															)}
													</span>
												</div>
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{record.checkIn}
											</TableCell>
											<TableCell className='text-slate-600 dark:text-slate-400'>
												{record.checkOut}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className='flex items-center justify-center p-8'>
							<p className='text-slate-600 dark:text-slate-400'>
								No attendance records found
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
