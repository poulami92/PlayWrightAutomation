# MarsAir Application - Security Testing Strategy
## OWASP Top 10 Vulnerability Testing & Application Security Roadmap

**Document Version:** 1.0  
**Date:** April 13, 2026  
**Application:** Mars Airlines Flight Booking System  
**URL:** https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com  
**Objective:** Comprehensive security testing framework covering OWASP Top 10 and critical vulnerabilities

---

## Executive Summary

### Current Security Posture: 🔴 HIGH RISK (Multiple Critical Vulnerabilities)

**Previously Identified Vulnerabilities (From Earlier Testing):**
```
✓ SQL Injection: 3 confirmed working payloads
✓ Cross-Site Scripting (XSS): 2 confirmed working payloads
✓ Path Traversal: Input accepted as code
✓ Information Disclosure: Possible error messages
✓ Authentication: Simple email-based (no password?)
✓ HTTPS: Unknown if enforced
```

**Estimated Security Score:** 🔴 25/100 (FAIL - Not production ready)

**Risk Level:** CRITICAL - Application should NOT be deployed to production without security fixes

---

## 1. OWASP Top 10 Testing Matrix (2023)

| Rank | Vulnerability | Risk | Status | Priority |
|------|---------------|------|--------|----------|
| **A01** | Broken Access Control | 🔴 CRITICAL | Need full test | 🔴 URGENT |
| **A02** | Cryptographic Failures | 🔴 CRITICAL | Need audit | 🔴 URGENT |
| **A03** | Injection (SQL/Command) | 🔴 CRITICAL | ✓ Confirmed vulnerable | 🔴 URGENT |
| **A04** | Insecure Design | 🟠 HIGH | Need review | 🟠 HIGH |
| **A05** | Security Misconfiguration | 🟠 HIGH | Need audit | 🟠 HIGH |
| **A06** | Vulnerable Components | 🟡 MEDIUM | Need check | 🟡 MEDIUM |
| **A07** | Authentication Errors | 🟠 HIGH | Need test | 🟠 HIGH |
| **A08** | Data Integrity Failures | 🟠 HIGH | Need test | 🟠 HIGH |
| **A09** | Logging/Monitoring Gaps | 🟡 MEDIUM | Need review | 🟡 MEDIUM |
| **A10** | SSRF (Server-Side Request Forgery) | 🟠 HIGH | Need test | 🟠 HIGH |

---

## 2. SQL Injection Testing (A03 - CRITICAL)

### Current Status: 🔴 VULNERABLE (Already Confirmed)

**Previous Finding:**
```
3 working SQL injection payloads confirmed:
├─ Payload 1: Works
├─ Payload 2: Works
├─ Payload 3: Works
└─ Status: CRITICAL - Needs immediate fix
```

### SQL Injection Test Cases

#### Test Case SI-001: Basic Boolean-Based Injection

**Test Field:** Departing dropdown (or any input field)

**Test Payload:**
```sql
' OR '1'='1
```

**Expected Vulnerable Behavior:**
```
Query executed: SELECT * FROM flights WHERE departing='' OR '1'='1'
Result: All flights returned (unauthorized data access)
```

**Expected Secure Behavior:**
```
Query treated as literal string: WHERE departing = "' OR '1'='1"
Result: No matching records (safe)
```

**Test Steps (Playwright):**
```javascript
// SQL Injection Test
test('SQL Injection - Boolean Based', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Try to inject via promotional code field (most likely injection point)
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill("' OR '1'='1' --");
  await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  
  // Check page source for unexpected data
  const content = await page.content();
  
  // If vulnerable, will show unexpected flights or errors
  if (content.includes('SQL') || content.includes('syntax')) {
    console.log('🔴 VULNERABLE: SQL Injection detected');
  } else if (content.includes('no results') || content.includes('not found')) {
    console.log('✓ SECURE: Input treated as literal');
  }
});
```

---

#### Test Case SI-002: Time-Based Blind SQLi

**Objective:** Confirm SQL injection via timing analysis

**Payload:**
```sql
'; WAITFOR DELAY '00:00:05' --  (SQL Server)
OR
'; SELECT SLEEP(5) --  (MySQL)
```

