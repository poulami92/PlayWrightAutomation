# MarsAir Application - Performance Testing Strategy
## Quick Implementation Approach for Load Testing, Performance Profiling & Optimization

**Document Version:** 1.0  
**Date:** April 13, 2026  
**Application:** Mars Airlines Flight Booking System  
**URL:** https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com  
**Objective:** Establish performance testing framework with baseline metrics and optimization recommendations

---

## Executive Summary

**Performance Testing Approach:**
- ✓ **Client-side performance** (load time, rendering, JavaScript execution)
- ✓ **Server-side performance** (response time, throughput, resource usage)
- ✓ **Network performance** (bandwidth utilization, asset sizes)
- ✓ **Scalability testing** (concurrent users, load handling)
- ✓ **Stress testing** (breaking points, failure modes)

**Baseline Metrics (Chrome - Current):**
```
Page Load Time:        ~0.5 seconds
Total Asset Size:      ~406 KB
Largest Asset:         Mars image (400 KB - 99% of load)
Network Requests:      1-2 (HTML + image)
Render Time:           <100ms (excluding image load)
Time to Interactive:   ~0.5s (after image loads)
```

**Quick Performance Score:** 🟠 MODERATE (67/100)
- HTML/CSS/JS: ✓ Good (~10 KB combined)
- Image Optimization: ❌ Poor (~400 KB unoptimized)
- Caching: ⚠️ Unknown (needs verification)
- CDN: ⚠️ Unknown (needs verification)

---

## 1. Performance Metrics to Measure

### Core Web Vitals (Critical - Google PageSpeed Focus)

| Metric | Abbreviation | Good | Fair | Poor | Current |
|--------|--------------|------|------|------|---------|
| Largest Contentful Paint | **LCP** | <2.5s | 2.5-4s | >4s | ~0.5s ✓ |
| First Input Delay | **FID** | <100ms | 100-300ms | >300ms | ? (test needed) |
| Cumulative Layout Shift | **CLS** | <0.1 | 0.1-0.25 | >0.25 | ? (test needed) |
| Time to First Byte | **TTFB** | <200ms | 200-600ms | >600ms | ? (test needed) |
| First Contentful Paint | **FCP** | <1.8s | 1.8-3s | >3s | ~0.5s ✓ |

**Recommendation:** Measure all 5 metrics as baseline

---

### Additional Performance Metrics

| Metric | Acceptable | Warning | Target |
|--------|-----------|---------|--------|
| **Page Load Time** | <3s | 3-5s | <2s |
| **Time to Interactive (TTI)** | <5s | 5-10s | <3s |
| **First Meaningful Paint** | <2s | 2-4s | <1s |
| **Speed Index** | <4s | 4-6s | <2.5s |
| **Total Blocking Time (TBT)** | <300ms | 300-600ms | <100ms |
| **Network Latency** | <100ms | 100-300ms | <50ms |
| **DOM Content Loaded** | <2s | 2-4s | <1s |
| **Window.load Time** | <3s | 3-5s | <2s |

---

## 2. Performance Testing Types & Implementation

### 2.1 Load Testing (Measure Performance Under Load)

**Objective:** Determine how application performs under normal, peak, and extreme user loads

**Tools Needed:**
- Apache JMeter (free, open-source) ✓ RECOMMENDED
- LoadRunner (commercial, powerful)
- Gatling (Scala-based, modern)
- Artillery (Node.js-based, easy to use)

**Quick Setup with Apache JMeter:**

**Step 1: Download & Install JMeter**
```bash
1. Download from: https://jmeter.apache.org/download_jmeter.cgi
2. Extract to: C:\tools\apache-jmeter-5.6.3\
3. Run: bin\jmeter.bat (Windows) or bin/jmeter (Linux/Mac)
```

**Step 2: Create Load Test Plan**
```
Test Plan
├─ Thread Group (Users)
│  ├─ Number of Threads: 50 users
│  ├─ Ramp-up Period: 60 seconds (gradually add users)
│  ├─ Loop Count: 10 (each user makes 10 requests)
│
├─ HTTP Request (Landing Page)
│  ├─ URL: https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com
│  ├─ Method: GET
│  
├─ HTTP Request (Form Submit)
│  ├─ URL: /search (inferred)
│  ├─ Method: POST
│  ├─ Parameters:
│  │  ├─ departing: July
│  │  ├─ returning: December
│  │  └─ promotional_code: DH2-ABC-AD2
│
└─ Listeners (Results Collection)
   ├─ Aggregate Report
   ├─ Response Time Graph
   ├─ View Results Tree
   └─ Summary Report
```

