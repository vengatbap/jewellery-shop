import { CatalogClient } from './clients/catalog/catalog.client.js';
import { ConfigurationClient } from './clients/configuration/configuration.client.js';
import { ProductClient } from './clients/product/product.client.js';
import { InventoryClient } from './clients/inventory/inventory.client.js';
import { ProcurementClient } from './clients/procurement/procurement.client.js';
import { BillingClient } from './clients/billing/billing.client.js';
import { GoldRateClient } from './clients/gold-rate/gold-rate.client.js';
import { AccountingClient } from './clients/accounting/accounting.client.js';
import { SchemeClient } from './clients/scheme/scheme.client.js';
import { CustomerClient } from './clients/customer/customer.client.js';
import { GoldLoanClient } from './clients/gold-loan/gold-loan.client.js';
import { ReportingClient } from './clients/reporting/reporting.client.js';
import { EcommerceClient } from './clients/ecommerce/ecommerce.client.js';
import { MultiBranchClient } from './clients/multibranch/multibranch.client.js';
import { RepairClient } from './clients/repair/repair.client.js';
import { UserClient } from './clients/user/user.client.js';
import { BranchClient } from './clients/branch/branch.client.js';
import { OrganizationClient } from './clients/organization/organization.client.js';
import { SettingsClient } from './clients/settings/settings.client.js';

export class PlatformSDK {
    public catalog: CatalogClient;
    public configuration: ConfigurationClient;
    public product: ProductClient;
    public inventory: InventoryClient;
    public procurement: ProcurementClient;
    public billing: BillingClient;
    public goldRate: GoldRateClient;
    public accounting: AccountingClient;
    public scheme: SchemeClient;
    public customer: CustomerClient;
    public goldLoan: GoldLoanClient;
    public reporting: ReportingClient;
    public ecommerce: EcommerceClient;
    public multiBranch: MultiBranchClient;
    public repair: RepairClient;
    public identity: UserClient;
    public platform: {
        branch: BranchClient;
        organization: OrganizationClient;
        settings: SettingsClient;
    };

    constructor(config: {
        catalogUrl: string;
        configurationUrl: string;
        productUrl?: string;
        inventoryUrl?: string;
        procurementUrl?: string;
        billingUrl?: string;
        goldRateUrl?: string;
        accountingUrl?: string;
        schemeUrl?: string;
        customerUrl?: string;
        goldLoanUrl?: string;
        reportingUrl?: string;
        ecommerceUrl?: string;
        multiBranchUrl?: string;
        repairUrl?: string;
        identityUrl: string;
        platformUrl: string;
    }) {
        this.catalog = new CatalogClient(config.catalogUrl);
        this.configuration = new ConfigurationClient(config.configurationUrl);
        this.product = new ProductClient(config.productUrl || 'http://localhost:3004');
        this.inventory = new InventoryClient(config.inventoryUrl || 'http://localhost:3005');
        this.procurement = new ProcurementClient(config.procurementUrl || 'http://localhost:3006');
        this.goldRate = new GoldRateClient(config.goldRateUrl || 'http://localhost:3007');
        this.billing = new BillingClient(config.billingUrl || 'http://localhost:3008');
        this.accounting = new AccountingClient(config.accountingUrl || 'http://localhost:3009');
        this.scheme = new SchemeClient(config.schemeUrl || 'http://localhost:3010');
        this.customer = new CustomerClient(config.customerUrl || 'http://localhost:3011');
        this.goldLoan = new GoldLoanClient(config.goldLoanUrl || 'http://localhost:3012');
        this.reporting = new ReportingClient(config.reportingUrl || 'http://localhost:3013');
        this.ecommerce = new EcommerceClient(config.ecommerceUrl || 'http://localhost:3014');
        this.multiBranch = new MultiBranchClient(config.multiBranchUrl || 'http://localhost:3015');
        this.repair = new RepairClient(config.repairUrl || 'http://localhost:3016');
        this.identity = new UserClient(config.identityUrl);
        this.platform = {
            branch: new BranchClient(config.platformUrl),
            organization: new OrganizationClient(config.platformUrl),
            settings: new SettingsClient(config.platformUrl)
        };
    }
}
