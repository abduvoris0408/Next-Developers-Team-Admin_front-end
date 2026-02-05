'use client'

import { useAuth } from '@/lib/auth-context'
import { getApiBaseUrl } from '@/lib/config'
import { useCallback, useEffect, useState } from 'react'

let API_BASE = 'http://localhost:5000/api/v1'

// Update API_BASE on client side from config
if (typeof window !== 'undefined') {
	API_BASE = getApiBaseUrl()
}

export interface Product {
	_id: string
	name: string
	slug: string
	shortDescription: string
	fullDescription: string
	mainImage: { url: string }
	gallery: Array<{ url: string }>
	features: string[]
	technologies: Array<{ _id: string; name: string }>
	category: string
	price: string
	pricing: { currency: string; amount: number; period: string }
	demoUrl?: string
	githubUrl?: string
	downloadUrl?: string
	status: string
	version: string
	releaseDate: string
	lastUpdate: string
	downloads: number
	rating: { average: number; count: number }
	isFeatured: boolean
	isActive: boolean
	order: number
}

export interface TeamMember {
	_id: string
	name: string
	position: string
	bio: string
	avatar: { url: string }
	email: string
	phone: string
	skills: Array<{ _id: string; name: string }>
	socialLinks: { linkedin?: string; github?: string; twitter?: string }
	experience: number
	department: string
	joinDate: string
	isActive: boolean
	isFeatured: boolean
	order: number
	projectsCompleted: number
}

export interface Technology {
	_id: string
	name: string
	slug: string
	description: string
	icon: { url: string }
	logo: { url: string }
	category: string
	type: string
	officialWebsite: string
	documentation: string
	proficiencyLevel: string
	yearsOfExperience: number
	isActive: boolean
	isFeatured: boolean
	order: number
	color: string
}

export interface Feature {
	_id: string
	title: string
	description: string
	icon: string
	image: { url: string }
	order: number
	isActive: boolean
	benefits: string[]
	category: string
}

export interface Testimonial {
	_id: string
	clientName: string
	clientPosition: string
	clientCompany: string
	clientAvatar: { url: string }
	companyLogo: { url: string }
	testimonial: string
	rating: number
	project: { _id: string; name: string }
	service: string
	dateReceived: string
	location: { country: string; city: string }
	isVerified: boolean
	isFeatured: boolean
	order: number
}

export interface Contact {
	_id: string
	name: string
	email: string
	phone: string
	company: string
	subject: string
	message: string
	service: string
	budget: string
	timeline: string
	status: 'new' | 'in-progress' | 'replied' | 'closed'
	priority: 'low' | 'medium' | 'high'
	assignedTo?: { _id: string; name: string }
	notes: Array<{
		note: string
		addedBy: { _id: string; name: string }
		addedAt: string
	}>
	source: string
	createdAt: string
}

export interface Award {
	_id: string
	title: string
	description: string
	organization: string
	category: string
	year: number
	date: string
	image: { url: string }
	certificate: { url: string }
	verificationUrl: string
	rank: string
	isActive: boolean
	isFeatured: boolean
	order: number
}

export interface Attendance {
	_id: string
	memberId: { _id: string; name: string }
	date: string
	checkIn: string
	checkOut?: string
	status: 'present' | 'absent' | 'late' | 'half-day'
	notes?: string
	duration?: number
}

interface ApiResponse<T> {
	success: boolean
	data: T
	count?: number
	message?: string
}

// Generic fetch function
async function apiFetch<T>(
	url: string,
	token?: string | null,
	options: RequestInit = {},
): Promise<T> {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...options.headers,
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	try {
		const response = await fetch(url, {
			...options,
			headers,
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(
				errorData.message || `API Error: ${response.statusText}`,
			)
		}

		return response.json() as Promise<T>
	} catch (error) {
		throw error
	}
}

// Products Hooks
export function useProducts(page = 1, limit = 10) {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true)
			const data = await apiFetch<ApiResponse<Product[]>>(
				`${API_BASE}/products?page=${page}&limit=${limit}`,
			)
			setProducts(data.data)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to fetch products',
			)
		} finally {
			setLoading(false)
		}
	}, [page, limit])

	useEffect(() => {
		fetchProducts()
	}, [fetchProducts])

	return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(idOrSlug: string) {
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true)
				const data = await apiFetch<ApiResponse<Product>>(
					`${API_BASE}/products/${idOrSlug}`,
				)
				setProduct(data.data)
				setError(null)
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch product',
				)
			} finally {
				setLoading(false)
			}
		}
		if (idOrSlug) fetchProduct()
	}, [idOrSlug])

	return { product, loading, error }
}

