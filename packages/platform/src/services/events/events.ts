export interface EventEnvelope<T = any> {
    id: string;
    type: string;
    version: number;
    occurredAt: string;
    tenantId: string;
    branchId?: string;
    actorId?: string;
    payload: T;
}

export type PlatformEventType =
    | 'OrganizationCreated'
    | 'OrganizationUpdated'
    | 'OrganizationSuspended'
    | 'BranchCreated'
    | 'BranchActivated'
    | 'BranchDeactivated'
    | 'UserInvited'
    | 'UserActivated'
    | 'UserLocked'
    | 'UserUnlocked'
    | 'PasswordChanged'
    | 'RoleAssigned'
    | 'PermissionChanged'
    | 'SettingsUpdated'
    | 'FileUploaded'
    | 'AuditLogWritten';
