'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface ThemeConfig {
	primaryColor: string
	accentColor: string
	backgroundColor: string
	textColor: string
	borderColor: string
}

const DEFAULT_THEME: ThemeConfig = {
	primaryColor: '#0ea5e9',
	accentColor: '#06b6d4',
	backgroundColor: '#0f172a',
	textColor: '#f1f5f9',
	borderColor: '#334155',
}

const LIGHT_THEME: ThemeConfig = {
	primaryColor: '#0284c7',
	accentColor: '#0891b2',
	backgroundColor: '#f8fafc',
	textColor: '#0f172a',
	borderColor: '#cbd5e1',
}

interface ThemeContextType {
	theme: ThemeConfig
	isDark: boolean
	updateTheme: (newTheme: Partial<ThemeConfig>) => void
	toggleTheme: () => void
	resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME)
	const [isDark, setIsDark] = useState(true)
	const [isLoaded, setIsLoaded] = useState(false)

	// Load theme from localStorage on mount
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme_config')
		const savedIsDark = localStorage.getItem('is_dark_theme')

		// Set isDark state first
		if (savedIsDark !== null) {
			setIsDark(JSON.parse(savedIsDark))
		}

		// Load or set default theme based on isDark
		if (savedTheme) {
			try {
				setTheme(JSON.parse(savedTheme))
			} catch (error) {
				console.error('Failed to parse saved theme:', error)
			}
		} else {
			setTheme(
				savedIsDark === 'false' || savedIsDark === null
					? LIGHT_THEME
					: DEFAULT_THEME,
			)
		}
		setIsLoaded(true)
	}, [])

	// Apply theme to CSS variables and document class
	useEffect(() => {
		if (!isLoaded) return

		const root = document.documentElement
		root.style.setProperty('--color-primary', theme.primaryColor)
		root.style.setProperty('--color-accent', theme.accentColor)
		root.style.setProperty('--color-background', theme.backgroundColor)
		root.style.setProperty('--color-text', theme.textColor)
		root.style.setProperty('--color-border', theme.borderColor)

		// Update dark class on html element
		if (isDark) {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}

		// Save to localStorage
		localStorage.setItem('theme_config', JSON.stringify(theme))
		localStorage.setItem('is_dark_theme', JSON.stringify(isDark))
	}, [theme, isDark, isLoaded])

	const updateTheme = (newTheme: Partial<ThemeConfig>) => {
		setTheme(prevTheme => ({
			...prevTheme,
			...newTheme,
		}))
	}

	const toggleTheme = () => {
		setIsDark(prev => {
			const newIsDark = !prev
			// Update theme colors when toggling
			setTheme(newIsDark ? DEFAULT_THEME : LIGHT_THEME)
			return newIsDark
		})
	}

	const resetTheme = () => {
		setTheme(DEFAULT_THEME)
		setIsDark(true)
		localStorage.removeItem('theme_config')
		localStorage.removeItem('is_dark_theme')
	}

	return (
		<ThemeContext.Provider
			value={{ theme, isDark, updateTheme, toggleTheme, resetTheme }}
		>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return context
}
