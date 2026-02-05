'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        <TooltipProvider>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url

            return (
              <Tooltip key={item.url}>
                <TooltipTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-700 text-white border-slate-600">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </SidebarMenu>
    </SidebarGroup>
  )
}