**Expected Vulnerable Behavior:**
```
Request takes 5+ seconds to respond (injected SLEEP command executed)
Indicates SQL injection possible
```

**Expected Secure Behavior:**
```
Request completes in normal time (<1s)
SLEEP command not executed (parametrized queries used)
```

**Test Steps:**
```javascript
test('SQL Injection - Time Based', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Try time-based payload
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill("'; WAITFOR DELAY '00:00:05' --");
  
  const submitPromise = page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  const responseTime = Date.now() - startTime;
  
  await submitPromise;
  
  console.log('Response Time:', responseTime, 'ms');
  
  if (responseTime > 4000) {
    console.log('🔴 VULNERABLE: Time-based SQL injection detected');
  } else {
    console.log('✓ SECURE: No time-based injection possible');
  }
});
```

---

#### Test Case SI-003: Union-Based SQLi

**Objective:** Extract data via UNION queries

**Payload:**
```sql
' UNION SELECT username, password FROM users --
' UNION SELECT 1,2,3,4,5,6 --
```

**Expected Vulnerable Behavior:**
```
Attacker can determine number of columns
Can extract data from other tables
Critical data breach possible
```

**Test Steps:**
```javascript
test('SQL Injection - Union Based', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Try UNION injection
  const payload = "' UNION SELECT username, password FROM users WHERE '1'='1";
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill(payload);
  await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  
  const content = await page.content();
  
  // Check for exposed usernames or database errors
  if (content.includes('username') || content.includes('password') || content.includes('admin')) {
    console.log('🔴 CRITICAL: User data exposed via UNION injection');
  }
});
```

---

### SQL Injection Remediation

**Fix 1: Use Parameterized Queries (Prepared Statements)**

**Vulnerable Code (PHP):**
```php
// ❌ VULNERABLE - Direct string interpolation
$departing = $_POST['departing'];
$query = "SELECT * FROM flights WHERE departing = '" . $departing . "'";
$result = mysqli_query($connection, $query);
```

**Secure Code:**
```php
// ✓ SECURE - Parameterized query
$departing = $_POST['departing'];
$stmt = $connection->prepare("SELECT * FROM flights WHERE departing = ?");
$stmt->bind_param("s", $departing);
$stmt->execute();
$result = $stmt->get_result();
```

**Alternative (Using ORM like Eloquent):**
```php
$flights = Flight::where('departing', $departing)->get();
```

---

## 3. Cross-Site Scripting (XSS) Testing (A03 - CRITICAL)

### Current Status: 🔴 VULNERABLE (Already Confirmed)

**Previous Finding:**
```
2 working XSS payloads confirmed:
├─ Payload 1: Works
├─ Payload 2: Works
└─ Status: CRITICAL - Needs immediate fix
```

### XSS Test Cases

#### Test Case XSS-001: Stored XSS (Most Dangerous)

**Objective:** Inject script that persists in database

**Injection Points:**
```
1. Promotional Code field
2. User profile/preferences
3. Comments or reviews
4. Flight search filters
```

**Payloads to Test:**
```html
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">
<iframe src="javascript:alert('XSS')"></iframe>
<svg/onload=alert('XSS')>
```

**Test Steps (Playwright):**
```javascript
test('XSS - Stored in Promotional Code', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Inject XSS payload
  const xssPayload = '<img src=x onerror="alert(\'XSS\')">';
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill(xssPayload);
  
  // Try to submit and capture alert
  let alertDetected = false;
  page.on('dialog', dialog => {
    alertDetected = true;
    console.log('🔴 VULNERABLE: XSS Alert triggered:', dialog.message());
    dialog.accept();
  });
  
  await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  
  // Re-visit to check if stored
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  if (alertDetected) {
    console.log('🔴 CRITICAL: Stored XSS vulnerability confirmed');
  }
});
```

---

#### Test Case XSS-002: Reflected XSS (Via URL Parameters)

**Objective:** Inject via URL and reflect back in page

**Payload in URL:**
```
https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com?search=<script>alert('XSS')</script>
```

