'use client';

import { toast } from 'sonner'

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useToast() {
  const showToast = (options: ToastOptions) => {
    const { title, description, variant = 'default', action, duration = 3000 } = options

    const message = description || title || ''
    const messageTitle = title && description ? title : undefined

    if (variant === 'destructive') {
      toast.error(messageTitle || message, {
        description: messageTitle ? message : undefined,
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      })
    } else if (variant === 'success') {
      toast.success(messageTitle || message, {
        description: messageTitle ? message : undefined,
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      })
    } else {
      toast(messageTitle || message, {
        description: messageTitle ? message : undefined,
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      })
    }
  }

  return {
    toast: showToast,
    success: (title: string, description?: string) =>
      showToast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) =>
      showToast({ title, description, variant: 'destructive' }),
    info: (title: string, description?: string) =>
      showToast({ title, description, variant: 'default' }),
  }
}
