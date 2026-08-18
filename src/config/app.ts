import { env } from "@/utility/env";

export const host = env("host", "localhost");
export const port = Number(env("port", "3000"));

export const b1User = env("b1_user", "b1_user");
export const b1Password = env("b1_password", "b1_password");

export const b1UrlInventory = env("b1_url_inventory", "b1_url_inventory");
export const b1UrlDepartments = env("b1_url_departments", "b1_url_departments");
export const b1UrlIssues = env("b1_url_issues", "b1_url_issues");
// eslint-disable-next-line max-len
export const b1UrlPropertyTypes = env(
  "b1_url_property_types",
  "b1_url_property_types",
);
export const b1UrlProjects = env("b1_url_projects", "b1_url_projects");
// eslint-disable-next-line max-len
export const b1UrlProjectsUnits = env(
  "b1_url_projects_units",
  "b1_url_projects_units",
);
export const b1UrlBalances = env("b1_url_balances", "b1_url_balances");
export const b1UrlBuildings = env("b1_url_buildings", "b1_url_buildings");
export const b1UrlFloors = env("b1_url_floors", "b1_url_floors");
export const b1UrlCustomers = env("b1_url_customers", "b1_url_customers");
export const b1UrlUnits = env("b1_url_units", "b1_url_units");
export const b1UrlInvoice = env("b1_url_invoice", "b1_url_invoice");
// eslint-disable-next-line max-len
export const b1UrlPostInvoice = env(
  "b1_url_post_invoice",
  "b1_url_post_invoice",
);
// eslint-disable-next-line max-len
export const b1UrlSalespersons = env(
  "b1_url_salespersons",
  "b1_url_salespersons",
);
export const b1UrlCustomerCodeByUnit = env(
  "b1_url_customer_code_by_unit",
  "b1_url_customer_code_by_unit",
);
export const b1UrlDocNumByDocEntry = env(
  "b1_url_docnum_by_docentry",
  "b1_url_docnum_by_docentry",
);

export const mailHost = env("mail_host", "mail_host");
export const mailPort = env("mail_port", "mail_port");
export const mailUser = env("mail_user", "mail_user");
export const mailPassword = env("mail_password", "mail_password");

export const dbEngine = env("DB_ENGINE", "json");
export const dbUrl = env("DB_URL", "mongodb://localhost:27017/EmpireDB");

export const pgHost = env("PG_HOST", "localhost");
export const pgPort = Number(env("PG_PORT", "5432"));
export const pgUser = env("PG_USER", "user");
export const pgPassword = env("PG_PASSWORD", "password");
export const pgDatabase = env("PG_DATABASE", "db");

export const storeId = env("FP_STOREID", "749347_617");
export const storePass = env("FP_STORE_PASSWORD", "fokwBPUq3t5aeiq");

export const fPayPaymentIpnApiUrl =
  "https://staging-apigw-merchant.fast-pay.iq/api/v1/public/pgw/payment/validate";
export const fPayPaymentInApiUrl =
  "https://staging-apigw-merchant.fast-pay.iq/api/v1/public/pgw/payment/initiation";

export const fibStatusCallbackUrl =
  // "https://c21531-empirebackendtest.cloudiax.com/payments/confirmStatus";
  "https://localhost:5000/payments/confirmStatus";
export const fibInvoiceStatusCallbackUrl =
  "https://localhost:5000/invoices-payments";
export const cronTimeConfig = "*/3 * * * *";

// export const hyperPayEntityId = env(
//   "HYPERPAY_ENTITY_ID",
//   "8a8294174d0595bb014d05d829cb01cd",
// );
// export const hyperPayAccessToken = env(
//   "HYPERPAY_ACCESS_TOKEN",
//   "OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA==",
// );
// export const hyperPayEnvironment = env("HYPERPAY_ENVIRONMENT", "live");
// export const hyperPayTestUrl = "https://eu-test.oppwa.com/v1";
// export const hyperPayProdUrl = "https://eu-prod.oppwa.com/v1";
// export const hyperPayStatusCallbackUrl = env(
//   "HYPERPAY_CALLBACK_URL",
//   "https://c21531-empirebackendtest.cloudiax.com/hyperpay/status",
// );
// export const hyperPayResultUrl = env(
//   "HYPERPAY_RESULT_URL",
//   "http://localhost:5000/payment/result",
// );

export const hyperPayEntityId = env(
  "HYPERPAY_ENTITY_ID",
  "8acda4cc9e1b7d22019e2119dfa323c0",
);
export const hyperPayAccessToken = env(
  "HYPERPAY_ACCESS_TOKEN",
  "OGFjZGE0ZDk5ZTFiNTU1MzAxOWUyMTE5ODMxODBlMDV8R1VMU1BwdCNhRmRKcTg5Mm0jWng=",
);
export const hyperPayEnvironment = env("HYPERPAY_ENVIRONMENT", "live");
export const hyperPayTestUrl = "https://eu-test.oppwa.com/v1";
export const hyperPayProdUrl = "https://eu-prod.oppwa.com/v1";
export const hyperPayStatusCallbackUrl = env(
  "HYPERPAY_CALLBACK_URL",
  "https://c21531-empirebackendlive.cloudiax.com/hyperpay/status",
);

// -- Test credentials for HyperPay --

//exports.hyperPayEntityId = (0, env_1.env)("HYPERPAY_ENTITY_ID", "8ac7a4c997c90e1b0197cad1b68e0310");
//exports.hyperPayAccessToken = (0, env_1.env)("HYPERPAY_ACCESS_TOKEN", "OGFjN2E0Yzk5N2M5MGUxYjAxOTdjYWQxNGYyZjAzMGN8TiM6OT1MMzdoNTJQcWJpNHplc1o=");
//exports.hyperPayEnvironment = (0, env_1.env)("HYPERPAY_ENVIRONMENT", "test");
//exports.hyperPayTestUrl = "https://eu-test.oppwa.com/v1";
//exports.hyperPayProdUrl = "https://eu-prod.oppwa.com/v1";
//exports.hyperPayStatusCallbackUrl = (0, env_1.env)("HYPERPAY_CALLBACK_URL", "https://c21531-empirebackendtest.cloudiax.com/hyperpay/status");

// -- Live credentials for HyperPay --

// exports.hyperPayEntityId = env("HYPERPAY_ENTITY_ID", "8acda4cc9e1b7d22019e2119dfa323c0");
// exports.hyperPayAccessToken = env("HYPERPAY_ACCESS_TOKEN", "OGFjZGE0ZDk5ZTFiNTU1MzAxOWUyMTE5ODMxODBlMDV8R1VMU1BwdCNhRmRKcTg5Mm0jWng=");
// exports.hyperPayEnvironment = env("HYPERPAY_ENVIRONMENT", "live");
// exports.hyperPayTestUrl = "https://eu-test.oppwa.com/v1";
// exports.hyperPayProdUrl = "https://eu-prod.oppwa.com/v1";
// exports.hyperPayStatusCallbackUrl = env("HYPERPAY_CALLBACK_URL", "https://c21531-empirebackendlive.cloudiax.com/hyperpay/status");

export const runMigrations = true;
