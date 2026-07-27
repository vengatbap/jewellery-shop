// Permission codes registry
export const PERMISSIONS = {
    // Organization
    'organization:create': 'Create organization',
    'organization:read': 'Read organization',
    'organization:update': 'Update organization',
    'organization:delete': 'Delete organization',
    'organization:audit': 'View organization audit logs',

    // Branch
    'branch:create': 'Create branch',
    'branch:read': 'Read branch',
    'branch:update': 'Update branch',
    'branch:delete': 'Delete branch',

    // User
    'user:create': 'Create user',
    'user:read': 'Read user',
    'user:update': 'Update user',
    'user:delete': 'Delete user',

    // Role
    'role:create': 'Create role',
    'role:read': 'Read role',
    'role:update': 'Update role',
    'role:delete': 'Delete role',
} as const;

// System roles
export const SYSTEM_ROLES = {
    OWNER: 'Owner',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    CASHIER: 'Cashier',
    STAFF: 'Staff',
} as const;

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
    [SYSTEM_ROLES.OWNER]: [
        'organization:*',
        'branch:*',
        'user:*',
        'role:*',
    ],
    [SYSTEM_ROLES.ADMIN]: [
        'branch:*',
        'user:*',
        'role:read',
        'organization:read',
    ],
    [SYSTEM_ROLES.MANAGER]: [
        'branch:read',
        'user:read',
    ],
    [SYSTEM_ROLES.CASHIER]: [],
    [SYSTEM_ROLES.STAFF]: [],
};
