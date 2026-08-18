import axios from "axios";
import { Result } from "@/utility/result";
import {
  hyperPayEntityId,
  hyperPayAccessToken,
  hyperPayEnvironment,
  hyperPayTestUrl,
  hyperPayProdUrl,
  // hyperPayResultUrl,
} from "@/config/app";

type CreateCheckoutOptions = {
  amount: string;
  currency: string;
  merchantTransactionId: string;
  customerEmail?: string;
  customerName?: string;
  description?: string;
};

type CheckoutResponse = {
  id: string;
  result: {
    code: string;
    description: string;
  };
  script_url?: string;
  buildNumber: string;
  timestamp: string;
  ndc: string;
};

type PaymentStatusOptions = {
  checkoutId?: string;
  resourcePath?: string;
};

type PaymentStatusResponse = {
  id: string;
  paymentType: string;
  paymentBrand: string;
  amount: string;
  currency: string;
  descriptor?: string;
  merchantTransactionId: string;
  result: {
    code: string;
    description: string;
  };
  resultDetails?: {
    ExtendedDescription: string;
    AuthCode: string;
    clearingInstituteName: string;
  };
  card?: {
    bin: string;
    last4Digits: string;
    holder: string;
    expiryMonth: string;
    expiryYear: string;
  };
  customParameters: Record<string, any>;
  risk: Record<string, any>;
  buildNumber: string;
  timestamp: string;
  ndc: string;
};

export class HyperPayApi {
  private static getBaseUrl(): string {
    return hyperPayEnvironment === "live" ? hyperPayProdUrl : hyperPayTestUrl;
  }

  private static getHeaders() {
    return {
      Authorization: `Bearer ${hyperPayAccessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };
  }

  private static buildCheckoutParams(
    options: CreateCheckoutOptions,
  ): URLSearchParams {
    const params = new URLSearchParams();

    // Required parameters
    params.append("entityId", hyperPayEntityId);
    params.append("amount", options.amount);
    params.append("currency", options.currency);
    params.append("paymentType", "DB"); // Debit transaction
    params.append("merchantTransactionId", options.merchantTransactionId);

    // Optional parameters
    if (options.customerEmail) {
      params.append("customer.email", options.customerEmail);
    }

    if (options.customerName) {
      const nameParts = options.customerName.split(" ");
      params.append("customer.givenName", nameParts[0] || "Customer");
      params.append(
        "customer.surname",
        nameParts.slice(1).join(" ") || "Customer",
      );
    }

    if (options.description) {
      params.append("descriptor", options.description);
    }

    // Enable 3DS for better security
    params.append("customParameters[3DS2_enrolled]", "true");

    // Don't set paymentBrand - let HyperPay handle it automatically
    // params.append("paymentBrand", "VISA");

    return params;
  }

  public static async createCheckout(
    options: CreateCheckoutOptions,
  ): Promise<Result<CheckoutResponse, unknown>> {
    try {
      const url = `${this.getBaseUrl()}/checkouts`;
      const headers = this.getHeaders();
      const data = this.buildCheckoutParams(options);

      const response = await axios.request({
        url,
        method: "POST",
        headers,
        data: data.toString(),
        timeout: 10000,
      });

      // Check if checkout was created successfully
      if (response.data.result && response.data.result.code) {
        const code = response.data.result.code;

        if (code === "000.200.100") {
          return Result.ok(response.data);
        } else {
          return Result.fail({
            code,
            description: response.data.result.description,
            data: response.data,
          });
        }
      }

      return Result.ok(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  public static async checkPaymentStatus(
    options: PaymentStatusOptions,
  ): Promise<Result<PaymentStatusResponse, unknown>> {
    try {
      let url: string;

      if (options.resourcePath) {
        // Use resource path from mobile SDK callback
        url = `${this.getBaseUrl()}${
          options.resourcePath
        }?entityId=${hyperPayEntityId}`;
      } else if (options.checkoutId) {
        // Use checkout ID to check status
        url = `${this.getBaseUrl()}/checkouts/${
          options.checkoutId
        }/payment?entityId=${hyperPayEntityId}`;
      } else {
        return Result.fail(
          "Either checkoutId or resourcePath must be provided",
        );
      }

      console.log("Checking payment status with URL:", url);

      const response = await axios.request({
        url,
        method: "GET",
        headers: {
          Authorization: `Bearer ${hyperPayAccessToken}`,
          Accept: "application/json",
        },
        timeout: 10000,
      });

      return Result.ok(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  // Helper methods to interpret HyperPay result codes
  public static isPaymentSuccessful(resultCode: string): boolean {
    return (
      resultCode.startsWith("000.000.") || resultCode.startsWith("000.100.")
    );
  }

  public static isPaymentPending(resultCode: string): boolean {
    return (
      resultCode.startsWith("000.200.") || resultCode.startsWith("800.400.")
    );
  }

  public static isPaymentFailed(resultCode: string): boolean {
    return (
      resultCode.startsWith("100.4") ||
      resultCode.startsWith("800.1") ||
      resultCode.startsWith("900.4")
    );
  }

  public static getPaymentStatus(
    resultCode: string,
  ): "PAID" | "PENDING" | "DECLINED" {
    if (this.isPaymentSuccessful(resultCode)) {
      return "PAID";
    } else if (this.isPaymentPending(resultCode)) {
      return "PENDING";
    } else {
      return "DECLINED";
    }
  }
}
