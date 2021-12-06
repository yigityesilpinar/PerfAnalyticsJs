import generateUUID from './generateUUID'

export const perfAnalyticsAPIHost = process.env.PERF_ANALYTICS_API || 'http://localhost:8080'
export const analyzeStartAt = new Date().toISOString()
export const analyzeSessionUUID = generateUUID()
