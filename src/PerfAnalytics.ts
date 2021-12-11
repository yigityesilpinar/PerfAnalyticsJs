import { AnalyticsCreatePayload, ResourceAnalyticsCreatePayload } from './api/generated/perfAnalytics'
import { analyzeSessionUUID, analyzeStartAt, perfAnalyticsAPIHost } from './config'
import { waitForLoad, getFCPPromise, sendAnalyticEntries, fetchAnalyticsId, sendResourceAnalyticEntries } from './utils'
import { PerfAnalyticsInitOptions } from './types'

class PerfAnalytics {
  private perfAnalyticsId: string
  private analyticsId: number | undefined
  constructor(private perfAnalyticsInitOptions: PerfAnalyticsInitOptions) {
    if (this.perfAnalyticsInitOptions.perfAnalyticsId) {
      this.perfAnalyticsId = this.perfAnalyticsInitOptions.perfAnalyticsId
    } else {
      const params = new URLSearchParams(window.location.search)
      const perfAnalyticsIdParam = params.get('perfAnalyticsId')
      if (perfAnalyticsIdParam) {
        this.perfAnalyticsId = perfAnalyticsIdParam
      } else {
        throw new Error('Error on PerfAnalytics constructor: "perfAnalyticsId" must be passed')
      }
    }

    this.analyze()
  }

  getAnalyticsId = async (): Promise<number> => {
    if (typeof this.analyticsId === 'number') {
      return this.analyticsId
    } else {
      const response = await fetchAnalyticsId(this.perfAnalyticsId)
      if (response?.data?.id) {
        this.analyticsId = response.data.id
        return response.data.id
      } else {
        throw Error('Error getting analytics Id')
      }
    }
  }

  analyze = async () => {
    try {
      await Promise.all([waitForLoad(), this.getAnalyticsId()])
      const analyticsId = await this.getAnalyticsId()
      const fcpMetric = await getFCPPromise()
      const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      const performanceMetricsData: AnalyticsCreatePayload = {
        analyzeSessionUUID,
        analyzeStartAt,
        fcp: fcpMetric.fcp,
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
        domContentLoad: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
        windowLoad: navigationEntry.loadEventEnd - navigationEntry.loadEventStart
      }
      if (this.perfAnalyticsInitOptions.debug) {
        // eslint-disable-next-line no-console
        console.log(performanceMetricsData)
      }
      sendAnalyticEntries({
        analyticsId,
        performanceMetricsData
      })

      new PerformanceObserver((entryList) => {
        // https://web.dev/navigation-and-resource-timing/#requests-and-responses
        const entries = entryList.getEntries()
        const resourceMetricsDatas = entries
          .filter((entry) => !entry.name.startsWith(perfAnalyticsAPIHost))
          .map((entry) => {
            const typedEntry = entry as PerformanceResourceTiming
            return {
              analyzeSessionUUID,
              analyzeStartAt,
              name: typedEntry.name,
              initiatorType: typedEntry.initiatorType,
              requestTime: typedEntry.responseStart - typedEntry.requestStart,
              responseTime: typedEntry.responseEnd - typedEntry.responseStart,
              fetchTime: typedEntry.responseEnd - typedEntry.fetchStart,
              redirectTime: typedEntry.redirectEnd - typedEntry.redirectEnd
            } as ResourceAnalyticsCreatePayload[number]
          })
        if (resourceMetricsDatas.length) {
          if (this.perfAnalyticsInitOptions.debug) {
            // eslint-disable-next-line no-console
            console.log(resourceMetricsDatas)
          }
          sendResourceAnalyticEntries({
            analyticsId,
            resourceMetricsDatas
          })
        }
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
