import { CatalogClient } from './clients/catalog/catalog.client';
import { ConfigurationClient } from './clients/configuration/configuration.client';
import { UserClient } from './clients/user/user.client';
import { BranchClient } from './clients/branch/branch.client';
import { OrganizationClient } from './clients/organization/organization.client';
import { SettingsClient } from './clients/settings/settings.client';

export class PlatformSDK {
    public catalog: CatalogClient;
    public configuration: ConfigurationClient;
    public identity: UserClient;
    public platform: {
        branch: BranchClient;
        organization: OrganizationClient;
        settings: SettingsClient;
    };

    constructor(config: {
        catalogUrl: string;
        configurationUrl: string;
        identityUrl: string;
        platformUrl: string;
    }) {
        this.catalog = new CatalogClient(config.catalogUrl);
        this.configuration = new ConfigurationClient(config.configurationUrl);
        this.identity = new UserClient(config.identityUrl);
        this.platform = {
            branch: new BranchClient(config.platformUrl),
            organization: new OrganizationClient(config.platformUrl),
            settings: new SettingsClient(config.platformUrl)
        };
    }
}