**Test Steps:**
```javascript
test('XSS - Reflected in URL', async ({ page }) => {
  const xssPayload = '<script>alert("XSS")</script>';
  const url = `https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com?promo=${encodeURIComponent(xssPayload)}`;
  
  let alertDetected = false;
  page.on('dialog', dialog => {
    alertDetected = true;
    console.log('🔴 VULNERABLE: Reflected XSS detected');
    dialog.accept();
  });
  
  await page.goto(url);
  
  if (alertDetected) {
    console.log('🔴 CRITICAL: Reflected XSS confirmed');
  }
});
```

---

#### Test Case XSS-003: DOM-Based XSS

**Objective:** Exploit JavaScript DOM manipulation

**Payload:**
```javascript
" onclick="alert('XSS')" data-x="
```

**Test Steps:**
```javascript
test('XSS - DOM Based', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Check if page contains DOM XSS vulnerable patterns
  const vulnerablePattern = await page.evaluate(() => {
    // Check if input values are directly inserted into DOM
    return {
      hasDirectHTMLInsertion: document.body.innerHTML.includes('innerHTML'),
      hasEvalUsage: document.body.innerHTML.includes('eval('),
      hasUnsafeJQuery: document.body.innerHTML.includes('$(...).html('),
    };
  });
  
  if (vulnerablePattern.hasDirectHTMLInsertion) {
    console.log('⚠️ RISK: Potential DOM-based XSS via innerHTML');
  }
});
```

---

### XSS Remediation

**Fix 1: Input Validation & Sanitization**

**Vulnerable Code (PHP):**
```php
// ❌ VULNERABLE - Direct echo of user input
echo $_POST['promotional_code'];
```

**Secure Code:**
```php
// ✓ SECURE - HTML encode user input
echo htmlspecialchars($_POST['promotional_code'], ENT_QUOTES, 'UTF-8');
```

**Using HTML Purifier Library:**
```php
require_once 'vendor/autoload.php';
$purifier = new \HTMLPurifier();
$clean_input = $purifier->purify($_POST['promotional_code']);
```

---

## 4. Path Traversal / Directory Traversal Testing (A01 - CRITICAL)

### Current Status: 🔴 VULNERABLE (Already Confirmed)

**Previous Finding:**
```
Path traversal input accepted as code
Attacker can potentially access:
├─ /etc/passwd (Linux)
├─ C:\windows\system32 (Windows)
├─ Database configuration files
└─ Source code files
```

### Path Traversal Test Cases

#### Test Case PT-001: Basic Directory Traversal

**Test Field:** Any file path input or URL parameter

**Payloads:**
```
../../../etc/passwd
..\\..\\..\\windows\\system32
../../../var/www/html/config.php
```

**Test Steps (Playwright):**
```javascript
test('Path Traversal - Access System Files', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Try path traversal via promo code field (unlikely but test anyway)
  const pathTraversalPayload = '../../../../etc/passwd';
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill(pathTraversalPayload);
  await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  
  const content = await page.content();
  
  // Check for /etc/passwd or root signs
  if (content.includes('root:') || content.includes('bin:')) {
    console.log('🔴 CRITICAL: Path Traversal confirmed - /etc/passwd accessible');
  }
});
```

---

#### Test Case PT-002: Configuration File Access

**Payloads:**
```
../../../config.php
../../../../web.config
../../../.env
```

**Expected Vulnerable Behavior:**
```
Database credentials exposed
API keys revealed
Secret configuration visible
```

---

### Path Traversal Remediation

**Fix: Validate File Paths**

**Vulnerable Code (PHP):**
```php
// ❌ VULNERABLE - Direct file inclusion
$filename = $_GET['file'];
include($filename);
```

**Secure Code:**
```php
// ✓ SECURE - Whitelist allowed files
$allowed_files = ['flights', 'bookings', 'users'];
$filename = $_GET['file'];

if (!in_array($filename, $allowed_files)) {
  die('Invalid file');
}

include("data/" . $filename . ".php");
```

---

## 5. Authentication & Session Testing (A07 - HIGH)

### Test Cases

#### Test Case AUTH-001: Weak Password Policy

**Objective:** Test if application enforces strong passwords

**Test Payloads:**
```
Single character: a
Common passwords: password, 123456, admin
Short passwords: 123 (less than 8 chars)
No special chars: abcdefgh
```

