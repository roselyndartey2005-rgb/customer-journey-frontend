import type { CustomerAuthRequest, CustomerAuthResponse, RawEventCreateRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function loginCustomer(data: CustomerAuthRequest): Promise<CustomerAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status}`);
  }

  return response.json();
}

export async function sendRawEvent(event: RawEventCreateRequest): Promise<void> {
  const payload = {
    ...event,
    requireSession: false,
  };
  // Strip null values to avoid Java deserialization issues with primitive types
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== null)
  );
  await fetch(`${API_BASE_URL}/api/raw-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cleanPayload),
  });
}
