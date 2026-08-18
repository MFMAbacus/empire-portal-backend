import axios from "axios";

import { Result } from "@/utility/result";
import { PaymentStatusResponse } from "@/services/check-fib-payment-status";

// -- Live URLs --
// const authenticationUrl = `https://fib.prod.fib.iq/auth/realms/fib-online-shop/protocol/openid-connect/token`;
// const createPaymentUrl = `https://fib.prod.fib.iq/protected/v1/payments`;
// const checkPaymentStatusUrl = `https://fib.prod.fib.iq/protected/v1/payments`;

// -- Test URLs --
const authenticationUrl = `https://fib-stage.fib.iq/auth/realms/fib-online-shop/protocol/openid-connect/token`;
const createPaymentUrl = `https://fib-stage.fib.iq/protected/v1/payments`;
const checkPaymentStatusUrl = `https://fib-stage.fib.iq/protected/v1/payments`;

type CreatePaymentOptions = {
  accessToken: string;
  amount: string;
  currency: string;
  description: string;
  ID: string;
  statusCallbackUrl: string;
};

type CheckPaymentStatusOptions = {
  accessToken: string;
  id: string;
};
type CheckPaymentOptions = {
  accessToken: string;
  paymentId: string;
};

export class FibApi {
  public static async authenticate(): Promise<Result<string, unknown>> {
    try {
      const response = await axios.request({
        url: authenticationUrl,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        data: new URLSearchParams({
          // -- Live Credentials --
          // grant_type: "client_credentials",
          // client_id: "pg-empire",
          // client_secret: "249a609a-4e74-44f5-aa25-f6d55f75b7a5",

          // -- Test Credentials --
          grant_type: "client_credentials",
          client_id: "falcon-group-test-payment",
          client_secret: "9904dfbd-b087-439c-88ea-73517e6a8ded",
        }),
      });
      return Result.ok(response.data.access_token);
    } catch (error: unknown) {
      console.log("FIB Authentication error==>", error);
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  private static async _checkStatus(
    options: CheckPaymentStatusOptions,
  ): Promise<Result<PaymentStatusResponse, unknown>> {
    try {
      const response = await axios.request({
        url: `${checkPaymentStatusUrl}/${options.id}/status`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return Result.ok(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  private static async _createPayment(
    options: CreatePaymentOptions,
  ): Promise<Result<unknown, unknown>> {
    try {
      console.log("bhai token length dekho:", options.accessToken.length);
      console.log("bhai token dekho:", `Bearer ${options.accessToken}`);

      // --- Payload pakarne ke liye ye log dalein ---
      const payload = {
        monetaryValue: {
          amount: options.amount,
          currency: options.currency,
        },
        statusCallbackUrl: options.statusCallbackUrl,
        description: options.description,
      };

      console.log(
        "🚀 DEBUG: FIB Request Payload ==>",
        JSON.stringify(payload, null, 2),
      );
      console.log("🔗 DEBUG: Requesting URL ==>", createPaymentUrl);
      // --------------------------------------------

      const response = await axios.request({
        url: createPaymentUrl,
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: payload,
      });

      return Result.ok(response.data);
    } catch (error: unknown) {
      console.log("FIB Create Payment Error==>", error);
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  public static async createPayment(
    options: Omit<CreatePaymentOptions, "accessToken">,
  ): Promise<Result<unknown, unknown>> {
    try {
      const accessTokenResult = await FibApi.authenticate();
      if (accessTokenResult.hasFailed()) {
        return accessTokenResult;
      }
      const paymentDataResult = await FibApi._createPayment({
        ...options,
        accessToken: accessTokenResult.getValue(),
      });
      return paymentDataResult;
    } catch (error: unknown) {
      return Result.fail(error);
    }
  }

  public static async checkStatus(
    id: string,
  ): Promise<Result<PaymentStatusResponse, unknown>> {
    try {
      const accessTokenResult = await FibApi.authenticate();
      if (accessTokenResult.hasFailed()) {
        return Result.fail("auth token failed");
      }
      const payemntStatusResult = await FibApi._checkStatus({
        id,
        accessToken: accessTokenResult.getValue(),
      });
      return payemntStatusResult;
    } catch (error) {
      return Result.fail(error);
    }
  }

  public static async _checkPayment(
    options: CheckPaymentOptions,
  ): Promise<Result<unknown, unknown>> {
    try {
      const response = await axios.request({
        url: `https://fib-stage.fib.iq/protected/v1/payments/${options.paymentId}/status`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return Result.ok(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  public static async checkPayment(
    paymentId: string,
  ): Promise<Result<unknown, unknown>> {
    try {
      const accessTokenResult = await FibApi.authenticate();
      if (accessTokenResult.hasFailed()) {
        return accessTokenResult;
      }
      console.log(accessTokenResult);

      const paymentDataResult = await FibApi._checkPayment({
        paymentId,
        accessToken: accessTokenResult.getValue(),
      });
      return paymentDataResult;
    } catch (error: unknown) {
      return Result.fail(error);
    }
  }
}