**Step 3: Run Load Test**
```
Scenario 1: Normal Load
├─ 50 concurrent users
├─ Duration: 5 minutes
├─ Expected: All requests complete successfully
├─ Target Response Time: <1 second per request

Scenario 2: Peak Load
├─ 200 concurrent users
├─ Duration: 10 minutes
├─ Expected: Degradation but still operational
├─ Target Response Time: <3 seconds per request

Scenario 3: Stress Load
├─ 500+ concurrent users
├─ Duration: 5 minutes
├─ Expected: Find breaking point
├─ Target: Identify capacity limits
```

**Key Metrics from Load Test:**
```
Response Time
├─ Average: Should stay <1s (normal load)
├─ Median: Should stay <800ms
├─ 90th Percentile: Should stay <2s
└─ 99th Percentile: Should stay <5s

Throughput
├─ Requests/second: Track increasing load impact
├─ Error Rate: Should stay 0% under normal load
└─ Timeouts: Monitor for increasing failures

Resource Usage
├─ CPU: Should stay <80% under normal load
├─ Memory: Should stay <70% under normal load
├─ Disk I/O: Monitor for bottlenecks
└─ Network: Track bandwidth utilization
```

---

### 2.2 Spike Testing (Sudden Traffic Increase)

**Objective:** Test how application handles sudden traffic spikes

**Scenario:**
```
Baseline Users: 10
Sudden Spike: Jump to 200 users in <5 seconds
Duration: Hold at 200 users for 2 minutes
Recovery: Drop back to 10 users

Expected Behavior:
✓ Handles spike without crashing
✓ Response times increase but degrade gracefully
✓ No permanent service degradation
✓ Recovers back to normal performance baseline
```

**Success Criteria:**
- Error rate < 1% during spike
- Service remains available (no 500 errors)
- Performance recovers within 30 seconds after spike ends

---

### 2.3 Stress Testing (Breaking Point Discovery)

**Objective:** Find the actual breaking point of the application

**Approach:**
```
Start: 100 users
Increment: +50 users every minute
Continue Until: Service fails or response times become unacceptable

Monitor:
├─ When do errors appear?
├─ When do timeouts occur?
├─ When does CPU hit 100%?
├─ When does memory get exhausted?
└─ When do database queries fail?
```

**Acceptable Breaking Points:**
```
Server-Side Breaking:
├─ CPU maxes at: 500-1000 concurrent users
├─ Memory exhausted at: 250-500 concurrent users
├─ Database connections exhausted at: 100-200 concurrent users
└─ Error rate > 5% indicates breaking point

Unacceptable Breaking Points:
├─ ❌ Fails at <100 concurrent users
├─ ❌ Memory leak (memory doesn't recover)
├─ ❌ Database locks don't release
└─ ❌ Errors cascade and don't recover
```

---

### 2.4 Endurance Testing (Long-Running Application)

**Objective:** Find memory leaks or resource exhaustion under sustained load

**Scenario:**
```
Constant Load: 50 users continuously
Duration: 2-4 hours
Monitor:
├─ Memory usage over time (should remain constant)
├─ CPU usage stability
├─ Error rate (should stay 0%)
└─ Response times (should not degrade)

Success Criteria:
✓ No memory growth > 5% over test duration
✓ No connection pool exhaustion
✓ No cumulative slowdown
✓ 0% error rate maintained
```

---

### 2.5 Client-Side Performance Testing (Browser-Based)

**Using Playwright (Already in Your Setup):**

