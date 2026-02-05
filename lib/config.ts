export const API_CONFIG = {
  // Default base URL - can be overridden by environment variable
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      updateDetails: '/auth/updatedetails',
      updatePassword: '/auth/updatepassword',
    },
    products: '/products',
    teamMembers: '/team',
    technologies: '/technologies',
    features: '/features',
    testimonials: '/testimonials',
    contacts: '/contacts',
    awards: '/awards',
  },
}

export function getApiUrl(endpoint: string): string {
  // Check for localStorage override first (from dashboard settings)
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('api_base_url')
    if (customUrl) {
      return customUrl + endpoint
    }
  }
  
  return API_CONFIG.baseUrl + endpoint
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('api_base_url')
    if (customUrl) {
      return customUrl
    }
  }
  
  return API_CONFIG.baseUrl
}