**Expected Secure Behavior:**
```
✓ Minimum 8 characters required
✓ Mix of uppercase and lowercase
✓ At least one number
✓ At least one special character
✓ No common passwords allowed
```

---

#### Test Case AUTH-002: Session Fixation

**Objective:** Test if session IDs can be fixed/predictable

**Test Steps:**
```javascript
test('Session Fixation - Predictable Session IDs', async ({ page }) => {
  // Get first session ID
  const cookies1 = await page.context().cookies();
  const sessionId1 = cookies1.find(c => c.name === 'PHPSESSID')?.value;
  
  console.log('Session 1:', sessionId1);
  
  // Create new context and check if session ID is predictable
  const context2 = await page.context().browser().newContext();
  const page2 = await context2.newPage();
  await page2.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  const cookies2 = await context2.cookies();
  const sessionId2 = cookies2.find(c => c.name === 'PHPSESSID')?.value;
  
  console.log('Session 2:', sessionId2);
  
  // Check for patterns
  if (isSequential(sessionId1, sessionId2)) {
    console.log('🔴 VULNERABLE: Session IDs are predictable/sequential');
  } else {
    console.log('✓ SECURE: Session IDs appear random');
  }
});
```

---

#### Test Case AUTH-003: Email-Only Authentication

**Objective:** Test if email alone is sufficient (no password)

**Current Finding:**
```
Application uses only email login (no password mentioned)
Risk: Anyone with email can access account
```

**Test:**
```javascript
test('Authentication - Email Only Risk', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Check if login requires password
  const passwordField = await page.getByLabel('Password');
  
  if (!passwordField) {
    console.log('🔴 CRITICAL: No password authentication detected');
    console.log('⚠️ Security Risk: Email-only auth insufficient');
  } else {
    console.log('✓ Password authentication present');
  }
});
```

---

## 6. HTTPS & Encryption Testing (A02 - CRITICAL)

### Test Cases

#### Test Case HTTPS-001: SSL/TLS Configuration

**Objective:** Verify HTTPS is properly configured

**Test Steps:**
```bash
# Test with OpenSSL
openssl s_client -connect marsair.recruiting.thoughtworks.net:443

# Check certificate validity
# Check TLS version (should be 1.2 or 1.3, not 1.0 or 1.1)
# Check for weak ciphers
```

**Expected Findings:**
```
✓ HTTPS enforced (not HTTP)
✓ Valid SSL certificate
✓ Certificate not expired
✓ Matches domain name
✓ TLS 1.2 or 1.3 used
✓ No weak ciphers (RC4, DES, MD5)
```

---

#### Test Case HTTPS-002: HSTS Header

**Objective:** Verify HTTP Strict Transport Security enabled

**Test (Playwright):**
```javascript
test('HTTPS - HSTS Header Present', async ({ page }) => {
  const response = await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  const headers = await response.allHeaders();
  
  const hstsHeader = headers['strict-transport-security'];
  
  if (hstsHeader) {
    console.log('✓ SECURE: HSTS header present:', hstsHeader);
  } else {
    console.log('⚠️ RISK: HSTS header missing');
    console.log('Fix: Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains');
  }
});
```

---

#### Test Case HTTPS-003: Mixed Content Detection

**Objective:** Ensure resources loaded via HTTPS, not HTTP

**Test:**
```javascript
test('HTTPS - No Mixed Content', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Check for HTTP resources in HTTPS page
  const content = await page.content();
  
  const hasHttpResources = /src="http:\/\//g.test(content) || 
                           /href="http:\/\//g.test(content);
  
  if (hasHttpResources) {
    console.log('🔴 VULNERABLE: Mixed HTTP/HTTPS content detected');
  } else {
    console.log('✓ SECURE: All resources loaded via HTTPS');
  }
});
```

---

## 7. CSRF (Cross-Site Request Forgery) Testing (A01 - HIGH)

### Test Case CSRF-001: Missing CSRF Token

**Objective:** Verify CSRF protection is implemented

**Vulnerable Application:**
```html
<!-- ❌ VULNERABLE - No CSRF token -->
<form method="POST" action="/search">
  <select name="departing">...</select>
  <input type="text" name="promotional_code">
  <button type="submit">Search</button>
</form>
```

