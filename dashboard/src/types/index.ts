export interface JourneyResponse {
  journeyId: number;
  customerId: number;
  customerEmail: string;
  currentStageId: number;
  currentStageName: string;
  startedAt: string;
  endedAt: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}

export interface TouchpointResponse {
  touchpointId: number;
  journeyId: number;
  customerId: number;
  channelId: number;
  channelName: string;
  campaignId: number;
  stageId: number;
  stageName: string;
  touchpointType: TouchpointType;
  device: string;
  country: string;
  durationSeconds: number;
  occurredAt: string;
  noise: boolean;
}

export type TouchpointType =
  | 'PAGE_VIEW'
  | 'CLICK'
  | 'FORM_SUBMIT'
  | 'PURCHASE'
  | 'EMAIL_OPEN'
  | 'AD_IMPRESSION'
  | 'SUPPORT_CHAT'
  | 'BOUNCE'
  | 'UNKNOWN';

export interface TouchpointSummaryItem {
  touchpointType: string;
  count: number;
  percentage: number;
}

export interface TouchpointSummaryResponse {
  journeyId: number;
  totalTouchpoints: number;
  noiseTouchpoints: number;
  meaningfulTouchpoints: number;
  breakdown: TouchpointSummaryItem[];
}

export interface ConversionResponse {
  conversionId: number;
  journeyId: number;
  touchpointId: number;
  conversionType: 'SIGNUP' | 'PURCHASE' | 'SUBSCRIPTION' | 'LEAD' | 'OTHER';
  value: number;
  occurredAt: string;
}

export interface JourneyMapResponse {
  journeyId: number;
  customerId: number;
  customerEmail: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  endedAt: string | null;
  currentStageName: string;
  touchpoints: TouchpointResponse[];
  conversions: ConversionResponse[];
}

export interface FunnelStepResponse {
  stageId: number;
  stageName: string;
  sortOrder: number;
  touchpointCount: number;
  dropOffRate: number;
}

export interface ConversionFunnelResponse {
  journeyId: number;
  totalTouchpoints: number;
  filteredTouchpoints: number;
  totalConversions: number;
  conversionRate: number;
  steps: FunnelStepResponse[];
}

export interface JourneyStageResponse {
  stageId: number;
  name: string;
  sortOrder: number;
}

export interface RawEventResponse {
  eventId: number;
  customerId: number;
  sessionId: string;
  eventType: string;
  device: string;
  browser: string;
  country: string;
  region: string;
  rawPayload: Record<string, unknown>;
  sourceSystem: string;
  ingestedAt: string;
  occurredAt: string;
  eventKey: string;
  externalEventId: string;
}

export interface AuthenticationResponse {
  username: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface JourneyCreateRequest {
  customerId: number;
  currentStageId: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}

export interface JourneyUpdateRequest {
  currentStageId?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}

export interface TouchpointCreateRequest {
  customerId: number;
  channelId: number;
  campaignId: number;
  stageId: number;
  rawEventId?: number;
  touchpointType: TouchpointType;
  device: string;
  country: string;
  durationSeconds?: number;
  occurredAt: string;
}

// Campaigns
export interface CampaignResponse {
  campaignId: number;
  channelId: number;
  channelName: string;
  name: string;
  startDate: string;
  endDate: string | null;
  budget: number | null;
  campaignStatus: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
}

export interface CampaignCreateRequest {
  channelId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  campaignStatus: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
}

export interface CampaignUpdateRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  campaignStatus?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
}

// Channels
export interface ChannelResponse {
  channelId: number;
  name: string;
  category: 'PAID' | 'OWNED' | 'EARNED' | 'DIRECT';
}

export interface ChannelCreateRequest {
  name: string;
  category: 'PAID' | 'OWNED' | 'EARNED' | 'DIRECT';
}

// Customers
export interface CustomerResponse {
  customerId: number;
  email: string;
  segment: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface CustomerUpdateRequest {
  segment?: string;
}

// Users (Admin)
export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  lastLogin: string | null;
  createdAt: string;
}

export interface UserUpdateRequest {
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
}

// Admin - Journey Stages
export interface JourneyStageCreateRequest {
  name: string;
  sortOrder: number;
}

export interface JourneyStageUpdateRequest {
  name?: string;
  sortOrder?: number;
}

// Admin - Channels
export interface ChannelUpdateRequest {
  name?: string;
  category?: 'PAID' | 'OWNED' | 'EARNED' | 'DIRECT';
}

// Admin - System Setup
export interface SystemInitResponse {
  stagesCreated: number;
  channelsCreated: number;
  campaignsCreated: number;
  alreadyInitialized: boolean;
  message: string;
}

export interface SetupStatusResponse {
  isReady: boolean;
  hasStages: boolean;
  stageCount: number;
  hasChannels: boolean;
  channelCount: number;
  hasCampaigns: boolean;
  campaignCount: number;
  issues: string[];
}

// Analytics
export interface ChannelBreakdown {
  channelId: number;
  channelName: string;
  touchpointCount: number;
}

export interface StageDropOff {
  stageId: number;
  stageName: string;
  sortOrder: number;
  journeyCount: number;
  dropOffRate: number;
}

export interface CrossJourneyAnalyticsResponse {
  totalJourneys: number;
  activeJourneys: number;
  completedJourneys: number;
  abandonedJourneys: number;
  totalConversions: number;
  overallConversionRate: number;
  channelBreakdown: ChannelBreakdown[];
  stageDropOffs: StageDropOff[];
}
