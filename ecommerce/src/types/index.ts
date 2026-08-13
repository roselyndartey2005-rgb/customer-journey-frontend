export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string;
}

export type Category = 'Electronics' | 'Clothing' | 'Home & Living' | 'Accessories';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerAuthRequest {
  name: string;
  email: string;
}

export interface CustomerAuthResponse {
  customerId: number;
  name: string;
  email: string;
  newCustomer: boolean;
}

export interface CustomerInfo {
  customerId: number | null;
  name: string;
  email: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface RawEventCreateRequest {
  customerId: number | null;
  anonymousId: string;
  email: string | null;
  sessionId: string;
  eventType: string;
  occurredAt: string;
  sourceSystem: 'web-storefront';
  source: string;
  medium: string;
  campaignName: string | null;
  pageUrl: string;
  device: string;
  browser: string;
  ipAddress: null;
  country: null;
  region: null;
  rawPayload: Record<string, any>;
  eventKey: string;
  durationSeconds: number | null;
}

export interface EventTrackingResponse {
  processed: boolean;
  duplicate: boolean;
  noise: boolean;
  reason?: string;
  journeyId?: number;
  touchpointId?: number;
}