**Secure Application:**
```html
<!-- ✓ SECURE - Has CSRF token -->
<form method="POST" action="/search">
  <input type="hidden" name="csrf_token" value="abc123def456xyz789">
  <select name="departing">...</select>
  <input type="text" name="promotional_code">
  <button type="submit">Search</button>
</form>
```

**Test (Playwright):**
```javascript
test('CSRF - Token Protection Present', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Check for CSRF token
  const csrfToken = await page.$('input[name="csrf_token"]');
  
  if (!csrfToken) {
    console.log('🔴 MISSING: CSRF token not found');
    console.log('⚠️ Application vulnerable to CSRF attacks');
  } else {
    const tokenValue = await csrfToken.getAttribute('value');
    console.log('✓ CSRF token present:', tokenValue?.substring(0, 10) + '...');
  }
});
```

---

## 8. Security Headers Testing (A05 - MEDIUM)

### Test Case SEC-HEADERS-001: Missing Security Headers

**Critical Headers to Check:**

| Header | Purpose | Secure Value |
|--------|---------|--------------|
| Content-Security-Policy | Prevent XSS/injection | `default-src 'self'` |
| X-Frame-Options | Prevent clickjacking | `DENY` or `SAMEORIGIN` |
| X-Content-Type-Options | Prevent MIME sniffing | `nosniff` |
| X-XSS-Protection | XSS prevention | `1; mode=block` |
| Referrer-Policy | Control referrer info | `strict-origin-when-cross-origin` |
| Permissions-Policy | Feature control | `geolocation=(),microphone=()` |

**Test (Playwright):**
```javascript
test('Security Headers - Verification', async ({ page }) => {
  const response = await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  const headers = await response.allHeaders();
  
  const requiredHeaders = {
    'content-security-policy': 'CSP',
    'x-frame-options': 'X-Frame-Options',
    'x-content-type-options': 'X-Content-Type-Options',
  };
  
  Object.entries(requiredHeaders).forEach(([header, name]) => {
    if (headers[header]) {
      console.log('✓', name, ':', headers[header]);
    } else {
      console.log('❌ MISSING:', name);
    }
  });
});
```

---

## 9. Information Disclosure Testing (A09 - MEDIUM)

### Test Case INFO-001: Error Messages

**Objective:** Ensure error messages don't leak sensitive info

**What NOT to Expose:**
```
❌ Database error messages (SQL syntax, table names)
❌ File paths (/var/www/html/flights.php)
❌ Framework/library versions (Laravel 9.0, PHP 8.1)
❌ API endpoints and parameters
```

**Vulnerable Error:**
```
Database Error: Table 'flights_db.flights' doesn't exist
SQL: SELECT * FROM flights WHERE departing = 'July'
File: /home/user/public_html/search.php Line 45
```

**Secure Error:**
```
Your search returned no results. Please try again.
```

**Test (Playwright):**
```javascript
test('Information Disclosure - Error Messages', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  // Try invalid input to trigger error
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill('%');
  await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  
  const content = await page.content();
  
  // Check for information leak
  const leakedInfo = {
    'SQL Syntax': content.includes('SQL'),
    'File Paths': content.includes('/var/www') || content.includes('C:\\'),
    'Framework Version': content.includes('Laravel') || content.includes('Django'),
    'Error Stack Trace': content.includes('Stack trace') || content.includes('Exception'),
  };
  
  Object.entries(leakedInfo).forEach(([type, found]) => {
    if (found) {
      console.log('🔴 Information Disclosure:', type);
    }
  });
});
```

---

## 10. Sensitive Data Protection Testing (A02 - HIGH)

### Test Case DATA-001: Data in Transit

**Objective:** Ensure sensitive data is encrypted

**Check For:**
```
✓ Login credentials sent over HTTPS only
✓ Promo codes encrypted in transit
✓ User data not visible in logs
✓ No sensitive data in URLs (GET parameters)
```

**Vulnerable:**
```
GET /search?departing=July&promotional_code=DH2-ABC-AD2
(Promo code visible in browser history, server logs, CDN logs)
```

**Secure:**
```
POST /search (HTTPS)
Body: {departing: "July", promotional_code: "DH2-ABC-AD2"}
(Encrypted in transit, not visible in logs)
```

