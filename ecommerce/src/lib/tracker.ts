import { v4 as uuidv4 } from 'uuid';
import type { RawEventCreateRequest } from '../types';
import { sendRawEvent } from './api';

const ANONYMOUS_ID_KEY = 'ecommerce_anonymous_id';
const SESSION_ID_KEY = 'ecommerce_session_id';
const CUSTOMER_ID_KEY = 'ecommerce_customer_id';
const CUSTOMER_EMAIL_KEY = 'ecommerce_customer_email';

function getOrCreateId(key: string): string {
  let id = localStorage.getItem(key);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(key, id);
  }
  return id;
}

function getAnonymousId(): string {
  return getOrCreateId(ANONYMOUS_ID_KEY);
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

function getCustomerId(): number | null {
  const id = localStorage.getItem(CUSTOMER_ID_KEY);
  return id ? parseInt(id, 10) : null;
}

function getCustomerEmail(): string | null {
  return localStorage.getItem(CUSTOMER_EMAIL_KEY);
}

export function setCustomerIdentity(customerId: number, email: string): void {
  localStorage.setItem(CUSTOMER_ID_KEY, String(customerId));
  localStorage.setItem(CUSTOMER_EMAIL_KEY, email);
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android.*mobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

function getSource(): string {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  if (utmSource) return utmSource;

  const referrer = document.referrer;
  if (!referrer) return 'direct';
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook') || referrer.includes('fb.com')) return 'facebook';
  if (referrer.includes('twitter') || referrer.includes('t.co')) return 'twitter';
  return 'referral';
}

function getMedium(): string {
  const params = new URLSearchParams(window.location.search);
  const utmMedium = params.get('utm_medium');
  if (utmMedium) return utmMedium;

  const source = getSource();
  if (source === 'direct') return 'none';
  if (source === 'google') return 'organic';
  return 'referral';
}

function getCampaignName(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_campaign') || 'Default Campaign';
}

export function track(eventType: string, payload: Record<string, any> = {}): void {
  try {
    const event: RawEventCreateRequest = {
      customerId: getCustomerId(),
      anonymousId: getAnonymousId(),
      email: getCustomerEmail(),
      sessionId: getSessionId(),
      eventType,
      occurredAt: new Date().toISOString(),
      sourceSystem: 'web-storefront',
      source: getSource(),
      medium: getMedium(),
      campaignName: getCampaignName(),
      pageUrl: window.location.href,
      device: getDevice(),
      browser: getBrowser(),
      ipAddress: null,
      country: null,
      region: null,
      rawPayload: payload,
      eventKey: uuidv4(),
      durationSeconds: null,
    };

    sendRawEvent(event).catch((err) => {
      console.warn('[Tracker] Failed to send event:', err.message);
    });
  } catch (err) {
    console.warn('[Tracker] Error creating event:', err);
  }
}

// Bounce detection: fires if user leaves within 5 seconds without interaction
let hasInteracted = false;
let pageLoadTime = Date.now();

function markInteraction() {
  hasInteracted = true;
}

export function initBounceDetection(): void {
  hasInteracted = false;
  pageLoadTime = Date.now();

  window.addEventListener('click', markInteraction, { once: true });
  window.addEventListener('scroll', markInteraction, { once: true });
  window.addEventListener('keydown', markInteraction, { once: true });

  window.addEventListener('beforeunload', () => {
    const timeOnPage = (Date.now() - pageLoadTime) / 1000;
    if (!hasInteracted && timeOnPage <= 5) {
      track('BOUNCE', { timeOnPageSeconds: timeOnPage });
    }
  });
}