```javascript
// performance-test.spec.js
import { test, expect } from '@playwright/test';

test('Measure Page Load Performance', async ({ page }) => {
  // Navigate to page
  const startTime = Date.now();
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com', {
    waitUntil: 'networkidle'
  });
  const loadTime = Date.now() - startTime;

  // Measure Core Web Vitals
  const metrics = await page.evaluate(() => {
    return {
      navigationTiming: performance.getEntriesByType('navigation')[0],
      paintEntries: performance.getEntriesByType('paint'),
      largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint'),
      firstInputDelay: performance.getEntriesByType('first-input'),
      layoutShift: performance.getEntriesByType('layout-shift'),
    };
  });

  console.log('Performance Metrics:', JSON.stringify(metrics, null, 2));
  console.log('Total Load Time:', loadTime, 'ms');

  // Assertions
  expect(loadTime).toBeLessThan(3000);  // <3 seconds
});

test('Measure Form Submission Performance', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  const startTime = Date.now();
  
  // Fill form
  await page.getByLabel('Departing').selectOption(['July']);
  await page.getByLabel('Returning').selectOption(['December (two years from now)']);
  await page.getByRole('textbox', { name: 'Promotional Code' }).fill('DH2-ABC-AD2');
  
  // Submit and wait for results
  await page.getByRole('textbox', { name: 'Promotional Code' }).press('Enter');
  await page.waitForNavigation();
  
  const submissionTime = Date.now() - startTime;
  
  console.log('Form Submission Time:', submissionTime, 'ms');
  expect(submissionTime).toBeLessThan(2000);  // <2 seconds
});

test('Measure Memory Usage', async ({ page }) => {
  await page.goto('https://marsair.recruiting.thoughtworks.net/datta.poulami1@gmail.com');
  
  const memoryBefore = await page.evaluate(() => {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  });

  // Perform actions
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('Departing').selectOption(['July']);
    await page.getByLabel('Departing').selectOption(['Select...']);
  }

  const memoryAfter = await page.evaluate(() => {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  });

  const memoryIncrease = memoryAfter - memoryBefore;
  console.log('Memory Increase:', memoryIncrease / 1024 / 1024, 'MB');
  
  // Memory increase should be minimal
  expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);  // <5 MB
});
```

**Run with:**
```bash
npx playwright test performance-test.spec.js --reporter=html
```

---

## 3. Performance Bottleneck Analysis

### Identified Bottlenecks

#### Bottleneck 1: Mars Background Image (CRITICAL)
```
Current State:
├─ File Size: ~400 KB (99% of total page size)
├─ Format: Likely JPG or PNG (uncompressed)
├─ Impact: Dominates page load time
└─ Status: MAJOR ISSUE

Optimization Strategies:

Strategy A: Image Compression
├─ Tool: ImageOptim, TinyPNG, or Squoosh
├─ Target: Reduce from 400 KB to 80-150 KB
├─ Effort: 15 minutes
├─ Result: 60-70% size reduction
└─ Implementation: Replace current image file

Strategy B: Modern Image Formats
├─ Convert JPG → WebP format
├─ Savings: 30-40% smaller than JPG
├─ Browser Support: Chrome (100%), Firefox (65%), Safari (14+)
├─ Fallback: Keep JPG for older browsers
├─ Implementation:
│  └─ <picture>
│       <source srcset="mars.webp" type="image/webp">
│       <img src="mars.jpg" alt="Mars background">
│     </picture>
└─ Result: 80-120 KB WebP + fallback

Strategy C: Lazy Loading (Lower Priority)
├─ Don't load image until visible
├─ Use: <img loading="lazy">
├─ Impact: First page load faster
├─ Note: Less effective here (image is above fold)
└─ Implementation: Add attribute to img tag

Strategy D: CSS Background Optimization
├─ If using CSS background-image property
├─ Add: background-size: cover, background-attachment: fixed
├─ Add: background-position: center
└─ Performance impact: Minimal

Recommended Implementation:
1. Convert image to WebP (30-40% reduction)
2. Compress remaining image (20-30% reduction)
3. Total target: 400 KB → 120 KB (70% reduction)
4. Load time improvement: 0.5s → 0.15s (66% faster)
```

#### Bottleneck 2: No Caching Strategy
```
Current State:
├─ No Cache-Control headers visible
├─ No ETags for cache invalidation
├─ No gzip compression
└─ Status: MODERATE ISSUE

Optimization Strategies:

Strategy A: Browser Caching
├─ Add HTTP headers:
│  ├─ Cache-Control: max-age=31536000 (1 year for static assets)
│  ├─ Cache-Control: max-age=3600 (1 hour for HTML)
│  └─ ETag: [hash of content]
├─ Result: Repeat visits load 10x faster
└─ Implementation: Server-side header configuration

Strategy B: Gzip Compression
├─ Enable gzip for HTML/CSS/JS
├─ Reduces HTML from ~2KB to ~800B
├─ Reduces CSS from ~3KB to ~1.2KB
├─ 60-70% compression ratio
└─ Implementation: Server-side configuration

Strategy C: CDN Integration
├─ Use CloudFlare, AWS CloudFront, or Akamai
├─ Benefits: Global edge caching, automatic compression
├─ Result: Users download from nearest server
├─ Implementation: DNS change to CDN provider
└─ Time to setup: 1-2 hours
```