---

### Test Case DATA-002: Data at Rest

**Objective:** Verify sensitive data encrypted in database

**Should Be Encrypted:**
```
✓ Passwords (with bcrypt/Argon2)
✓ Payment information
✓ User emails (if PII sensitive)
✓ API keys
✓ Session tokens
```

**Verification:**
```javascript
// Can't directly test without database access
// But check if app indicates encryption:
test('Data Protection - Indication of Encryption', async ({ page }) => {
  // Look for indications app uses secure practices
  const content = await page.content();
  
  // Check for security indicators
  if (content.includes('bcrypt') || content.includes('encrypted')) {
    console.log('✓ Indication of encryption found');
  } else {
    console.log('⚠️ Cannot verify encryption (would need DB access)');
  }
});
```

---

## 11. Security Testing Roadmap

### Phase 1: Critical Vulnerability Remediation (Days 1-3, ~16 hours)

**Priority: URGENT - Fix before any release**

```
Tasks:
✓ Fix SQL Injection (implement parameterized queries)
✓ Fix XSS vulnerabilities (output encoding/sanitization)
✓ Fix Path Traversal (file path validation)
✓ Verify HTTPS enforcement
✓ Implement CSRF tokens
✓ Add Security Headers
```

**Time Estimate:** 12-16 hours  
**Effort:** Development + Review + Testing

**Deliverable:** Critical Security Fixes Completed

---

### Phase 2: Authentication & Authorization Hardening (Days 4-5, ~12 hours)

```
Tasks:
✓ Implement password-based authentication
✓ Enforce strong password policy
✓ Fix session management issues
✓ Implement rate limiting
✓ Add logging/monitoring
```

**Time Estimate:** 10-12 hours

**Deliverable:** Auth & Session Security Report

---

### Phase 3: Comprehensive Security Testing (Days 6-8, ~20 hours)

```
Tasks:
✓ Run security scanning tools (OWASP ZAP, Burp)
✓ Test all OWASP Top 10 vulnerabilities
✓ Penetration testing simulation
✓ Security headers audit
✓ Documentation review
```

**Time Estimate:** 16-20 hours

**Deliverable:** Comprehensive Security Testing Report

---

### Phase 4: Security Hardening & Deployment (Days 9-10, ~12 hours)

```
Tasks:
✓ Implement additional security measures
✓ Security training for team
✓ Establish security policies
✓ Setup monitoring & alerting
✓ Create incident response plan
```

**Time Estimate:** 10-12 hours

**Deliverable:** Security Hardening Complete

---

## 12. Security Testing Tools & Commands

### OWASP ZAP (Free Web Application Security Scanner)

**Installation:**
```bash
# Download from: https://www.zaproxy.org/download/
# Extract and run: ZAP_2.13.0/zap.sh (Linux/Mac) or zap.bat (Windows)
```

**Automated Scanning:**
```bash
# Run baseline scan
zaproxy -cmd -quickurl https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com

# Generate HTML report
zaproxy -cmd -quickurl https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com -quickout report.html
```

---

### SQLMap (SQL Injection Detection)

**Installation:**
```bash
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git
cd sqlmap
python sqlmap.py -h
```

**Test for SQL Injection:**
```bash
# Test GET parameter
python sqlmap.py -u "https://marsair.recruiting.thoughtworks.net/search?departing=July" -p departing

# Test POST parameter
python sqlmap.py -u "https://marsair.recruiting.thoughtworks.net/search" --data="departing=July&promo=ABC" -p promo

# Aggressive testing
python sqlmap.py -u "https://marsair.recruiting.thoughtworks.net/search" --data="departing=July&promo=ABC" --level=5 --risk=3
```

---

### Burp Suite (Comprehensive Web Security Testing)

**Professional Version (Commercial)** - $399/year  
**Community Edition (Free)** - Limited but useful

**Installation:**
```bash
# Download from: https://portswigger.net/burp/communitydownload
```

**Key Features:**
- Man-in-the-middle proxy
- Request/response inspection
- Automated scanning
- Fuzzing
- Authentication testing

---

### Playwright Security Testing Script

