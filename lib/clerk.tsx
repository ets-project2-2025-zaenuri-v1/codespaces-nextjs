import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkAuthProviderProps {
  children: ReactNode
}

export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  )
}

// Role-based access control
export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  COOK: 'cook',
  WAITER: 'waiter',
  COURIER: 'courier',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: [
    'organizations:*',
    'outlets:*',
    'members:*',
    'products:*',
    'categories:*',
    'orders:*',
    'payments:*',
    'inventory:*',
    'reports:*',
    'settings:*',
  ],
  [ROLES.ADMIN]: [
    'outlets:read',
    'members:read',
    'products:*',
    'categories:*',
    'orders:*',
    'payments:*',
    'inventory:*',
    'reports:read',
  ],
  [ROLES.CASHIER]: [
    'products:read',
    'categories:read',
    'orders:create',
    'orders:read',
    'orders:update',
    'payments:create',
    'payments:read',
  ],
  [ROLES.COOK]: [
    'orders:read',
    'kds:*',
  ],
  [ROLES.WAITER]: [
    'products:read',
    'categories:read',
    'orders:create',
    'orders:read',
    'orders:update',
    'tables:*',
  ],
  [ROLES.COURIER]: [
    'orders:read',
    'orders:update',
  ],
} as const

export function hasPermission(
  userRole: Role,
  permission: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  
  return permissions.some(p => {
    if (p === 'organizations:*') return true
    if (p === 'outlets:*') return true
    if (p === 'members:*') return true
    if (p === 'products:*') return true
    if (p === 'categories:*') return true
    if (p === 'orders:*') return true
    if (p === 'payments:*') return true
    if (p === 'inventory:*') return true
    if (p === 'reports:*') return true
    if (p === 'settings:*') return true
    if (p === 'kds:*') return true
    if (p === 'tables:*') return true
    if (p === permission) return true
    if (p.endsWith(':*')) {
      const prefix = p.split(':')[0]
      return permission.startsWith(`${prefix}:`)
    }
    return false
  })
}

export function canAccessRoute(
  userRole: Role,
  route: string
): boolean {
  const routePermissions: Record<string, string[]> = {
    '/admin': ['organizations:*', 'outlets:*', 'members:*'],
    '/admin/products': ['products:*'],
    '/admin/categories': ['categories:*'],
    '/admin/orders': ['orders:*'],
    '/admin/inventory': ['inventory:*'],
    '/admin/reports': ['reports:read'],
    '/pos': ['orders:create', 'payments:create'],
    '/kds': ['kds:*'],
    '/tables': ['tables:*'],
  }

  const requiredPermissions = Object.entries(routePermissions).find(
    ([routePattern]) => route.startsWith(routePattern)
  )?.[1]

  if (!requiredPermissions) return true

  return requiredPermissions.some(permission => 
    hasPermission(userRole, permission)
  )
}