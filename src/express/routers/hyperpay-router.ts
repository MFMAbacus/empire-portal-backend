import express from "express";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
import { hyperPayPaymentService } from "@/services/hyperpay-payment-service";
import { hyperPayStatusService } from "@/services/hyperpay-status-service";

export const hyperPayRouter = express.Router();

hyperPayRouter.post("/checkout", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await hyperPayPaymentService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

hyperPayRouter.get("/status/:checkoutId", async (request, response, next) => {
  try {
    const { checkoutId } = request.params;
    const result = await hyperPayStatusService.execute({ checkoutId });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

hyperPayRouter.post("/status", async (request, response, next) => {
  try {
    const { resourcePath } = request.body;
    const result = await hyperPayStatusService.execute({ resourcePath });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

hyperPayRouter.get("/status", async (request, response, next) => {
  try {
    const { resourcePath, checkoutId } = request.query;
    const result = await hyperPayStatusService.execute({
      resourcePath: resourcePath as string,
      checkoutId: checkoutId as string,
    });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// Payment result endpoint (temporary for web testing - will be removed for mobile)
hyperPayRouter.get("/result", async (request, response, next) => {
  try {
    const { resourcePath } = request.query;
    
    // Simple HTML response showing the result
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Result</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .success { color: green; }
            .info { color: blue; }
        </style>
    </head>
    <body>
        <h1>🎉 Payment Completed</h1>
        <p class="info">Resource Path: <code>${resourcePath || 'Not provided'}</code></p>
        <p class="success">✅ You can close this window and check the payment status in your test page.</p>
        <p><small>This window will auto-close in 3 seconds...</small></p>
        <script>
            // Auto-close after 3 seconds
            setTimeout(() => {
                if (window.opener) {
                    window.close();
                } else {
                    document.body.innerHTML += '<p><strong>Please close this tab manually.</strong></p>';
                }
            }, 3000);
        </script>
    </body>
    </html>
    `;
    
    response.setHeader('Content-Type', 'text/html');
    response.send(html);
  } catch (error: unknown) {
    next(error);
  }
});