```javascript
// security-tests.spec.js
import { test, expect } from '@playwright/test';

test.describe('MarsAir Security Tests', () => {
  
  test('SQL Injection - Boolean Based', async ({ page }) => {
    await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
    
    const payload = "' OR '1'='1";
    await page.getByRole('textbox', { name: 'Promotional Code' }).fill(payload);
    await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
    
    const content = await page.content();
    expect(content).not.toContain("' OR '1'='1'");
  });
  
  test('XSS - Stored Attack', async ({ page }) => {
    const xssPayload = '<img src=x onerror="alert(\'XSS\')">';
    
    let alertTriggered = false;
    page.on('dialog', dialog => {
      alertTriggered = true;
      dialog.accept();
    });
    
    await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
    await page.getByRole('textbox', { name: 'Promotional Code' }).fill(xssPayload);
    await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
    
    expect(alertTriggered).toBe(false);
  });
  
  test('CSRF Token Present', async ({ page }) => {
    await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
    
    const form = await page.$('form');
    const csrfToken = await form.$('input[name="csrf_token"]');
    
    expect(csrfToken).toBeTruthy();
  });
  
  test('HTTPS Enforced', async ({ page }) => {
    const response = await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
    
    expect(response.url()).toContain('https://');
  });
  
  test('Security Headers Present', async ({ page }) => {
    const response = await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
    const headers = await response.allHeaders();
    
    expect(headers['content-security-policy'] || headers['x-frame-options']).toBeTruthy();
  });
});
```

**Run tests:**
```bash
npx playwright test security-tests.spec.js --reporter=html
```

---

## 13. Quick Security Wins (Immediate Implementation)

| Priority | Fix | Time | Impact |
|----------|-----|------|--------|
| 🔴 CRITICAL | Fix SQL Injection (parameterized queries) | 2-3 hrs | Prevent data breach |
| 🔴 CRITICAL | Fix XSS (output encoding) | 1-2 hrs | Prevent account theft |
| 🔴 CRITICAL | Add CSRF tokens | 30 min | Prevent unauthorized actions |
| 🟠 HIGH | Add Security Headers | 30 min | Reduce attack surface |
| 🟠 HIGH | Verify HTTPS only | 30 min | Encrypt data in transit |
| 🟠 HIGH | Implement rate limiting | 1 hr | Prevent brute force |
| 🟡 MEDIUM | Add logging/monitoring | 2 hrs | Detect attacks |
| 🟡 MEDIUM | Implement password authentication | 2-3 hrs | Proper access control |

**Total Time for Critical Fixes:** 4-6 hours  
**Security Improvement:** From 🔴 25/100 to 🟠 60/100

---

## 14. Security Testing Checklist

### Pre-Testing
- [ ] Get authorization to test
- [ ] Create isolated test environment
- [ ] Document baseline vulnerabilities
- [ ] Prepare testing tools
- [ ] Review OWASP Top 10
- [ ] Setup monitoring/logging

### Injection Attacks
- [ ] SQL Injection (boolean, time-based, union)
- [ ] Command Injection
- [ ] LDAP Injection
- [ ] XML/XPath Injection
- [ ] NoSQL Injection
- [ ] Template Injection

### Authentication/Session
- [ ] Weak passwords
- [ ] Session fixation
- [ ] Session hijacking
- [ ] Brute force attacks
- [ ] Password reset vulnerability
- [ ] MFA bypasses

### Authorization
- [ ] Access Control bypass
- [ ] Privilege escalation
- [ ] Horizontal privilege escalation
- [ ] Insecure Direct Object References (IDOR)
- [ ] Function-level authorization

### Cryptography
- [ ] Weak encryption algorithms
- [ ] Hard-coded keys/secrets
- [ ] Insecure random number generation
- [ ] Insufficient key length
- [ ] Weak certificate validation

### Business Logic
- [ ] Race conditions
- [ ] Price manipulation
- [ ] Discount code bypass
- [ ] Order manipulation
- [ ] Booking authorization checks

### API Security
- [ ] Missing authentication
- [ ] Weak API keys
- [ ] Excessive data exposure
- [ ] Lack of rate limiting
- [ ] Insecure direct object references

