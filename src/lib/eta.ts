/**
 * ETA Egypt e-Invoicing Service
 * 
 * Integration point for the Egyptian Tax Authority's
 * electronic invoicing system.
 * 
 * Reference: https://sdk.invoicing.eta.gov.eg/
 */

interface ETAInvoiceDocument {
  header: {
    uuid: string;
    dateTimeIssued: string;
    taxpayerActivityCode: string;
    internalID: string;
  };
  issuer: {
    type: "B" | "P" | "F";
    id: string;
    name: string;
    address: {
      country: string;
      governate: string;
      regionCity: string;
      street: string;
      buildingNumber: string;
    };
  };
  receiver: {
    type: "B" | "P" | "F";
    id?: string;
    name: string;
    address: {
      country: string;
      governate: string;
      regionCity: string;
      street: string;
    };
  };
  invoiceLines: {
    description: string;
    itemType: string;
    itemCode: string;
    unitType: string;
    quantity: number;
    salesTotal: number;
    total: number;
    valueDifference: number;
    totalTaxableFees: number;
    netTotal: number;
    itemsDiscount: number;
    unitValue: {
      currencySold: string;
      amountEGP: number;
    };
    discount: {
      rate: number;
      amount: number;
    };
    taxableItems: {
      taxType: string;
      amount: number;
      subType: string;
      rate: number;
    }[];
  }[];
  totalSalesAmount: number;
  totalDiscountAmount: number;
  netAmount: number;
  totalAmount: number;
  extraDiscountAmount: number;
  totalItemsDiscountAmount: number;
}

/**
 * Submit invoice to ETA
 */
export async function submitToETA(
  invoiceDoc: ETAInvoiceDocument
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  const apiUrl = process.env.ETA_API_URL;
  const clientId = process.env.ETA_CLIENT_ID;
  const clientSecret = process.env.ETA_CLIENT_SECRET;

  if (!apiUrl || !clientId || !clientSecret) {
    console.warn("ETA e-Invoicing not configured");
    return { success: false, error: "ETA not configured" };
  }

  try {
    // Step 1: Get access token
    const tokenRes = await fetch(`${apiUrl}/connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "InvoicingAPI",
      }),
    });

    if (!tokenRes.ok) {
      return { success: false, error: "Failed to authenticate with ETA" };
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Submit document
    const submitRes = await fetch(
      `${apiUrl}/api/v1/documentsubmissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          documents: [invoiceDoc],
        }),
      }
    );

    if (!submitRes.ok) {
      const errorText = await submitRes.text();
      return { success: false, error: `ETA submission failed: ${errorText}` };
    }

    const submitData = await submitRes.json();
    return {
      success: true,
      submissionId: submitData.submissionId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "ETA error",
    };
  }
}

/**
 * Generate QR code data for ETA-compliant invoices
 */
export function generateETAQrData(params: {
  sellerName: string;
  sellerTaxId: string;
  invoiceDate: string;
  totalAmount: number;
  taxAmount: number;
}): string {
  // TLV encoding as per ETA specifications
  const encoder = new TextEncoder();
  const fields = [
    { tag: 1, value: params.sellerName },
    { tag: 2, value: params.sellerTaxId },
    { tag: 3, value: params.invoiceDate },
    { tag: 4, value: params.totalAmount.toFixed(2) },
    { tag: 5, value: params.taxAmount.toFixed(2) },
  ];

  const tlvBuffers = fields.map((field) => {
    const valueBytes = encoder.encode(field.value);
    return new Uint8Array([
      field.tag,
      valueBytes.length,
      ...valueBytes,
    ]);
  });

  const totalLength = tlvBuffers.reduce((sum, buf) => sum + buf.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of tlvBuffers) {
    combined.set(buf, offset);
    offset += buf.length;
  }

  // Base64 encode
  return btoa(String.fromCharCode(...combined));
}
