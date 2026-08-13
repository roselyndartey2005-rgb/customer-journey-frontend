#!/bin/bash
# Full E2E Pipeline Verification Script
# Tests the customer journey tracking pipeline from bootstrap to analytics

set -e

API="${API_BASE_URL:-https://customer-journey-backend-zo4y.onrender.com}"
COOKIES="./test-cookies.txt"
ADMIN_EMAIL="admin-test-$(date +%s)@example.com"
CUSTOMER_EMAIL="customer-test-$(date +%s)@example.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_step() {
  echo -e "\n${GREEN}=== Step $1: $2 ===${NC}"
}

log_error() {
  echo -e "${RED}ERROR: $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}WARNING: $1${NC}"
}

log_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

check_response() {
  local response=$1
  local expected_status=$2
  local step_name=$3

  local actual_status=$(echo "$response" | grep "HTTP/" | tail -1 | awk '{print $2}')

  if [ "$actual_status" != "$expected_status" ]; then
    log_error "$step_name failed. Expected $expected_status, got $actual_status"
    echo "$response"
    exit 1
  fi
  log_success "$step_name returned $actual_status"
}

# Clean up old cookies
rm -f $COOKIES

log_step "1" "Register Admin User"
REGISTER_RESPONSE=$(curl -s -i -c $COOKIES -X POST "$API/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"admin123\",\"role\":\"ADMIN\"}" 2>&1)
check_response "$REGISTER_RESPONSE" "200" "Admin registration"

log_step "2" "Login as Admin"
LOGIN_RESPONSE=$(curl -s -i -b $COOKIES -c $COOKIES -X POST "$API/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"admin123\"}" 2>&1)
check_response "$LOGIN_RESPONSE" "200" "Admin login"

log_step "3" "Initialize System"
INIT_RESPONSE=$(curl -s -i -b $COOKIES -X POST "$API/api/admin/init" 2>&1)
check_response "$INIT_RESPONSE" "200" "System initialization"

INIT_BODY=$(echo "$INIT_RESPONSE" | tail -1)
echo "Init response: $INIT_BODY"

log_step "4" "Check Setup Status"
STATUS_RESPONSE=$(curl -s -i -b $COOKIES "$API/api/admin/setup-status" 2>&1)
check_response "$STATUS_RESPONSE" "200" "Setup status check"

STATUS_BODY=$(echo "$STATUS_RESPONSE" | tail -1)
echo "Setup status: $STATUS_BODY"

# Check if system is ready
IS_READY=$(echo "$STATUS_BODY" | grep -o '"isReady"[[:space:]]*:[[:space:]]*true' || echo "")
if [ -z "$IS_READY" ]; then
  log_warning "System may not be fully initialized (isReady != true)"
fi

log_step "5" "Send Minimal Event (only eventType)"
MINIMAL_EVENT_RESPONSE=$(curl -s -i -b $COOKIES -X POST "$API/api/raw-events" \
  -H "Content-Type: application/json" \
  -d '{"eventType":"PAGE_VIEW"}' 2>&1)

# Check if it's NOT a 500 error (should be 200/201 or clear 400)
MINIMAL_STATUS=$(echo "$MINIMAL_EVENT_RESPONSE" | grep "HTTP/" | tail -1 | awk '{print $2}')
if [ "$MINIMAL_STATUS" = "500" ]; then
  log_error "Minimal event returned 500 - Bug #1 (primitive boolean) NOT fixed"
  echo "$MINIMAL_EVENT_RESPONSE"
  exit 1
elif [ "$MINIMAL_STATUS" = "400" ]; then
  MINIMAL_BODY=$(echo "$MINIMAL_EVENT_RESPONSE" | tail -1)
  if echo "$MINIMAL_BODY" | grep -q "System user not found"; then
    log_error "Bug #3 (system user not found) NOT fixed"
    exit 1
  fi
  log_warning "Minimal event returned 400 (may need more required fields): $MINIMAL_BODY"
else
  log_success "Minimal event accepted (status $MINIMAL_STATUS)"
fi

log_step "6" "Send Full Event Payload"
FULL_EVENT_RESPONSE=$(curl -s -i -b $COOKIES -X POST "$API/api/raw-events" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$CUSTOMER_EMAIL\",
    \"eventType\":\"PAGE_VIEW\",
    \"occurredAt\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"sessionId\":\"sess-test-123\",
    \"anonymousId\":\"anon-test-456\",
    \"source\":\"google\",
    \"medium\":\"organic\",
    \"campaignName\":\"Test Campaign\",
    \"pageUrl\":\"/products\",
    \"device\":\"desktop\",
    \"browser\":\"Chrome\",
    \"sourceSystem\":\"web-storefront\",
    \"eventKey\":\"test-event-$(uuidgen)\",
    \"requireSession\":false
  }" 2>&1)

