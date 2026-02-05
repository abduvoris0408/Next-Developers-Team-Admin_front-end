'use client'

import { Toaster } from 'sonner'

export function SonnerToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={5}
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-slate-800 group-[.toaster]:text-slate-50 group-[.toaster]:border-slate-700 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-slate-400',
          actionButton:
            'group-[.toast]:bg-cyan-500 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-slate-700 group-[.toast]:text-slate-300',
          closeButton: 'group-[.toast]:bg-slate-700',
        },
      }}
    />
  )
}