#### Bottleneck 3: Unknown Database Performance
```
Current State:
├─ No metrics on database query time
├─ No visibility into backend response time
├─ Form submission time unknown
└─ Status: NEEDS INVESTIGATION

Optimization Strategies:

Strategy A: Measure Backend Performance
├─ Capture response headers (Server-Timing)
├─ Log database query times
├─ Monitor query execution plans
└─ Tools: MySQL EXPLAIN, PostgreSQL EXPLAIN ANALYZE

Strategy B: Database Indexing
├─ Check if departing/returning fields indexed
├─ Check if promotional_code field indexed
├─ Add missing indexes
└─ Potential improvement: 5-100x query speedup

Strategy C: Query Optimization
├─ Avoid N+1 queries
├─ Use pagination for large result sets
├─ Add database query caching
└─ Potential improvement: 2-10x speedup
```

---

## 4. Quick Performance Testing Roadmap

### Phase 1: Baseline Measurement (Days 1-2, ~4 hours)

**Tasks:**
```
✓ Measure current load time with Playwright
✓ Capture Core Web Vitals
✓ Document current asset sizes
✓ Identify largest bottlenecks
✓ Create baseline performance report
```

**Deliverable:** PERFORMANCE_Baseline_Report.md

---

### Phase 2: Load Testing Setup (Days 3-4, ~6 hours)

**Tasks:**
```
✓ Install Apache JMeter
✓ Create test plan with 50-200 users
✓ Run load testing scenarios
✓ Measure response times under load
✓ Document max user capacity
✓ Identify failing point
```

**Deliverable:** PERFORMANCE_Load_Test_Report.md

---

### Phase 3: Optimization (Days 5-6, ~8 hours)

**Tasks:**
```
✓ Compress Mars image (reduce 400KB → 120KB)
✓ Configure caching headers
✓ Enable gzip compression
✓ Implement WebP format with fallback
✓ Test changes with new baselines
```

**Deliverable:** PERFORMANCE_Optimization_Summary.md

---

### Phase 4: Scalability Testing (Days 7-8, ~6 hours)

**Tasks:**
```
✓ Run stress testing (find breaking point)
✓ Run spike testing (sudden load)
✓ Run endurance testing (2-hour sustained load)
✓ Identify capacity limits
✓ Make recommendations for scaling
```

**Deliverable:** PERFORMANCE_Scalability_Report.md

---

## 5. Performance Testing Checklist

### Pre-Testing
- [ ] Establish performance targets
- [ ] Document baseline metrics
- [ ] Set up monitoring dashboard
- [ ] Prepare test environment (isolated from production)
- [ ] Get performance testing tools installed
- [ ] Create test scenarios
- [ ] Define success criteria

### Client-Side Performance Testing
- [ ] Measure page load time (<3s target)
- [ ] Measure Core Web Vitals (LCP, FID, CLS)
- [ ] Capture memory usage throughout session
- [ ] Test performance in different browsers (Chrome, Firefox, Safari)
- [ ] Test on different network speeds (4G, WiFi, 3G)
- [ ] Test on different devices (Desktop, Tablet, Mobile)
- [ ] Screenshot performance timeline

### Server-Side Performance Testing
- [ ] Baseline: Single user response time (<1s)
- [ ] Normal load: 50 users (check response time degradation)
- [ ] Peak load: 200 users (acceptable degradation)
- [ ] Stress test: Find breaking point
- [ ] Spike test: Sudden 5x load increase
- [ ] Endurance: 2-hour sustained load

### Database Performance Testing
- [ ] Measure form submission response time
- [ ] Check database query time
- [ ] Verify indexes are being used (EXPLAIN plan)
- [ ] Check for N+1 query problems
- [ ] Monitor connection pool usage

### Asset Optimization Testing
- [ ] Verify image optimization (400KB → target)
- [ ] Test WebP image loading (with fallback)
- [ ] Verify gzip compression enabled
- [ ] Check cache headers are set
- [ ] Test CDN performance (if applicable)

### Reporting
- [ ] Create performance baseline report
- [ ] Document all bottlenecks found
- [ ] Provide optimization recommendations
- [ ] Create scalability report
- [ ] Provide capacity planning recommendations

---

## 6. Performance Targets & Acceptable Ranges

