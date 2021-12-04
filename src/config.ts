import generateUUID from './generateUUID'

export const perfAnalyticsAPI = process.env.PERF_ANALYTICS_API || 'http://localhost:5000/collect'
export const analyzeStartTimestamp = +new Date()
export const analyzeSessionUUID = generateUUID()
