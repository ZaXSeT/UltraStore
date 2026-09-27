/**
 * UltraStore Module Contracts & Boundaries
 * Defines domain entities, lifecycle status unions, and module service interfaces.
 */

export * from "../lib/types.ts";

import type {
  Product,
  ProductVariant,
  Offer,
  PreorderBatch,
  StockBalance,
  Order,
  CartItem,
  ShippingAddress,
  PaymentAttempt,
  OfferType,
  OrderStatus,
  AllocationStatus,
  FulfillmentStatus,
  PaymentStatus,
  BatchStatus,
} from "../lib/types.ts";

/**
 * Catalog Module Contract
 * Owns product definitions, variants, brands, categories, and published offers.
 */
export interface ICatalogModule {
  getAllProducts(categorySlug?: string, offerFilter?: string): Promise<Product[]> | Product[];
  getProductBySlug(slug: string): Promise<Product | null> | Product | null;
  getPreorderBatchBySlug(slug: string): Promise<PreorderBatch | null> | PreorderBatch | null;
}

/**
 * Inventory Module Contract
 * Owns stock balances, reservation lifecycle, and preorder quota commits.
 */
export interface IInventoryModule {
  getBalance(variantId: string): Promise<StockBalance | null> | StockBalance | null;
  reserveStock(variantId: string, quantity: number, referenceId: string): Promise<boolean> | boolean;
  releaseStock(variantId: string, quantity: number, referenceId: string): Promise<boolean> | boolean;
  allocateStock(variantId: string, quantity: number, referenceId: string): Promise<boolean> | boolean;
  reservePreorderQuota(batchId: string, quantity: number): Promise<boolean> | boolean;
  commitPreorderQuota(batchId: string, quantity: number): Promise<boolean> | boolean;
}

/**
 * Order Module Contract
 * Owns cart group checkout, order states, and guest order lookup.
 */
export interface IOrderModule {
  createOrder(params: {
    groupKey: string;
    offerType: OfferType;
    batchId?: string | null;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    items: Array<{
      variantId: string;
      productName: string;
      variantName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
    }>;
    shippingFee: number;
  }): Promise<Order> | Order;
  getOrderByReference(reference: string, guestAccessToken?: string): Promise<Order | null> | Order | null;
  updateOrderStatus(orderId: string, status: OrderStatus, fulfillmentStatus?: FulfillmentStatus): Promise<void> | void;
}

/**
 * Payment Module Contract
 * Owns payment attempt lifecycle, provider integration, and webhook idempotency.
 */
export interface IPaymentModule {
  createPaymentAttempt(orderId: string, provider: "midtrans" | "mock_sandbox"): Promise<PaymentAttempt> | PaymentAttempt;
  handleWebhookNotification(payload: Record<string, unknown>, signature: string): Promise<{ handled: boolean; orderId?: string; status?: PaymentStatus }>;
}

/**
 * Shipping Module Contract
 * Calculates shipping rates from store origin and tracks fulfillment.
 */
export interface IShippingModule {
  calculateRate(destinationCity: string, weightGrams: number): Promise<number> | number;
}