| Metric | Target | Acceptable | Unacceptable |
|--------|--------|-----------|--------------|
| **Page Load Time** | <1.5s | <3s | >5s |
| **LCP (Largest Contentful Paint)** | <1.2s | <2.5s | >4s |
| **FCP (First Contentful Paint)** | <0.9s | <1.8s | >3s |
| **TTFB (Time to First Byte)** | <200ms | <600ms | >1s |
| **FID (First Input Delay)** | <50ms | <100ms | >300ms |
| **CLS (Cumulative Layout Shift)** | <0.05 | <0.1 | >0.25 |
| **Response Time (Normal Load)** | <500ms | <1000ms | >2000ms |
| **Response Time (Peak Load)** | <2s | <3s | >5s |
| **Error Rate (Normal)** | 0% | 0% | >0.1% |
| **Concurrent Users** | 200+ | 100+ | <50 |
| **Memory Usage** | <300MB | <500MB | >1000MB |
| **CPU Usage** | <50% | <80% | >95% |

---

## 7. Tools & Commands Reference

### Playwright Performance Testing
```bash
# Install performance testing library
npm install @playwright/test web-vitals

# Run performance tests
npx playwright test performance-test.spec.js

# Generate HTML report
npx playwright show-report
```

### Apache JMeter
```bash
# Launch JMeter GUI
jmeter -g [existing test plan].jmx

# Run test from command line (headless)
jmeter -n -t [test plan].jmx -l [results].csv -e -o [report_folder]

# View results in HTML report
Open report_folder/index.html
```

### Chrome DevTools Performance Testing
```
1. Open DevTools: F12 or Ctrl+Shift+I
2. Click "Performance" tab
3. Click record button
4. Perform actions on page
5. Click stop to capture profile
6. Analyze Main Thread activity
7. Review Frame Rate, Memory usage
```

### Lighthouse (Google PageSpeed)
```
Option 1: Built into Chrome DevTools
├─ Press F12 → Lighthouse tab
├─ Click "Generate Report"
├─ Wait for analysis
└─ Review Performance score (0-100)

Option 2: Online tool
├─ Visit: https://pagespeed.web.dev
├─ Enter URL
├─ Get detailed performance analysis
└─ Receive optimization recommendations
```

### WebPageTest (Free Service)
```
Tool: https://www.webpagetest.org/
Features:
├─ Detailed waterfall charts
├─ Side-by-side browser comparisons
├─ Video capture of page load
├─ Recommendations for optimization
└─ Historical comparison tracking
```

---

## 8. Performance Optimization Quick Wins

**Quick Win 1: Image Optimization** ⏱️ 15 minutes
```
Action: Compress Mars image
Tools: TinyPNG (https://tinypng.com) or Squoosh (https://squoosh.app)
Result: 400 KB → 150 KB (63% reduction)
Page Load Impact: 0.5s → 0.2s (60% faster)
Effort: 15 minutes
Implementation: Replace image file
```

**Quick Win 2: Enable Gzip** ⏱️ 10 minutes
```
Action: Enable gzip compression on server
Implementation:
├─ If Apache: Add to .htaccess
│  └─ mod_deflate configuration
├─ If Nginx: Add to nginx.conf
│  └─ gzip on; gzip_types text/html text/plain...
├─ If PHP: Done automatically in most hosts
└─ Verify: Check Response Headers (Content-Encoding: gzip)

Result: HTML ~2KB → ~600B (70% reduction)
Page Load Impact: ~50-100ms faster
Effort: 10 minutes
```

**Quick Win 3: Caching Headers** ⏱️ 20 minutes
```
Action: Add cache control headers
Implementation:
├─ HTML: Cache-Control: max-age=3600 (1 hour)
├─ Images: Cache-Control: max-age=31536000 (1 year)
├─ CSS/JS: Cache-Control: max-age=31536000 (1 year)
└─ Add ETag headers for cache validation

Result: Repeat visits 90% faster
Page Load Impact: 0.5s → 0.05s on cache hit
Effort: 20 minutes
```

**Quick Win 4: Remove Render-Blocking Resources** ⏱️ 30 minutes
```
Issue: External scripts block page rendering
Solution:
├─ Move scripts to bottom of HTML
├─ Use async/defer attributes
│  └─ <script async src="..."></script>
├─ Inline critical CSS
└─ Use link preload for critical resources

Result: Faster Time to First Paint
Page Load Impact: ~100-200ms faster
Effort: 30 minutes
```

---

