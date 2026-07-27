DO $$ BEGIN
 CREATE TYPE "token_type" AS ENUM('ACCESS', 'REFRESH', 'EMAIL_VERIFY', 'PASSWORD_RESET', 'API_KEY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "branch_status" AS ENUM('ACTIVE', 'INACTIVE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "inventory_status" AS ENUM('IN_STOCK', 'RESERVED', 'SOLD', 'TRANSFERRED', 'REPAIR', 'MELTING', 'RETURNED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_status" AS ENUM('DRAFT', 'COMPLETED', 'CANCELLED', 'REFUNDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "organization_status" AS ENUM('ACTIVE', 'SUSPENDED', 'ARCHIVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "purchase_order_status" AS ENUM('DRAFT', 'ORDERED', 'PARTIAL', 'RECEIVED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"legal_name" varchar(255),
	"registration_number" varchar(100),
	"tax_number" varchar(50),
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"timezone" varchar(50) DEFAULT 'Asia/Kolkata' NOT NULL,
	"logo_url" text,
	"email" varchar(255),
	"phone" varchar(20),
	"website" text,
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(2) DEFAULT 'IN',
	"fiscal_year_start" smallint DEFAULT 1,
	"invoice_prefix" varchar(10) DEFAULT 'INV',
	"status" "organization_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid,
	CONSTRAINT "organizations_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" varchar(20) NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(20) NOT NULL,
	"manager_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(20),
	"address" varchar(500),
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(2) DEFAULT 'IN',
	"status" "branch_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid,
	"branch_id" uuid,
	"current_branch_id" uuid,
	"refresh_token_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"device_name" varchar(255),
	"device_id" varchar(255),
	"last_activity" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_reason" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid,
	CONSTRAINT "sessions_refresh_token_id_unique" UNIQUE("refresh_token_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"token_type" "token_type" NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid,
	CONSTRAINT "auth_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "barcode_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"format" varchar(100) DEFAULT 'JR000001' NOT NULL,
	"print_template" varchar(255) DEFAULT 'standard_38x25' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gold_rate_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"margin_percentage" numeric(5, 2) DEFAULT '2.00' NOT NULL,
	"calculation_formula" varchar(255) DEFAULT 'BASE_RATE * (1 + MARGIN)' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"prefix" varchar(50) DEFAULT 'INV' NOT NULL,
	"suffix" varchar(50),
	"next_number" integer DEFAULT 1001 NOT NULL,
	"tax_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"deleted_by" uuid,
	CONSTRAINT "platform_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL,
	"module" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" varchar(36),
	"user_id" varchar(36),
	"module" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"record_id" varchar(36) NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timezones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"offset" varchar(10) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"continent" varchar(50),
	"region" varchar(50),
	"code" varchar(50) NOT NULL,
	"iso3" varchar(3),
	"numeric_code" varchar(3),
	"phone_code" varchar(10),
	"default_currency_id" uuid,
	"default_timezone_id" uuid,
	"flag_emoji" varchar(10),
	"nationality" varchar(100),
	"is_supported" boolean DEFAULT true NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"decimal_places" integer DEFAULT 2 NOT NULL,
	"minor_unit" integer DEFAULT 100 NOT NULL,
	"symbol_position" varchar(10) DEFAULT 'BEFORE' NOT NULL,
	"rounding_precision" numeric(5, 4) DEFAULT '0.0100' NOT NULL,
	"is_base_currency" boolean DEFAULT false NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"native_name" varchar(100) NOT NULL,
	"direction" varchar(3) DEFAULT 'LTR' NOT NULL,
	"locale" varchar(10) NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "measurement_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"type" varchar(20) NOT NULL,
	"precision" integer DEFAULT 0 NOT NULL,
	"base_unit_id" uuid,
	"conversion_factor" numeric(12, 6) DEFAULT '1.000000' NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "barcode_standards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supports_check_digit" boolean DEFAULT false NOT NULL,
	"supports_2d" boolean DEFAULT false NOT NULL,
	"supports_gs1" boolean DEFAULT false NOT NULL,
	"max_length" integer,
	"min_length" integer,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"atomic_number" integer,
	"market_code" varchar(20),
	"default_purity_id" uuid,
	"supports_hallmark" boolean DEFAULT true NOT NULL,
	"supports_stone" boolean DEFAULT true NOT NULL,
	"supports_exchange" boolean DEFAULT true NOT NULL,
	"supports_buyback" boolean DEFAULT true NOT NULL,
	"supports_investment" boolean DEFAULT false NOT NULL,
	"supports_scrap" boolean DEFAULT true NOT NULL,
	"supports_certification" boolean DEFAULT true NOT NULL,
	"density" numeric(6, 3),
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purity_value" numeric(5, 4) NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metal_purity_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metal_id" uuid NOT NULL,
	"purity_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stone_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"value" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "diamond_labs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"website" varchar(255),
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hallmark_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_id" uuid NOT NULL,
	"city" varchar(100) NOT NULL,
	"license_number" varchar(100) NOT NULL,
	"website" varchar(255),
	"email" varchar(100),
	"phone" varchar(50),
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certificate_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer" varchar(100),
	"country" varchar(2),
	"website" varchar(255),
	"logo" varchar(255),
	"brand_type" varchar(20) DEFAULT 'INTERNAL' NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season" varchar(50),
	"launch_date" date,
	"retire_date" date,
	"is_featured" boolean DEFAULT false NOT NULL,
	"banner_image" varchar(255),
	"lifecycle_status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"taxonomy_level" varchar(20) DEFAULT 'CATEGORY' NOT NULL,
	"image" varchar(255),
	"icon" varchar(50),
	"barcode_prefix" varchar(5),
	"default_making_charge_type" varchar(20),
	"default_wastage_type" varchar(20),
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attribute_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attribute_id" uuid NOT NULL,
	"value" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"validation_type" varchar(20) DEFAULT 'TEXT' NOT NULL,
	"validation_rule" varchar(255),
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category_attribute_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "making_charge_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calculation_method" varchar(20) DEFAULT 'PER_GRAM' NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wastage_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calculation_method" varchar(20) DEFAULT 'PER_GRAM' NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "design_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_years" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'FUTURE' NOT NULL,
	"sequence" integer DEFAULT 1 NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"lock_reason" text,
	"closed_by" uuid,
	"closed_at" timestamp with time zone,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_cash" boolean DEFAULT false NOT NULL,
	"requires_reference" boolean DEFAULT false NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"requires_customer" boolean DEFAULT false NOT NULL,
	"supports_refund" boolean DEFAULT true NOT NULL,
	"supports_exchange" boolean DEFAULT false NOT NULL,
	"supports_installments" boolean DEFAULT false NOT NULL,
	"supports_partial_payment" boolean DEFAULT true NOT NULL,
	"supports_change" boolean DEFAULT false NOT NULL,
	"supports_offline" boolean DEFAULT true NOT NULL,
	"supports_online" boolean DEFAULT true NOT NULL,
	"requires_manager_approval" boolean DEFAULT false NOT NULL,
	"min_amount" numeric(15, 4),
	"max_amount" numeric(15, 4),
	"default_ledger_id" uuid,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tax_category_id" uuid NOT NULL,
	"rate" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"compound_tax" boolean DEFAULT false NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"calculation_method" varchar(20) DEFAULT 'EXCLUSIVE' NOT NULL,
	"inclusive" boolean DEFAULT false NOT NULL,
	"exclusive" boolean DEFAULT true NOT NULL,
	"rounding_method" varchar(20) DEFAULT 'HALF_UP' NOT NULL,
	"ledger_account_id" uuid,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"type" varchar(20) DEFAULT 'HOLIDAY' NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"record_version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_accounting_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fiscal_year_start_month" varchar(20) DEFAULT 'APRIL' NOT NULL,
	"currency_conversion_enabled" boolean DEFAULT false NOT NULL,
	"default_cash_ledger_id" uuid,
	"default_bank_ledger_id" uuid,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_inventory_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enable_auto_barcode" boolean DEFAULT true NOT NULL,
	"default_storage_location" varchar(100),
	"require_stock_audit" boolean DEFAULT false NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_notification_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"send_sms_on_bill" boolean DEFAULT true NOT NULL,
	"send_email_on_bill" boolean DEFAULT true NOT NULL,
	"sms_provider_config" jsonb,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_pos_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"allow_negative_stock" boolean DEFAULT false NOT NULL,
	"require_customer_for_bill" boolean DEFAULT true NOT NULL,
	"max_discount_percentage" numeric(5, 2) DEFAULT '5.00' NOT NULL,
	"enable_offline_mode" boolean DEFAULT false NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_pricing_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metal_rate_margin" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"wastage_multiplier" numeric(5, 2) DEFAULT '1.00' NOT NULL,
	"making_charge_markup" numeric(5, 2) DEFAULT '1.00' NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_printing_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_template_code" varchar(50) DEFAULT 'STANDARD_A4' NOT NULL,
	"barcode_template_code" varchar(50) DEFAULT 'JEWEL_LABEL' NOT NULL,
	"printer_device_name" varchar(255),
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_organizations_status" ON "organizations" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_organizations_created_at" ON "organizations" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_organizations_tax_number" ON "organizations" ("tax_number","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branches_organization_id" ON "branches" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branches_status" ON "branches" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_branches_org_code" ON "branches" ("organization_id","code","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_refresh_token_id" ON "sessions" ("refresh_token_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_last_activity" ON "sessions" ("last_activity");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_auth_tokens_user_id" ON "auth_tokens" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_auth_tokens_type" ON "auth_tokens" ("token_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_auth_tokens_hash" ON "auth_tokens" ("token_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_organization_id" ON "users" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_users_org_email" ON "users" ("organization_id","email","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_roles_organization_id" ON "roles" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_roles_is_system" ON "roles" ("is_system");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_roles_org_name" ON "roles" ("organization_id","name","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_permissions_module" ON "permissions" ("module");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_role_permissions_role_id" ON "role_permissions" ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_role_permissions_permission_id" ON "role_permissions" ("permission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_roles_user_id" ON "user_roles" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_roles_role_id" ON "user_roles" ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_roles_branch_id" ON "user_roles" ("branch_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_user_role_assignment" ON "user_roles" ("user_id","role_id","branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_organization_id" ON "audit_logs" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_branch_id" ON "audit_logs" ("branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_user_id" ON "audit_logs" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_module" ON "audit_logs" ("module");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_action" ON "audit_logs" ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_table_name" ON "audit_logs" ("table_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timezones_name" ON "timezones" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timezones_code" ON "timezones" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_countries_code" ON "countries" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_currencies_code" ON "currencies" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_languages_code" ON "languages" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_measurement_units_code" ON "measurement_units" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_barcode_standards_code" ON "barcode_standards" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tax_categories_code" ON "tax_categories" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_metals_code" ON "metals" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_purities_code" ON "purities" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_metal_purity_mapping" ON "metal_purity_mapping" ("metal_id","purity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stone_attributes_type" ON "stone_attributes" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stone_attributes_code" ON "stone_attributes" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_diamond_labs_code" ON "diamond_labs" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hallmark_centers_code" ON "hallmark_centers" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_certificate_types_code" ON "certificate_types" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_brands_code" ON "brands" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_brands_org" ON "brands" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_collections_code" ON "collections" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_collections_org" ON "collections" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_categories_code" ON "product_categories" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_categories_org" ON "product_categories" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_attribute_values_code" ON "attribute_values" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_attributes_code" ON "attributes" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_attributes_org" ON "attributes" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cat_attr_mapping" ON "category_attribute_mapping" ("category_id","attribute_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_making_charge_types_code" ON "making_charge_types" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_making_charge_types_org" ON "making_charge_types" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wastage_types_code" ON "wastage_types" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wastage_types_org" ON "wastage_types" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_design_types_code" ON "design_types" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_design_types_org" ON "design_types" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_financial_years_code" ON "financial_years" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_financial_years_org" ON "financial_years" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_methods_code" ON "payment_methods" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_methods_org" ON "payment_methods" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tax_rules_code" ON "tax_rules" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tax_rules_org" ON "tax_rules" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_events_code" ON "calendar_events" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_events_org" ON "calendar_events" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_events_date" ON "calendar_events" ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branch_acc_settings_org_branch" ON "branch_accounting_settings" ("organization_id","branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branch_inv_settings_org_branch" ON "branch_inventory_settings" ("organization_id","branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branch_ntf_settings_org_branch" ON "branch_notification_settings" ("organization_id","branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branch_pos_settings_org_branch" ON "branch_pos_settings" ("organization_id","branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branch_prc_settings_org_branch" ON "branch_pricing_settings" ("organization_id","branch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_branch_prn_settings_org_branch" ON "branch_printing_settings" ("organization_id","branch_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branches" ADD CONSTRAINT "branches_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_current_branch_id_branches_id_fk" FOREIGN KEY ("current_branch_id") REFERENCES "branches"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_refresh_token_id_auth_tokens_id_fk" FOREIGN KEY ("refresh_token_id") REFERENCES "auth_tokens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "barcode_settings" ADD CONSTRAINT "barcode_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "barcode_settings" ADD CONSTRAINT "barcode_settings_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gold_rate_settings" ADD CONSTRAINT "gold_rate_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gold_rate_settings" ADD CONSTRAINT "gold_rate_settings_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_settings" ADD CONSTRAINT "invoice_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_settings" ADD CONSTRAINT "invoice_settings_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "countries" ADD CONSTRAINT "countries_default_currency_id_currencies_id_fk" FOREIGN KEY ("default_currency_id") REFERENCES "currencies"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "countries" ADD CONSTRAINT "countries_default_timezone_id_timezones_id_fk" FOREIGN KEY ("default_timezone_id") REFERENCES "timezones"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "measurement_units" ADD CONSTRAINT "measurement_units_base_unit_id_measurement_units_id_fk" FOREIGN KEY ("base_unit_id") REFERENCES "measurement_units"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metal_purity_mapping" ADD CONSTRAINT "metal_purity_mapping_metal_id_metals_id_fk" FOREIGN KEY ("metal_id") REFERENCES "metals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metal_purity_mapping" ADD CONSTRAINT "metal_purity_mapping_purity_id_purities_id_fk" FOREIGN KEY ("purity_id") REFERENCES "purities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hallmark_centers" ADD CONSTRAINT "hallmark_centers_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "product_categories"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_attribute_mapping" ADD CONSTRAINT "category_attribute_mapping_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_attribute_mapping" ADD CONSTRAINT "category_attribute_mapping_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_tax_category_id_tax_categories_id_fk" FOREIGN KEY ("tax_category_id") REFERENCES "tax_categories"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
