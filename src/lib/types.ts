export type OfferType = "READY" | "PREORDER";

export type OrderStatus = "pending_payment" | "confirmed" | "on_hold" | "cancelled" | "completed";
export type AllocationStatus = "reserved" | "committed_po" | "allocated_stock" | "released" | "consumed" | "exception";
export type FulfillmentStatus = "unallocated" | "waiting_supplier" | "received_qc" | "ready_to_ship" | "shipped" | "delivered" | "returned";
export type PaymentStatus = "created" | "pending" | "succeeded" | "failed" | "expired" | "cancelled";
export type BatchStatus = "draft" | "scheduled" | "open" | "closed" | "inbound" | "received" | "completed" | "cancelled";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  country?: string;
  officialUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductMedia {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  aspectRatio: string;
  viewAngle?: string;
  permissionStatus: "verified" | "pending" | "editorial_mock";
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  manufacturerPartNumber?: string | null;
  attributes: Record<string, string>; // e.g. { layout: "ANSI", switch: "Banana", color: "Carbon Black" }
  price: number; // Final variant price in integer IDR
  weightGrams: number;
  media: ProductMedia[];
}

export interface Offer {
  id: string;
  variantId: string;
  offerType: OfferType;
  price: number; // Integer IDR
  status: "active" | "closed" | "sold_out";
  batchId?: string | null;
  estimatedShipping?: string | null; // e.g. "12–26 November 2026"
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  category: Category;
  description: string;
  specs: Record<string, string>; // e.g. { "Connectivity": "Tri-mode (2.4G/BT/Type-C)", "Polling Rate": "1000Hz" }
  boxContents: string[];
  warrantyInfo: string;
  variants: ProductVariant[];
  offers: Offer[];
  published: boolean;
  primaryImage: string;
}

export interface StockBalance {
  variantId: string;
  onHand: number;
  reserved: number;
  allocated: number;
  // Available = onHand - reserved - allocated
}

export interface PreorderBatch {
  id: string;
  slug: string;
  name: string;
  variantId: string;
  status: BatchStatus;
  quotaTotal: number;
  quotaReserved: number;
  quotaCommitted: number;
  etaRange: string;
  currentStage: "opened" | "closed" | "supplier_production" | "transit" | "qc_received" | "shipping";
  delayed: boolean;
  timelineNotes: Array<{
    date: string;
    stage: string;
    note: string;
    actor: string;
  }>;
}

export interface CartItem {
  offerId: string;
  variantId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  offerType: OfferType;
  batchId?: string | null;
  batchName?: string | null;
  etaRange?: string | null;
  image: string;
}

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  notes?: string;
}

export interface OrderGroup {
  groupKey: string; // "READY" or "PREORDER:<batchId>"
  offerType: OfferType;
  batchId?: string | null;
  batchName?: string | null;
  etaRange?: string | null;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface Order {
  id: string;
  reference: string; // e.g. "UST-20260928-89F2"
  groupKey: string;
  offerType: OfferType;
  batchId?: string | null;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
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
    totalPrice: number;
  }>;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  guestAccessToken: string;
  createdAt: string;
}

export interface PaymentAttempt {
  id: string;
  orderId: string;
  orderReference: string;
  provider: "midtrans" | "mock_sandbox";
  transactionId?: string;
  paymentType?: string;
  amount: number;
  status: PaymentStatus;
  snapToken?: string;
  redirectUrl?: string;
  qrCodeUrl?: string;
  vaNumber?: string;
  bank?: string;
  expiryTime: string;
  paidAt?: string;
}

export interface CatalogResearchItem {
  brandCanonical: string;
  officialProductName: string;
  manufacturerModel: string;
  manufacturerPartNumber: string | null;
  category: string;
  officialProductUrl: string;
  sourceImageUrl: string;
  checkedAt: string;
  usagePermissionStatus: "verified" | "pending" | "editorial_mock";
  reviewStatus: "approved" | "pending_business_data" | "rejected";
  specs: Record<string, string>;
  variants: Array<{
    name: string;
    sku: string;
    color: string;
    layout?: string;
    switchType?: string;
    imageUrl: string;
    imageVariantMatch: boolean;
  }>;
}
