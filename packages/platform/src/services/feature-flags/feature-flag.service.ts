import { config } from '@auric-one/config';

export type FeatureFlagName =
    | 'EnableSchemes'
    | 'EnableAccounting'
    | 'EnableRepair'
    | 'EnableManufacturing'
    | 'EnableCRM'
    | 'EnableInventoryTransfers';

export class FeatureFlagService {
    static isEnabled(flagName: FeatureFlagName, _organizationId?: string): boolean {
        const flags = (config as any).featureFlags || {};
        if (flagName in flags) {
            return !!flags[flagName];
        }
        return true;
    }
}
