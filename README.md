# PerfAnalyticsJS

PerfAnalyticsJS is a client-side library, which collects some performance related key metrics from browser and sends to the PerfAnalyticsAPI

## Acceptance Criterias

- It does not harm clients performance
- It should measure TTFB, FCP, Dom Load, and Window Load events
- It should measure Network timings for Document, Image, Font, JS, and CSS
- It should work on all modern browsers Except Microsoft Products
- It should send performance metrics to API in a proper way.
- It should be generic and can be used in any web application (big plus)
- It should smaller than 3KB Gzip (big plus)

# Installation

```
npm install @yigitysl/perfanalyticsjs
```

# How to use


PerfAnalyticsJS is designed to be used in the browser. Import and construct, will send perforamance analyticts to PerfAnalyticsAPI. You can enable debug.

```
import PerfAnalytics from '@yigitysl/perfanalyticsjs'

const perfAnalytics = new PerfAnalytics({
  perfAnalyticsId: 'xxxxxxxxxxxx'
  // debug: true
})
```

or


```
<script async src="https://yy-perf-analytics-dashboard.herokuapp.com/PerfAnalytics.js"/>

window.PerfAnalyticsJS({
   perfAnalyticsId: 'xxxxxxxxxxxx',
 //  debug: true
})
```

# Summary

- 2.7K Gzipped PerfAnalytics.js.gz
- Developed with typescript, exports its type definitions
- CI & CD with github workflows 
- Npm library published https://www.npmjs.com/package/@yigitysl/perfanalyticsjs
- using eslint with eslint-compat-plugin and browserslist to avoid browser support issues
- Generates API types with swagger script from API docs 
- Send data using sendBeacon when possible, see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
  