export function useCreateProduct() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Product>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Product>>(
					`${API_BASE}/products`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create product'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useUpdateProduct() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (idOrSlug: string, data: Partial<Product>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Product>>(
					`${API_BASE}/products/${idOrSlug}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update product'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteProduct() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_product = useCallback(
		async (idOrSlug: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/products/${idOrSlug}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete product'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_product, loading, error }
}

// Team Members Hooks
export function useTeamMembers(page = 1, limit = 10) {
	const [members, setMembers] = useState<TeamMember[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchMembers = useCallback(async () => {
		try {
			setLoading(true)
			const data = await apiFetch<ApiResponse<TeamMember[]>>(
				`${API_BASE}/team?page=${page}&limit=${limit}`,
			)
			setMembers(data.data)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Failed to fetch team members',
			)
		} finally {
			setLoading(false)
		}
	}, [page, limit])

	useEffect(() => {
		fetchMembers()
	}, [fetchMembers])

	return { members, loading, error, refetch: fetchMembers }
}

export function useCreateTeamMember() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<TeamMember>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<TeamMember>>(
					`${API_BASE}/team`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create team member'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

// Technologies Hooks
export function useTechnologies() {
	const [technologies, setTechnologies] = useState<Technology[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchTechnologies = useCallback(async () => {
		try {
			setLoading(true)
			const data = await apiFetch<ApiResponse<Technology[]>>(
				`${API_BASE}/technologies`,
			)
			setTechnologies(data.data)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Failed to fetch technologies',
			)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchTechnologies()
	}, [fetchTechnologies])

	return { technologies, loading, error, refetch: fetchTechnologies }
}

// Features Hooks
export function useFeatures() {
	const [features, setFeatures] = useState<Feature[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchFeatures = useCallback(async () => {
		try {
			setLoading(true)
			const data = await apiFetch<ApiResponse<Feature[]>>(
				`${API_BASE}/features`,
			)
			setFeatures(data.data)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to fetch features',
			)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchFeatures()
	}, [fetchFeatures])

	return { features, loading, error, refetch: fetchFeatures }
}

// Testimonials Hooks
export function useTestimonials(page = 1, limit = 10) {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				setLoading(true)
				const data = await apiFetch<ApiResponse<Testimonial[]>>(
					`${API_BASE}/testimonials?page=${page}&limit=${limit}`,
				)
				setTestimonials(data.data)
				setError(null)
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch testimonials',
				)
			} finally {
				setLoading(false)
			}
		}
		fetchTestimonials()
	}, [page, limit])

	return { testimonials, loading, error }
}

// Contacts Hooks
export function useContacts(page = 1, limit = 10) {
	const { token } = useAuth()
	const [contacts, setContacts] = useState<Contact[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				setLoading(true)
				const data = await apiFetch<ApiResponse<Contact[]>>(
					`${API_BASE}/contacts?page=${page}&limit=${limit}`,
					token,
				)
				setContacts(data.data)
				setError(null)
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch contacts',
				)
			} finally {
				setLoading(false)
			}
		}
		fetchContacts()
	}, [page, limit, token])

	return { contacts, loading, error }
}

export function useUpdateContact() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<Contact>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Contact>>(
					`${API_BASE}/contacts/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update contact'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

// Team Members Update & Delete
export function useUpdateTeamMember() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<TeamMember>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<TeamMember>>(
					`${API_BASE}/team/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update team member'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteTeamMember() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_member = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/team/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete team member'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_member, loading, error }
}

// Technologies Hooks - Create, Update, Delete
export function useCreateTechnology() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Technology>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Technology>>(
					`${API_BASE}/technologies`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create technology'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useUpdateTechnology() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<Technology>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Technology>>(
					`${API_BASE}/technologies/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update technology'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteTechnology() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_technology = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/technologies/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete technology'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_technology, loading, error }
}

