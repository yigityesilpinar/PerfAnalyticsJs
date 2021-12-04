import { getFCP } from 'web-vitals'

import { perfAnalyticsAPI } from './config'
import { PerformanceMetricsData } from './types'
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

export const sendToAnalytics = (performanceMetricsData: PerformanceMetricsData) => {
  const body = JSON.stringify(performanceMetricsData)
  if ('sendBeacon' in window.navigator) {
    navigator.sendBeacon(perfAnalyticsAPI, body)
  } else {
    fetch(perfAnalyticsAPI, { body, method: 'POST', keepalive: true })
  }
}

export const getFCPPromise: () => Promise<Pick<PerformanceMetricsData, 'fcp'>> = () =>
  new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject('timeout'), 5000)
    getFCP((metric) => {
      resolve({ fcp: metric.value })
      window.clearTimeout(timeout)
    })
  })
