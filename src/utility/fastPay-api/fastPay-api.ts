import axios from "axios";
import { Result } from "@/utility/result";
import { fPayPaymentInApiUrl, fPayPaymentIpnApiUrl } from "@/config/app";
import { storeId } from "@/config/app";
import { storePass } from "@/config/app";

type CreatePaymentOptions = {
  store_id: string;
  store_password: string;
  order_id: string;
  bill_amount: number;
  currency: string;
  cart: string;
};

type paymentStatusResponseData = {
  code: number;
  messages: string[];
  data: {
    gw_transaction_id: string;
    merchant_order_id: string;
    received_amount: string;
    currency: string;
    customer_name: string;
    customer_mobile_number: string;
    at: string;
    transaction_id: string;
    order_id: string;
    customer_account_no: string;
    status: string;
    received_at: string;
  };
};

type CheckPaymentOptions = {
  order_id: string;
  store_id: string;
  store_password: string;
};

export class FastPayApi {
  private static async _createPayment(
    options: CreatePaymentOptions
  ): Promise<Result<unknown, unknown>> {
    try {
      const response = await axios.request({
        url: fPayPaymentInApiUrl,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: options,
        timeout: 5000,
      });

      if (response.data.code === 404) {
        return Result.fail(response.data.message);
      }

      if (response.data.code === 422) {
        return Result.fail(response.data.message);
      }

      return Result.ok(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  public static async createPayment(
    options: CreatePaymentOptions
  ): Promise<Result<unknown, unknown>> {
    try {
      const paymentDataResult = await FastPayApi._createPayment({
        ...options,
      });

      return paymentDataResult;
    } catch (error: unknown) {
      return Result.fail(error);
    }
  }

  private static async _checkStatus(
    options: CheckPaymentOptions
  ): Promise<Result<paymentStatusResponseData, unknown>> {
    try {
      const response = await axios.request({
        url: fPayPaymentIpnApiUrl,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: { ...options },
      });

      return Result.ok(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return Result.fail(error.response.data);
      }
      return Result.fail(error);
    }
  }

  public static async CheckStatus(
    id: string
  ): Promise<Result<paymentStatusResponseData, unknown>> {
    try {
      const paymentDataResult = await FastPayApi._checkStatus({
        order_id: id,
        store_id: storeId,
        store_password: storePass,
      });
      return paymentDataResult;
    } catch (error: unknown) {
      return Result.fail(error);
    }
  }
}