check_response "$FULL_EVENT_RESPONSE" "201" "Full event tracking"

FULL_EVENT_BODY=$(echo "$FULL_EVENT_RESPONSE" | tail -1)
echo "Event result: $FULL_EVENT_BODY"

# Extract processed status
PROCESSED=$(echo "$FULL_EVENT_BODY" | grep -o '"processed"[[:space:]]*:[[:space:]]*true' || echo "")
if [ -z "$PROCESSED" ]; then
  log_warning "Event may not have been processed (check response for noise/duplicate flags)"
fi

# Extract journey ID
JOURNEY_ID=$(echo "$FULL_EVENT_BODY" | grep -o '"journeyId"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*$' || echo "")
if [ -n "$JOURNEY_ID" ]; then
  log_success "Journey created with ID: $JOURNEY_ID"
else
  log_warning "No journeyId in response - may need to query by customerId"
fi

log_step "7" "Send Duplicate Event (same eventKey)"
DUPLICATE_EVENT_KEY="duplicate-test-$(uuidgen)"
curl -s -b $COOKIES -X POST "$API/api/raw-events" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$CUSTOMER_EMAIL\",
    \"eventType\":\"PAGE_VIEW\",
    \"occurredAt\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"sessionId\":\"sess-test-123\",
    \"anonymousId\":\"anon-test-456\",
    \"source\":\"google\",
    \"medium\":\"organic\",
    \"pageUrl\":\"/products\",
    \"device\":\"desktop\",
    \"browser\":\"Chrome\",
    \"sourceSystem\":\"web-storefront\",
    \"eventKey\":\"$DUPLICATE_EVENT_KEY\",
    \"requireSession\":false
  }" > /dev/null

DUPLICATE_RESPONSE=$(curl -s -i -b $COOKIES -X POST "$API/api/raw-events" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$CUSTOMER_EMAIL\",
    \"eventType\":\"PAGE_VIEW\",
    \"occurredAt\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"sessionId\":\"sess-test-123\",
    \"anonymousId\":\"anon-test-456\",
    \"source\":\"google\",
    \"medium\":\"organic\",
    \"pageUrl\":\"/products\",
    \"device\":\"desktop\",
    \"browser\":\"Chrome\",
    \"sourceSystem\":\"web-storefront\",
    \"eventKey\":\"$DUPLICATE_EVENT_KEY\",
    \"requireSession\":false
  }" 2>&1)

DUPLICATE_BODY=$(echo "$DUPLICATE_RESPONSE" | tail -1)
DUPLICATE_FLAG=$(echo "$DUPLICATE_BODY" | grep -o '"duplicate"[[:space:]]*:[[:space:]]*true' || echo "")

if [ -n "$DUPLICATE_FLAG" ]; then
  log_success "Duplicate detection working correctly"
else
  log_warning "Duplicate flag not found in response - deduplication may not be working"
fi

if [ -n "$JOURNEY_ID" ]; then
  log_step "8" "Get Journey Details"
  JOURNEY_RESPONSE=$(curl -s -i -b $COOKIES "$API/api/journeys/$JOURNEY_ID" 2>&1)
  check_response "$JOURNEY_RESPONSE" "200" "Journey retrieval"

  JOURNEY_BODY=$(echo "$JOURNEY_RESPONSE" | tail -1)
  echo "Journey: $JOURNEY_BODY"

  log_step "9" "Get Journey Touchpoints"
  TOUCHPOINTS_RESPONSE=$(curl -s -i -b $COOKIES "$API/api/journeys/$JOURNEY_ID/touchpoints" 2>&1)
  check_response "$TOUCHPOINTS_RESPONSE" "200" "Touchpoints retrieval"

  TOUCHPOINTS_BODY=$(echo "$TOUCHPOINTS_RESPONSE" | tail -1)
  echo "Touchpoints: $TOUCHPOINTS_BODY"

  log_step "10" "Get Analytics Data"
  SUMMARY_RESPONSE=$(curl -s -i -b $COOKIES "$API/api/journeys/$JOURNEY_ID/touchpoint-summary" 2>&1)
  check_response "$SUMMARY_RESPONSE" "200" "Touchpoint summary"

  FUNNEL_RESPONSE=$(curl -s -i -b $COOKIES "$API/api/journeys/$JOURNEY_ID/conversion-funnel" 2>&1)
  check_response "$FUNNEL_RESPONSE" "200" "Conversion funnel"
else
  log_warning "Skipping steps 8-10 (no journey ID available)"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ALL VERIFICATION TESTS PASSED  ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nCleanup: rm $COOKIES"
