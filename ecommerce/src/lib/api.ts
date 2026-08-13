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

export interface EventTrackingResponse {
  processed: boolean;
  duplicate: boolean;
  noise: boolean;
  reason?: string;
  journeyId?: number;
  touchpointId?: number;
}

export async function sendRawEvent(
  event: RawEventCreateRequest,
  options?: { keepalive?: boolean }
): Promise<EventTrackingResponse | null> {
  const payload = {
    ...event,
    requireSession: false,
  };
  // Strip null values to avoid Java deserialization issues with primitive types
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== null)
  );

  try {
    const response = await fetch(`${API_BASE_URL}/api/raw-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanPayload),
      keepalive: options?.keepalive || false,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[API] Event tracking failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        eventType: event.eventType,
      });
      return null;
    }

    const result = await response.json() as EventTrackingResponse;

    if (result.duplicate) {
      console.debug('[API] Duplicate event detected:', event.eventType);
    } else if (result.noise) {
      console.debug('[API] Event marked as noise:', event.eventType, result.reason);
    } else if (result.processed) {
      console.debug('[API] Event processed successfully:', event.eventType, {
        journeyId: result.journeyId,
        touchpointId: result.touchpointId,
      });
    }

    return result;
  } catch (err) {
    console.error('[API] Network error sending event:', err);
    return null;
  }
}
