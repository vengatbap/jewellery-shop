import { BaseWorkflow } from './index';
import { OrganizationService, BranchService, AuthService } from '@auric-one/platform';
import { db } from '@auric-one/database';
import { roles, permissions, invoiceSettings, goldRateSettings, barcodeSettings } from '@auric-one/database/schema';

export interface OnboardingInput {
    orgName: string;
    legalName: string;
    currency: string;
    timezone: string;
    country: string;
    ownerEmail: string;
    ownerPassword?: string;
    ownerFirstName?: string;
    ownerLastName?: string;
}

export class OrganizationOnboardingFlow extends BaseWorkflow {
    private input: OnboardingInput;
    public result: {
        organizationId?: string;
        branchId?: string;
        ownerUserId?: string;
    } = {};

    constructor(input: OnboardingInput) {
        super();
        this.input = input;
        this.initializeSteps();
    }

    private initializeSteps() {
        this.steps.push({
            name: 'Create Organization',
            execute: async () => {
                const org = await OrganizationService.create({
                    name: this.input.orgName,
                    legalName: this.input.legalName,
                    currency: this.input.currency,
                    timezone: this.input.timezone,
                    country: this.input.country,
                });
                this.result.organizationId = org.id;
            }
        });

        this.steps.push({
            name: 'Create Default Branch',
            execute: async () => {
                if (!this.result.organizationId) throw new Error('Missing Organization ID');
                const branch = await BranchService.create(this.result.organizationId, {
                    name: 'Default Main Head Office',
                    code: 'HO01',
                });
                this.result.branchId = branch.id;
            }
        });

        this.steps.push({
            name: 'Seed System Roles & Default Permissions',
            execute: async () => {
                const orgId = this.result.organizationId!;
                
                await db
                    .insert(roles)
                    .values([
                        { organizationId: orgId, name: 'Owner', description: 'Business owner', isSystem: true },
                        { organizationId: orgId, name: 'Admin', description: 'Admin manager', isSystem: true },
                        { organizationId: orgId, name: 'Cashier', description: 'POS cashier', isSystem: true },
                    ])
                    .returning();
                    
                await db
                    .insert(permissions)
                    .values([
                        { code: 'organization:manage', module: 'org', name: 'Manage Organization', description: 'Manage settings' },
                        { code: 'branch:manage', module: 'branch', name: 'Manage Branch', description: 'Manage branch details' },
                        { code: 'user:manage', module: 'user', name: 'Manage Users', description: 'Invite and modify user accounts' },
                    ]);
            }
        });

        this.steps.push({
            name: 'Create Owner User',
            execute: async () => {
                const orgId = this.result.organizationId!;
                const userId = await AuthService.register({
                    organizationId: orgId,
                    email: this.input.ownerEmail,
                    password: this.input.ownerPassword || 'Password123!',
                    firstName: this.input.ownerFirstName,
                    lastName: this.input.ownerLastName,
                    roleName: 'Owner',
                });
                this.result.ownerUserId = userId;
            }
        });

        this.steps.push({
            name: 'Initialize Organization Settings Templates',
            execute: async () => {
                const orgId = this.result.organizationId!;
                const branchId = this.result.branchId!;

                await db.insert(invoiceSettings).values({
                    organizationId: orgId,
                    branchId,
                    prefix: 'INV',
                    nextNumber: 1001,
                    taxEnabled: true,
                });

                await db.insert(goldRateSettings).values({
                    organizationId: orgId,
                    branchId,
                    marginPercentage: '2.00',
                    calculationFormula: 'BASE_RATE * (1 + MARGIN)',
                });

                await db.insert(barcodeSettings).values({
                    organizationId: orgId,
                    branchId,
                    format: 'JR000001',
                    printTemplate: 'standard_38x25',
                });
            }
        });

        this.steps.push({
            name: 'Publish OrganizationCreated Event',
            execute: async () => {
                console.log(`📢 [Event] Published event OrganizationCreated for org ID: ${this.result.organizationId}`);
            }
        });
    }
}
