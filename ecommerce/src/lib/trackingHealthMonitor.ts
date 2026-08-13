/**
 * Tracking Health Monitor
 *
 * Optional debugging utility to monitor event tracking success/failure rates.
 * Enable in development/staging by calling initTrackingHealthMonitor() in main.tsx
 *
 * Usage:
 *   import { initTrackingHealthMonitor } from './lib/trackingHealthMonitor';
 *   if (import.meta.env.DEV) {
 *     initTrackingHealthMonitor({ enableUI: true });
 *   }
 */

interface TrackingHealthStats {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  duplicateEvents: number;
  noiseEvents: number;
  lastEventTime: number | null;
  eventTypes: Record<string, number>;
  errors: Array<{ timestamp: number; eventType: string; error: string }>;
}

const stats: TrackingHealthStats = {
  totalEvents: 0,
  successfulEvents: 0,
  failedEvents: 0,
  duplicateEvents: 0,
  noiseEvents: 0,
  lastEventTime: null,
  eventTypes: {},
  errors: [],
};

const MAX_ERROR_HISTORY = 20;

// Intercept console logs to capture tracking events
function interceptConsoleLogs() {
  const originalDebug = console.debug;
  const originalError = console.error;

  console.debug = (...args: any[]) => {
    const message = args.join(' ');

    if (message.includes('[API] Event processed successfully:')) {
      const eventType = extractEventType(message);
      stats.totalEvents++;
      stats.successfulEvents++;
      stats.lastEventTime = Date.now();
      incrementEventType(eventType);
    } else if (message.includes('[API] Duplicate event detected:')) {
      const eventType = extractEventType(message);
      stats.totalEvents++;
      stats.duplicateEvents++;
      stats.lastEventTime = Date.now();
      incrementEventType(eventType);
    } else if (message.includes('[API] Event marked as noise:')) {
      const eventType = extractEventType(message);
      stats.totalEvents++;
      stats.noiseEvents++;
      stats.lastEventTime = Date.now();
      incrementEventType(eventType);
    }

    originalDebug.apply(console, args);
  };

  console.error = (...args: any[]) => {
    const message = args.join(' ');

    if (message.includes('[API] Event tracking failed:') || message.includes('[API] Network error sending event:')) {
      stats.totalEvents++;
      stats.failedEvents++;
      stats.lastEventTime = Date.now();

      const eventType = extractEventType(message);
      incrementEventType(eventType);

      stats.errors.push({
        timestamp: Date.now(),
        eventType,
        error: message,
      });

      // Keep only last N errors
      if (stats.errors.length > MAX_ERROR_HISTORY) {
        stats.errors.shift();
      }
    }

    originalError.apply(console, args);
  };
}

function extractEventType(message: string): string {
  const match = message.match(/:\s*([A-Z_]+)/);
  return match ? match[1] : 'UNKNOWN';
}

function incrementEventType(eventType: string) {
  stats.eventTypes[eventType] = (stats.eventTypes[eventType] || 0) + 1;
}

// Floating UI widget
function createHealthMonitorUI() {
  const container = document.createElement('div');
  container.id = 'tracking-health-monitor';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 999999;
    min-width: 250px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor: move;
    user-select: none;
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #444;
    font-weight: bold;
  `;
  header.innerHTML = `
    <span>📊 Tracking Health</span>
    <button id="tracking-health-close" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 16px;">×</button>
  `;

  const content = document.createElement('div');
  content.id = 'tracking-health-content';

  container.appendChild(header);
  container.appendChild(content);
  document.body.appendChild(container);

  // Close button
  document.getElementById('tracking-health-close')?.addEventListener('click', () => {
    container.remove();
  });

  // Make draggable
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - container.offsetLeft;
    dragOffsetY = e.clientY - container.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    container.style.left = `${e.clientX - dragOffsetX}px`;
    container.style.top = `${e.clientY - dragOffsetY}px`;
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Update UI every 500ms
  setInterval(updateHealthMonitorUI, 500);
  updateHealthMonitorUI();
}

function updateHealthMonitorUI() {
  const content = document.getElementById('tracking-health-content');
  if (!content) return;

  const successRate = stats.totalEvents > 0
    ? ((stats.successfulEvents / stats.totalEvents) * 100).toFixed(1)
    : '0.0';

  const statusColor = parseFloat(successRate) >= 95 ? '#10b981' : parseFloat(successRate) >= 80 ? '#f59e0b' : '#ef4444';

  const topEventTypes = Object.entries(stats.eventTypes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type, count]) => `  ${type}: ${count}`)
    .join('\n');

  const lastError = stats.errors[stats.errors.length - 1];
  const lastErrorText = lastError
    ? `  ${new Date(lastError.timestamp).toLocaleTimeString()}: ${lastError.eventType}\n  ${lastError.error.substring(0, 60)}...`
    : '  None';

  content.innerHTML = `
    <div style="line-height: 1.6;">
      <div style="margin-bottom: 8px;">
        <span style="color: #888;">Total Events:</span> <span style="color: #fff; font-weight: bold;">${stats.totalEvents}</span>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="color: #888;">Success Rate:</span> <span style="color: ${statusColor}; font-weight: bold;">${successRate}%</span>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="color: #10b981;">✓ Success:</span> ${stats.successfulEvents}<br>
        <span style="color: #ef4444;">✗ Failed:</span> ${stats.failedEvents}<br>
        <span style="color: #6b7280;">⊗ Duplicate:</span> ${stats.duplicateEvents}<br>
        <span style="color: #f59e0b;">⚠ Noise:</span> ${stats.noiseEvents}
      </div>
      ${topEventTypes ? `
        <div style="margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #444;">
          <div style="color: #888; margin-bottom: 4px;">Top Event Types:</div>
          <div style="color: #fff; white-space: pre-wrap; font-size: 11px;">${topEventTypes}</div>
        </div>
      ` : ''}
      ${stats.errors.length > 0 ? `
        <div style="margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #444;">
          <div style="color: #888; margin-bottom: 4px;">Last Error:</div>
          <div style="color: #ef4444; white-space: pre-wrap; font-size: 10px;">${lastErrorText}</div>
        </div>
      ` : ''}
      <div style="color: #888; font-size: 10px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #444;">
        Last event: ${stats.lastEventTime ? new Date(stats.lastEventTime).toLocaleTimeString() : 'Never'}
      </div>
    </div>
  `;
}

// Public API
export function initTrackingHealthMonitor(options?: { enableUI?: boolean }) {
  interceptConsoleLogs();

  if (options?.enableUI) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createHealthMonitorUI);
    } else {
      createHealthMonitorUI();
    }
  }

  // Expose stats on window for manual inspection
  (window as any).__trackingStats = stats;

  console.info('[TrackingHealthMonitor] Initialized. Access stats via window.__trackingStats');
}

export function getTrackingHealthStats(): Readonly<TrackingHealthStats> {
  return { ...stats };
}

export function resetTrackingHealthStats() {
  stats.totalEvents = 0;
  stats.successfulEvents = 0;
  stats.failedEvents = 0;
  stats.duplicateEvents = 0;
  stats.noiseEvents = 0;
  stats.lastEventTime = null;
  stats.eventTypes = {};
  stats.errors = [];
}
