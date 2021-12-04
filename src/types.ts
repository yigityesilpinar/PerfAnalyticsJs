export interface PerfAnalyticsInitOptions {
  perfAnalyticsId: string | undefined
  debug?: boolean
}

export interface PerformanceMetricsData {
  ttfb: number
  fcp: number
  requestTime: number
  responseTime: number
  dnsLookUp: number
  connectionTime: number
  tlsTime: number
  redirectTime: number
  redirectCount: number
  unloadTime: number
  domInteractive: number
  domComplete: number
  domContentLoad: number
}

export interface ResourceMetricsData extends Pick<PerformanceResourceTiming, 'initiatorType' | 'name'> {
  requestTime: number
  responseTime: number
  fetchTime: number
  redirectTime: number
}
