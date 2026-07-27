import { z } from 'zod';

// Pagination validation
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.string().optional(),
    search: z.string().optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;

// Organization validation
export const createOrganizationSchema = z.object({
    name: z.string().min(2).max(255),
    legalName: z.string().max(255).optional(),
    taxNumber: z.string().max(50).optional(),
    currency: z.string().length(3).default('INR'),
    timezone: z.string().default('Asia/Kolkata'),
    country: z.string().length(2).default('IN'),
    invoicePrefix: z.string().min(2).max(10).default('INV'),
    fiscalYearStart: z.number().int().min(1).max(12).default(1),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// Auth validation
export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    organizationName: z.string().min(2),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