// Features Hooks - Create, Update, Delete
export function useCreateFeature() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Feature>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Feature>>(
					`${API_BASE}/features`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create feature'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useUpdateFeature() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<Feature>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Feature>>(
					`${API_BASE}/features/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update feature'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteFeature() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_feature = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/features/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete feature'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_feature, loading, error }
}

// Testimonials Hooks - Create, Update, Delete
export function useCreateTestimonial() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Testimonial>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Testimonial>>(
					`${API_BASE}/testimonials`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create testimonial'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useUpdateTestimonial() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<Testimonial>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Testimonial>>(
					`${API_BASE}/testimonials/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update testimonial'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteTestimonial() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_testimonial = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/testimonials/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete testimonial'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_testimonial, loading, error }
}

// Contacts Hooks - Create & Delete
export function useCreateContact() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Contact>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Contact>>(
					`${API_BASE}/contacts`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create contact'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useDeleteContact() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_contact = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/contacts/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete contact'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_contact, loading, error }
}

export function useAddContactNote() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addNote = useCallback(
		async (id: string, note: string) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Contact>>(
					`${API_BASE}/contacts/${id}/notes`,
					token,
					{ method: 'POST', body: JSON.stringify({ note }) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Failed to add note'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { addNote, loading, error }
}

// Awards Hooks
export function useAwards(page = 1, limit = 10) {
	const [awards, setAwards] = useState<Award[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [total, setTotal] = useState(0)

	const fetchAwards = useCallback(async () => {
		try {
			setLoading(true)
			const data = await apiFetch<ApiResponse<Award[]>>(
				`${API_BASE}/awards?page=${page}&limit=${limit}`,
			)
			setAwards(data.data)
			setTotal(data.count || 0)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to fetch awards',
			)
		} finally {
			setLoading(false)
		}
	}, [page, limit])

	useEffect(() => {
		fetchAwards()
	}, [fetchAwards])

	return { awards, loading, error, total, refetch: fetchAwards }
}

export function useCreateAward() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Award>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Award>>(
					`${API_BASE}/awards`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create award'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useUpdateAward() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<Award>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Award>>(
					`${API_BASE}/awards/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update award'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteAward() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_award = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/awards/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete award'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_award, loading, error }
}

// Attendance Hooks
export function useAttendance(page = 1, limit = 10) {
	const { token } = useAuth()
	const [attendance, setAttendance] = useState<Attendance[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [total, setTotal] = useState(0)

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				setLoading(true)
				const data = await apiFetch<ApiResponse<Attendance[]>>(
					`${API_BASE}/attendance?page=${page}&limit=${limit}`,
					token,
				)
				setAttendance(data.data)
				setTotal(data.count || 0)
				setError(null)
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch attendance',
				)
			} finally {
				setLoading(false)
			}
		}
		fetchAttendance()
	}, [page, limit, token])

	return { attendance, loading, error, total }
}

export function useCreateAttendance() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const create = useCallback(
		async (data: Partial<Attendance>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Attendance>>(
					`${API_BASE}/attendance`,
					token,
					{ method: 'POST', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to create attendance'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { create, loading, error }
}

export function useUpdateAttendance() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const update = useCallback(
		async (id: string, data: Partial<Attendance>) => {
			try {
				setLoading(true)
				const result = await apiFetch<ApiResponse<Attendance>>(
					`${API_BASE}/attendance/${id}`,
					token,
					{ method: 'PUT', body: JSON.stringify(data) },
				)
				setError(null)
				return result.data
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to update attendance'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { update, loading, error }
}

export function useDeleteAttendance() {
	const { token } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const delete_attendance = useCallback(
		async (id: string) => {
			try {
				setLoading(true)
				await apiFetch(`${API_BASE}/attendance/${id}`, token, {
					method: 'DELETE',
				})
				setError(null)
				return true
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Failed to delete attendance'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[token],
	)

	return { delete_attendance, loading, error }
}