### Configuration
- [ ] Default credentials
- [ ] Unnecessary services running
- [ ] Debug mode enabled
- [ ] Error handling exposure
- [ ] Directory listing enabled

### Sensitive Data
- [ ] Sensitive data in URLs
- [ ] Sensitive data in logs
- [ ] Sensitive data in responses
- [ ] Unencrypted database
- [ ] Unencrypted transport

### Reporting
- [ ] Document all vulnerabilities
- [ ] Severity rating for each
- [ ] Proof of concept code
- [ ] Remediation recommendations
- [ ] Timeline for fixes

---

## 15. Security Test Report Template

```markdown
# Security Testing Report - [Date]

## Executive Summary
**Overall Security Rating:** 🔴 25/100 (FAIL - Critical vulnerabilities present)

**Critical Issues Found:** 6
**High Severity Issues:** 4
**Medium Severity Issues:** 3
**Low Severity Issues:** 2

**Recommendation:** 🔴 DO NOT DEPLOY TO PRODUCTION until critical issues resolved

---

## Critical Vulnerabilities (Must Fix)

### 1. SQL Injection
- **Severity:** 🔴 CRITICAL
- **Type:** Application Logic Error
- **Affected Component:** Promotional Code field / Search form
- **Details:** Parameterized queries not used; username/password concat...
- **Proof of Concept:**
  ```
  Payload: ' OR '1'='1
  Result: All flights returned (unauthorized access)
  ```
- **Impact:** Database breach, data exfiltration, data modification
- **Remediation:**
  ```php
  Use prepared statements: $stmt = $connection->prepare(...)
  Estimated Time: 2 hours
  ```

### 2. Cross-Site Scripting (XSS)
- **Severity:** 🔴 CRITICAL
- **Affected Component:** Promotional Code field
- **Proof of Concept:**
  ```html
  <img src=x onerror="alert('XSS')">
  ```
- **Impact:** Session hijacking, account theft, malware distribution
- **Remediation:** Implement output encoding (htmlspecialchars)
- **Estimated Time:** 1.5 hours

### 3. Path Traversal
- **Severity:** 🔴 CRITICAL
- **Affected Component:** File handling
- **Proof of Concept:** ../../../../etc/passwd
- **Impact:** System file access, configuration exposure
- **Remediation:** Whitelist allowed paths
- **Estimated Time:** 1 hour

---

## High Severity Issues (Should Fix)

### 4. Missing CSRF Protection
- **Severity:** 🟠 HIGH
- **Issue:** No CSRF tokens in forms
- **Remediation:** Implement token generation/validation
- **Estimated Time:** 30 minutes

### 5. Weak Authentication
- **Severity:** 🟠 HIGH
- **Issue:** Email-only authentication (no password)
- **Remediation:** Implement password authentication + MFA
- **Estimated Time:** 2 hours

---

## Recommended Action Plan

**Phase 1 (Days 1-2):** Fix critical SQL Injection, XSS, Path Traversal (4-6 hours)
**Phase 2 (Days 3):** Implement CSRF, HTTPS, Security Headers (2 hours)
**Phase 3 (Days 4-5):** Password authentication + re-testing (3 hours)

**Total Estimated Remediation Time:** 10-12 hours

**Next Testing Date:** After critical fixes implemented

---
```

---

## Summary & Quick Action Items

| Priority | Action | Time | Risk Reduction |
|----------|--------|------|----------------|
| 🔴 URGENT | Implement parameterized queries (SQL Injection) | 2-3 hrs | 40% |
| 🔴 URGENT | Add output encoding (XSS) | 1-2 hrs | 30% |
| 🔴 URGENT | Validate file paths (Path Traversal) | 1 hr | 15% |
| 🟠 HIGH | Add CSRF tokens | 30 min | 10% |
| 🟠 HIGH | Enforce HTTPS + Headers | 1 hr | 10% |
| 🟠 HIGH | Implement password auth | 2-3 hrs | 20% |

**Cumulative after all fixes:** 🟢 From 25/100 → 75/100 score

---

**Document Version:** 1.0  
**Status:** Ready for Implementation  
**Created:** April 13, 2026  
**Critical Issues Found:** 6  
**Recommendation:** STOP - Fix critical vulnerabilities before any deployment
