import { getFCP } from 'web-vitals'

import { perfAnalyticsAPIHost } from './config'
import { PerformanceMetricsData, ResourceMetricsData } from './types'
// https://web.dev/fcp/#differences-between-the-metric-and-the-api

export const waitForLoad = () =>
  new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject('timeout'), 5000)
    const successHandler = () => {
      window.clearTimeout(timeout)
      resolve(true)
    }
    if (document.readyState === 'complete') {
      // Queue a task so the callback runs after `loadEventEnd`.
      setTimeout(successHandler, 0)
    } else {
      // Use `pageshow` so the callback runs after `loadEventEnd`.
      addEventListener('pageshow', successHandler)
    }
  })

interface SendAnalyticEntriesOptions {
  performanceMetricsData: PerformanceMetricsData
  analyticsId: number
}
export const sendAnalyticEntries = ({ performanceMetricsData, analyticsId }: SendAnalyticEntriesOptions) =>
  sendAnalytics({
    endpoint: `${perfAnalyticsAPIHost}/account/${analyticsId}/analytics`,
    body: JSON.stringify(performanceMetricsData)
  })

// collect resourceMetricsDatas before send
let waitingResourceMetricsDatas: ResourceMetricsData[] = []
let sendResourceAnalyticEntriesTimeout = -1
interface SendResourceAnalyticEntriesOptions {
  resourceMetricsDatas: ResourceMetricsData[]
  analyticsId: number
}
export const sendResourceAnalyticEntries = ({
  resourceMetricsDatas,
  analyticsId
}: SendResourceAnalyticEntriesOptions) => {
  window.clearTimeout(sendResourceAnalyticEntriesTimeout)
  waitingResourceMetricsDatas = waitingResourceMetricsDatas.concat(resourceMetricsDatas)
  sendResourceAnalyticEntriesTimeout = window.setTimeout(() => {
    sendAnalytics({
      endpoint: `${perfAnalyticsAPIHost}/account/${analyticsId}/resourceAnalytics`,
      body: JSON.stringify(waitingResourceMetricsDatas)
    })
    waitingResourceMetricsDatas = []
  }, 1000)
}

interface SendAnalytiOptions {
  endpoint: string
  body: string
}

export const sendAnalytics = ({ endpoint, body }: SendAnalytiOptions): Promise<Response | boolean> => {
  if ('sendBeacon' in window.navigator) {
    const blob = new Blob([body], { type: 'application/json; charset=UTF-8' }) // the blob
    const result = navigator.sendBeacon(endpoint, blob)
    return result ? Promise.resolve(result) : Promise.reject(result)
  } else {
    return fetch(endpoint, {
      keepalive: true,
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
  }
}

export const fetchAnalyticsId = (perfAnalyticsId: string) =>
  fetch(`${perfAnalyticsAPIHost}/account/${perfAnalyticsId}`).then((it) => it.json())

export const getFCPPromise: () => Promise<Pick<PerformanceMetricsData, 'fcp'>> = () =>
  new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject('timeout'), 5000)
    getFCP((metric) => {
      resolve({ fcp: metric.value })
      window.clearTimeout(timeout)
    })
  })
