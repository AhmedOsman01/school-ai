import type { IWebhookPayload } from "@/types";

const N8N_WEBHOOK_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || "http://localhost:5678/webhook";

type WebhookEndpoint =
  | "attendance-alert"
  | "invoice-reminder"
  | "exam-result"
  | "bus-absence"
  | "low-wallet-balance";

/**
 * Trigger an n8n webhook with structured payload
 */
export async function triggerN8nWebhook(
  endpoint: WebhookEndpoint,
  payload: IWebhookPayload
): Promise<{ success: boolean; error?: string }> {
  const url = `${N8N_WEBHOOK_BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_API_KEY
          ? { Authorization: `Bearer ${process.env.N8N_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n webhook error [${endpoint}]:`, errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`n8n webhook failed [${endpoint}]:`, message);
    return { success: false, error: message };
  }
}

/**
 * WhatsApp Business API message sender (template-based)
 */
export async function sendWhatsAppMessage(params: {
  to: string;
  templateName: string;
  languageCode: string;
  components?: Record<string, unknown>[];
}): Promise<{ success: boolean; error?: string }> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiUrl || !token || !phoneNumberId) {
    console.warn("WhatsApp API not configured");
    return { success: false, error: "WhatsApp API not configured" };
  }

  try {
    const response = await fetch(
      `${apiUrl}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: params.to,
          type: "template",
          template: {
            name: params.templateName,
            language: { code: params.languageCode },
            components: params.components || [],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
