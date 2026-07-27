import { db } from '../index.js';
import {
    organizations,
    branches,
    roles,
    users,
    userRoles,
    timezones,
    countries,
    currencies,
    languages,
    measurementUnits,
    taxCategories,
    metals,
    purities,
    metalPurityMapping,
    stoneAttributes,
    brands,
    collections,
    productCategories,
    taxRules,
    branchPosSettings,
    branchInventorySettings,
    branchAccountingSettings,
    branchPricingSettings,
    branchPrintingSettings,
    branchNotificationSettings
} from '../schema';
import { generateBusinessIdentifier } from '@auric-one/platform';
import { hashString } from '@auric-one/core';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
    console.log('🌱 Starting Multi-Stage Deterministic Seeding...');

    try {
        // === STAGE 00: Core (Organization, Branch, Roles, Users) ===
        console.log('--- Stage 00: Core Setup ---');
        
        let orgId = '';
        let branchId = '';

        // Check if default org exists
        const existingOrgs = await db.select().from(organizations).limit(1);
        if (existingOrgs.length > 0) {
            orgId = existingOrgs[0].id;
            console.log(`ℹ️ Organization already exists: ${existingOrgs[0].name}`);
        } else {
            const orgBusinessId = generateBusinessIdentifier('ORGANIZATION', { counter: 1 });
            const [org] = await db
                .insert(organizations)
                .values({
                    businessId: orgBusinessId,
                    name: 'Auric One Main Shop',
                    legalName: 'Auric One Enterprises Private Limited',
                    currency: 'BHD',
                    timezone: 'Asia/Bahrain',
                    country: 'BH',
                    status: 'ACTIVE',
                })
                .returning();
            orgId = org.id;
            console.log(`✅ Seeded Organization: ${org.name}`);
        }

        // Check if default branch exists
        const existingBranches = await db.select().from(branches).where(eq(branches.organizationId, orgId)).limit(1);
        if (existingBranches.length > 0) {
            branchId = existingBranches[0].id;
            console.log(`ℹ️ Branch already exists: ${existingBranches[0].name}`);
        } else {
            const branchBusinessId = generateBusinessIdentifier('BRANCH', { counter: 1 });
            const [branch] = await db
                .insert(branches)
                .values({
                    businessId: branchBusinessId,
                    organizationId: orgId,
                    name: 'Bahrain Financial Harbor Branch',
                    code: 'BFH01',
                    managerName: 'John Doe',
                    email: 'bfh@auricone.com',
                    phone: '+97317000000',
                    status: 'ACTIVE',
                })
                .returning();
            branchId = branch.id;
            console.log(`✅ Seeded Branch: ${branch.name}`);
        }

        // Seed core roles
        const existingRoles = await db.select().from(roles).where(eq(roles.organizationId, orgId));
        let ownerRoleId = '';

        if (existingRoles.length > 0) {
            ownerRoleId = existingRoles.find(r => r.name === 'Owner')?.id || '';
            console.log('ℹ️ Core roles already exist');
        } else {
            const prdPersonas = [
                { name: 'Owner', description: 'Business owner with unrestricted capabilities' },
                { name: 'Admin', description: 'System administrator managing users and settings' },
                { name: 'Cashier', description: 'Staff executing point-of-sale sales and billing' },
            ];
            const seededRoles = await db
                .insert(roles)
                .values(
                    prdPersonas.map((role) => ({
                        organizationId: orgId,
                        name: role.name,
                        description: role.description,
                        isSystem: true,
                    }))
                )
                .returning();
            ownerRoleId = seededRoles.find(r => r.name === 'Owner')!.id;
            console.log(`✅ Seeded System Roles: ${seededRoles.length} records`);
        }

        // Seed users
        const existingUsers = await db.select().from(users).where(eq(users.organizationId, orgId));
        if (existingUsers.length > 0) {
            console.log('ℹ️ Core users already exist');
        } else {
            const defaultPasswordHash = await hashString('Password123!');
            const [ownerUser] = await db
                .insert(users)
                .values({
                    organizationId: orgId,
                    email: 'owner@auricone.com',
                    passwordHash: defaultPasswordHash,
                    firstName: 'Owner',
                    lastName: 'User',
                    phone: '+97311111111',
                    status: 'ACTIVE',
                })
                .returning();

            await db.insert(userRoles).values({
                userId: ownerUser.id,
                roleId: ownerRoleId,
                organizationId: orgId
            });
            console.log('✅ Seeded default owner user & role mappings');
        }

        // === STAGE 01: Global Catalog (Currencies, Countries, timezones, languages) ===
        console.log('--- Stage 01: Global Catalog Setup ---');
        
        let inrCurrencyId = '';
        let bhdCurrencyId = '';
        let kolkataTzId = '';
        let bahrainTzId = '';

        // Currencies
        const existingCurrencies = await db.select().from(currencies);
        if (existingCurrencies.length > 0) {
            inrCurrencyId = existingCurrencies.find(c => c.code === 'INR')?.id || '';
            bhdCurrencyId = existingCurrencies.find(c => c.code === 'BHD')?.id || '';
            console.log('ℹ️ Currencies already exist');
        } else {
            const [inr] = await db.insert(currencies).values({ code: 'INR', name: 'Indian Rupee', symbol: '₹', isBaseCurrency: false }).returning();
            const [bhd] = await db.insert(currencies).values({ code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', decimalPlaces: 3, minorUnit: 1000, isBaseCurrency: true }).returning();
            inrCurrencyId = inr.id;
            bhdCurrencyId = bhd.id;
            console.log('✅ Seeded Currencies');
        }

        // Timezones
        const existingTzs = await db.select().from(timezones);
        if (existingTzs.length > 0) {
            kolkataTzId = existingTzs.find(t => t.name === 'Asia/Kolkata')?.id || '';
            bahrainTzId = existingTzs.find(t => t.name === 'Asia/Bahrain')?.id || '';
            console.log('ℹ️ Timezones already exist');
        } else {
            const [kol] = await db.insert(timezones).values({ code: 'TZ-KOLKATA', name: 'Asia/Kolkata', offset: '+05:30' }).returning();
            const [bah] = await db.insert(timezones).values({ code: 'TZ-BAHRAIN', name: 'Asia/Bahrain', offset: '+03:00' }).returning();
            kolkataTzId = kol.id;
            bahrainTzId = bah.id;
            console.log('✅ Seeded Timezones');
        }

        // Countries
        const existingCountries = await db.select().from(countries);
        if (existingCountries.length > 0) {
            console.log('ℹ️ Countries already exist');
        } else {
            await db.insert(countries).values([
                { code: 'IN', name: 'India', iso3: 'IND', phoneCode: '+91', defaultCurrencyId: inrCurrencyId, defaultTimezoneId: kolkataTzId },
                { code: 'BH', name: 'Bahrain', iso3: 'BHR', phoneCode: '+973', defaultCurrencyId: bhdCurrencyId, defaultTimezoneId: bahrainTzId }
            ]);
            console.log('✅ Seeded Countries');
        }

        // Languages
        const existingLanguages = await db.select().from(languages);
        if (existingLanguages.length === 0) {
            await db.insert(languages).values([
                { code: 'en-US', name: 'English (US)', locale: 'en-US', nativeName: 'English' },
                { code: 'ar-BH', name: 'Arabic (Bahrain)', locale: 'ar-BH', nativeName: 'العربية', direction: 'RTL' }
            ]);
            console.log('✅ Seeded Languages');
        }

        // Measurement Units
        const existingUnits = await db.select().from(measurementUnits);
        if (existingUnits.length === 0) {
            const [gram] = await db.insert(measurementUnits).values({ code: 'U-GRAM', name: 'Gram', symbol: 'g', type: 'WEIGHT', precision: 3 }).returning();
            await db.insert(measurementUnits).values({ code: 'U-KG', name: 'Kilogram', symbol: 'kg', type: 'WEIGHT', precision: 3, baseUnitId: gram.id, conversionFactor: '1000.000000' });
            await db.insert(measurementUnits).values({ code: 'U-PCS', name: 'Piece', symbol: 'pcs', type: 'COUNT', precision: 0 });
            console.log('✅ Seeded Measurement Units');
        }

        // Tax Categories
        let vatTaxCatId = '';
        const existingTaxCats = await db.select().from(taxCategories);
        if (existingTaxCats.length > 0) {
            vatTaxCatId = existingTaxCats[0].id;
            console.log('ℹ️ Tax Categories already exist');
        } else {
            const [vat] = await db.insert(taxCategories).values({ code: 'TAX-VAT', name: 'Value Added Tax' }).returning();
            vatTaxCatId = vat.id;
            console.log('✅ Seeded Tax Categories');
        }

        // === STAGE 02: Industry Catalog (Metals, Purities, mappings) ===
        console.log('--- Stage 02: Industry Catalog Setup ---');
        
        let goldId = '';
        const existingMetals = await db.select().from(metals);
        if (existingMetals.length > 0) {
            goldId = existingMetals.find(m => m.symbol === 'AU')?.id || '';
            console.log('ℹ️ Metals already exist');
        } else {
            const [gold] = await db.insert(metals).values({ code: 'MET-GOLD', name: 'Gold', symbol: 'AU', marketCode: 'XAU' }).returning();
            goldId = gold.id;
            console.log('✅ Seeded Metals');
        }

        const existingPurities = await db.select().from(purities);
        if (existingPurities.length > 0) {
            console.log('ℹ️ Purities already exist');
        } else {
            const [p24k] = await db.insert(purities).values({ code: 'PUR-24K', name: '24 Karat', purityValue: '0.9999' }).returning();
            const [p22k] = await db.insert(purities).values({ code: 'PUR-22K', name: '22 Karat', purityValue: '0.9160' }).returning();
            
            // Map
            await db.insert(metalPurityMapping).values([
                { metalId: goldId, purityId: p24k.id },
                { metalId: goldId, purityId: p22k.id }
            ]);
            console.log('✅ Seeded Purities & Mappings');
        }

        // Stone Attributes
        const existingStones = await db.select().from(stoneAttributes);
        if (existingStones.length === 0) {
            await db.insert(stoneAttributes).values([
                { code: 'STN-RED', name: 'Red', type: 'COLOR', value: 'Red' },
                { code: 'STN-VVS1', name: 'VVS1 Clarity', type: 'CLARITY', value: 'VVS1' },
                { code: 'STN-ROUND', name: 'Round Brilliant', type: 'CUT', value: 'Round' }
            ]);
            console.log('✅ Seeded Stone Attributes');
        }

        // === STAGE 03: Region Seeding (VAT settings) ===
        console.log('--- Stage 03: Region Seeding Setup ---');
        
        const existingTaxRules = await db.select().from(taxRules).where(eq(taxRules.organizationId, orgId));
        if (existingTaxRules.length > 0) {
            console.log('ℹ️ Tax Rules already exist');
        } else {
            await db.insert(taxRules).values({
                code: 'TAX-BH-VAT',
                name: 'Bahrain VAT 10%',
                organizationId: orgId,
                taxCategoryId: vatTaxCatId,
                rate: '10.00',
                isDefault: true,
                calculationMethod: 'EXCLUSIVE'
            });
            console.log('✅ Seeded Regional Tax Rules');
        }

        // === STAGE 04: Tenant Catalog (Brands, Collections, Categories) ===
        console.log('--- Stage 04: Tenant Catalog Setup ---');

        const existingBrands = await db.select().from(brands).where(eq(brands.organizationId, orgId));
        if (existingBrands.length === 0) {
            await db.insert(brands).values({
                code: 'BRD-AURIC',
                name: 'Auric Jewels',
                organizationId: orgId,
                brandType: 'INTERNAL'
            });
            console.log('✅ Seeded Tenant Brands');
        }

        const existingCollections = await db.select().from(collections).where(eq(collections.organizationId, orgId));
        if (existingCollections.length === 0) {
            await db.insert(collections).values({
                code: 'COL-BRIDAL',
                name: 'Bridal Wedding 2026',
                organizationId: orgId,
                lifecycleStatus: 'ACTIVE'
            });
            console.log('✅ Seeded Tenant Collections');
        }

        const existingCategories = await db.select().from(productCategories).where(eq(productCategories.organizationId, orgId));
        if (existingCategories.length === 0) {
            // Implements hierarchy category -> subcategory
            const [catRings] = await db.insert(productCategories).values({
                code: 'CAT-RINGS',
                name: 'Rings',
                organizationId: orgId,
                taxonomyLevel: 'CATEGORY'
            }).returning();

            await db.insert(productCategories).values({
                code: 'CAT-GOLD-RNG',
                name: 'Gold Rings',
                parentId: catRings.id,
                organizationId: orgId,
                taxonomyLevel: 'SUBCATEGORY'
            });
            console.log('✅ Seeded Tenant Categories (Hierarchical)');
        }

        // === STAGE 05: Branch Configuration Settings ===
        console.log('--- Stage 05: Branch Settings Setup ---');

        const existingPos = await db.select().from(branchPosSettings).where(eq(branchPosSettings.branchId, branchId));
        if (existingPos.length === 0) {
            await db.insert(branchPosSettings).values({ organizationId: orgId, branchId, allowNegativeStock: false, requireCustomerForBill: true });
            await db.insert(branchInventorySettings).values({ organizationId: orgId, branchId, enableAutoBarcode: true });
            await db.insert(branchAccountingSettings).values({ organizationId: orgId, branchId, fiscalYearStartMonth: 'APRIL' });
            await db.insert(branchPricingSettings).values({ organizationId: orgId, branchId, metalRateMargin: '1.50' });
            await db.insert(branchPrintingSettings).values({ organizationId: orgId, branchId, invoiceTemplateCode: 'STANDARD_A4' });
            await db.insert(branchNotificationSettings).values({ organizationId: orgId, branchId, sendSmsOnBill: true });
            console.log('✅ Seeded Default Branch Settings Aggregates');
        }

        console.log('🌱 Multi-Stage Deterministic Seeding Completed Successfully!');
    } catch (error) {
        console.error('❌ Seeding database failed:', error);
        throw error;
    }
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isDirectRun) {
    seedDatabase().catch(console.error);
}
