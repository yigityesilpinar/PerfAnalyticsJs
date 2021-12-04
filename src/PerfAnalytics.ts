import { PerformanceMetricsData, PerfAnalyticsInitOptions, ResourceMetricsData } from './types'
import { waitForLoad, getFCPPromise } from './utils'

class PerfAnalytics {
  constructor(private perfAnalyticsInitOptions: PerfAnalyticsInitOptions) {
    this.analyze()
  }
  analyze = async () => {
    try {
      await waitForLoad()

      const fcpMetric = await getFCPPromise()
      const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      const metrics: PerformanceMetricsData = {
        ...fcpMetric,
        ttfb: navigationEntry.responseStart,
        requestTime: navigationEntry.responseStart - navigationEntry.requestStart,
        responseTime: navigationEntry.responseEnd - navigationEntry.responseStart,
        dnsLookUp: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        connectionTime: navigationEntry.connectEnd - navigationEntry.connectStart,
        tlsTime: navigationEntry.connectEnd - navigationEntry.secureConnectionStart,
        redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectEnd,
        redirectCount: navigationEntry.redirectCount,
        unloadTime: navigationEntry.unloadEventEnd - navigationEntry.unloadEventStart,
        domInteractive: navigationEntry.domInteractive,
        domComplete: navigationEntry.domComplete,
        domContentLoad: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart
      }
      if (this.perfAnalyticsInitOptions.debug) {
        // eslint-disable-next-line no-console
        console.log(metrics)
      }

      new PerformanceObserver((entryList) => {
        // https://web.dev/navigation-and-resource-timing/#requests-and-responses
        const entries = entryList.getEntries()
        const mappedEntries = entries.map((entry) => {
          const typedEntry = entry as PerformanceResourceTiming
          return {
            name: typedEntry.name,
            initiatorType: typedEntry.initiatorType,
            requestTime: typedEntry.responseStart - typedEntry.requestStart,
            responseTime: typedEntry.responseEnd - typedEntry.responseStart,
            fetchTime: typedEntry.responseEnd - typedEntry.fetchStart,
            redirectTime: typedEntry.redirectEnd - typedEntry.redirectEnd
          } as ResourceMetricsData
        })
      }).observe({
        type: 'resource',
        buffered: true
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error on analyze', err)
    }
  }
}

export default PerfAnalytics
