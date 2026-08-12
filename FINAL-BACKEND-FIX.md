# Final Backend Fix — System User Creation

## Current Status

✅ **Working:**
- Journey stages can be created (5 stages now exist)
- Channels exist (6 channels)
- System init endpoint partially works
- Admin authentication works

❌ **Broken:**
- Event processing fails with: `"System user not found. Please run application startup."`
- The backend expects a "system user" (ID 1) to exist for automated operations (campaign creation)

---

## The Fix: Create System User on Application Startup

**File:** Create `SystemInitializer.java` or add to existing startup class

```java
package com.yourpackage.config;

import com.yourpackage.entity.User;
import com.yourpackage.entity.UserRole;
import com.yourpackage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class SystemInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeSystemUser() {
        return args -> {
            // Check if system user exists
            if (userRepository.findById(1).isEmpty()) {
                User systemUser = new User();
                
                // Set ID to 1 (you may need to adjust based on your ID generation strategy)
                // If using auto-increment, you might need to use native SQL to set ID explicitly
                systemUser.setUserId(1);
                systemUser.setUsername("system");
                systemUser.setEmail("system@internal.local");
                systemUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                systemUser.setRole(UserRole.ADMIN);
                systemUser.setCreatedAt(LocalDateTime.now());
                
                userRepository.save(systemUser);
                log.info("✓ System user created successfully (ID: 1)");
            } else {
                log.info("✓ System user already exists (ID: 1)");
            }
        };
    }
}
```

### Alternative: If Auto-Increment Won't Allow ID 1

If your database uses auto-increment and won't let you set ID 1, use this approach:

```java
@Bean
public CommandLineRunner initializeSystemUser() {
    return args -> {
        // Look for system user by email instead of ID
        User systemUser = userRepository.findByEmail("system@internal.local")
            .orElseGet(() -> {
                User newSystemUser = new User();
                newSystemUser.setUsername("system");
                newSystemUser.setEmail("system@internal.local");
                newSystemUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newSystemUser.setRole(UserRole.ADMIN);
                newSystemUser.setCreatedAt(LocalDateTime.now());
                
                User saved = userRepository.save(newSystemUser);
                log.info("✓ System user created successfully (ID: {})", saved.getUserId());
                return saved;
            });
        
        log.info("✓ System user ready (ID: {})", systemUser.getUserId());
    };
}
```

### Update Raw Event Processor to Use System User

In your raw event processor, update the `getSystemUserId()` method:

```java
private Integer getSystemUserId() {
    // Option 1: Fixed ID (if you can set ID to 1 on creation)
    return 1;
    
    // Option 2: Lookup by email (if using auto-increment)
    /*
    return userRepository.findByEmail("system@internal.local")
        .map(User::getUserId)
        .orElseThrow(() -> new IllegalStateException("System user not found. Please run application startup."));
    */
}
```

---

## Testing After Fix

1. **Restart the backend** — the `CommandLineRunner` will execute on startup and create the system user

2. **Verify system user exists:**
```bash
# Check database
SELECT * FROM users WHERE email = 'system@internal.local';
# Should return one row with role ADMIN
```

3. **Test event processing:**
```bash
curl -X POST https://your-backend.com/api/raw-events \
  -H "Content-Type: application/json" \
  -d '{
    "anonymousId": "test-123",
    "sessionId": "session-456",
    "eventType": "PAGE_VIEW",
    "occurredAt": "2026-08-12T23:00:00Z",
    "sourceSystem": "web-storefront",
    "source": "direct",
    "medium": "none",
    "campaignName": "Default Campaign",
    "pageUrl": "http://localhost:5174/",
    "device": "desktop",
    "browser": "Chrome",
    "rawPayload": {},
    "eventKey": "test-001",
    "requireSession": false
  }'

# Expected: 201 Created with EventProcessingResult
# Should include journeyId, touchpointId, etc.
```

4. **Verify journey created:**
```bash
curl https://your-backend.com/api/journeys \
  -H "Cookie: jwt=YOUR_JWT"

# Should return array with at least one journey
```

---

## Current System State

After manually creating stages, here's what exists:

```
✅ 5 Journey Stages:
  1. Awareness
  2. Consideration
  3. Decision
  4. Purchase
  5. Retention

✅ 6 Channels:
  - Organic Search (EARNED)
  - Direct (DIRECT)
  - Email (OWNED)
  - Paid Search (PAID)
  - Social Media (EARNED)
  - Display Ads (PAID)

❌ 0 Campaigns
❌ System User Missing
```

---

## Once Fixed

After adding the `SystemInitializer`, the complete flow will work:

1. **Admin uses dashboard Setup page** → clicks "Initialize System"
2. **Frontend** creates stages/channels/campaigns via individual API calls
3. **E-commerce site** sends events with `campaignName: "Default Campaign"`
4. **Backend** resolves or creates campaign using system user ID
5. **Backend** creates journey + touchpoint successfully
6. **Dashboard** displays journey with timeline, charts, and analytics

The system will be **100% functional end-to-end**.

---

## Summary

**One line fix:** Add a `CommandLineRunner` that creates a system user on application startup.

**Impact:** Enables all automated operations (campaign creation during event processing).

**Test:** Restart backend, send an event, check if journey is created.