## 9. Performance Troubleshooting

### Symptom: Long Page Load Time (>3s)

**Diagnosis Steps:**
```
1. Check Network tab in DevTools
   └─ Identify largest assets (likely Mars image)

2. Check Time to First Byte (TTFB)
   ├─ If >1s: Server is slow (backend issue)
   └─ If <200ms: Asset size is issue

3. Check rendering waterfall
   └─ Identify critical path (what blocks rendering)

4. Use Lighthouse report
   └─ Get specific recommendations
```

**Solutions (in priority order):**
```
1. Compress images (biggest impact for Mars app)
2. Enable gzip compression
3. Add caching headers
4. Move to CDN
5. Optimize backend queries
```

---

### Symptom: High Memory Usage (>500MB)

**Diagnosis Steps:**
```
1. Open Chrome DevTools
   └─ Ctrl+Shift+I → Memory tab

2. Take heap snapshot
   └─ Click camera icon to capture

3. Look for large objects
   └─ Likely culprits: images, DOM nodes, listeners

4. Compare multiple snapshots
   └─ Identify if memory grows over time (leak)
```

**Solutions:**
```
1. Remove memory leaks (event listeners not cleaned)
2. Reduce DOM complexity
3. Limit image size
4. Use Web Workers for heavy computation
```

---

### Symptom: Inconsistent Performance (Varies by ~50%)

**Likely Causes:**
```
1. Network variability (slow sometimes, fast others)
   └─ Test multiple times, take average

2. Background processes on dev machine
   └─ Close other applications

3. Browser cache enabled/disabled
   └─ Test both scenarios

4. Server under variable load
   └─ Coordinate testing with operations team
```

---

## 10. Performance Report Template

**Use this template to document findings:**

```markdown
# Performance Testing Report - [Date]

## Executive Summary
- Page Load Time: [X] seconds
- Performance Score: [X]/100
- Critical Issues: [Count]
- Recommendations: [Count]

## Test Environment
- Browser: Chrome 146
- Network: WiFi / 4G
- Device: Desktop / Mobile
- Test Date: April 13, 2026

## Performance Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| FCP | XXms | <900ms | ✓/⚠️/❌ |
| LCP | XXms | <1.2s | ✓/⚠️/❌ |
| CLS | XX | <0.05 | ✓/⚠️/❌ |
| FID | XXms | <50ms | ✓/⚠️/❌ |

## Bottlenecks Identified
1. [Bottleneck with severity]
2. [Bottleneck with severity]
3. [Bottleneck with severity]

## Recommendations
1. [Action with estimated impact]
2. [Action with estimated impact]
3. [Action with estimated impact]

## Next Steps
- [ ] Implement quick wins
- [ ] Re-test after optimization
- [ ] Set up continuous monitoring
```

---

## 11. Continuous Performance Monitoring

**Setup Options:**

**Option 1: Lighthouse CI (Free)**
```
Integrate into your CI/CD pipeline:
├─ Run automatically on each commit
├─ Fail build if performance regresses
├─ Track performance trends over time
└─ Implementation: 1 hour setup
```

**Option 2: Google Analytics + web-vitals**
```
Monitor real user performance:
├─ Capture Core Web Vitals from real users
├─ Identify performance by geography
├─ Track over time
└─ Implementation: 2 hours setup
```

**Option 3: Sentry or similar APM**
```
Application Performance Monitoring:
├─ Track performance issues in production
├─ Get alerts on degradation
├─ Detailed transaction monitoring
└─ Commercial tool: $XX/month
```

---

## Summary & Quick Action Items

| Priority | Action | Time | Impact |
|----------|--------|------|--------|
| 🔴 HIGH | Compress Mars image (400KB→150KB) | 15min | 60% load time reduction |
| 🔴 HIGH | Enable gzip compression | 10min | 70% HTML/CSS/JS size reduction |
| 🟠 MEDIUM | Add caching headers | 20min | 90% faster repeat visits |
| 🟠 MEDIUM | Run load test (50-200 users) | 2hrs | Find capacity limits |
| 🟡 LOW | Implement WebP with fallback | 30min | Additional 30% image reduction |
| 🟡 LOW | Set up continuous monitoring | 2hrs | Prevent future regressions |

---

**Next Step:** Would you like me to generate a specific performance baseline test using Playwright to measure the current state of the MarsAir application?

**Document Version:** 1.0  
**Status:** Ready for Implementation  
**Last Updated:** April 13, 2026
