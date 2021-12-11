export interface AnalyticsCreatePayload {
  analyzeSessionUUID: string

  /** @format date-time */
  analyzeStartAt: string
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
  windowLoad: number
}

export interface AnalyticsDetailParams {
  /** The ISO Date string of the query range start. */
  start?: string

  /** The ISO Date string of the query range end. */
  end?: string

  /** Numeric ID of the account to retrieve. */
  id: number

  /** Analytic field name to retrieve. */
  field:
    | 'ttfb'
    | 'fcp'
    | 'requestTime'
    | 'responseTime'
    | 'dnsLookUp'
    | 'connectionTime'
    | 'tlsTime'
    | 'redirectTime'
    | 'redirectCount'
    | 'unloadTime'
    | 'domInteractive'
    | 'domComplete'
    | 'domContentLoad'
    | 'windowLoad'
}

export type ResourceAnalyticsCreatePayload = {
  analyzeSessionUUID: string
  analyzeStartAt: string
  initiatorType: string
  name: string
  requestTime: number
  responseTime: number
  fetchTime: number
  redirectTime: number
}[]

export interface ResourceAnalyticsDetailParams {
  /** The ISO Date string of the query range start. */
  start?: string

  /** The ISO Date string of the query range end. */
  end?: string

  /** Numeric ID of the account to retrieve. */
  id: number

  /** Resource analytic field name to retrieve. */
  field: 'initiatorType' | 'requestTime' | 'responseTime' | 'fetchTime' | 'redirectTime'
}

export interface ResourceAnalyticsByTypeDetailParams {
  /** The ISO Date string of the query range start. */
  start?: string

  /** The ISO Date string of the query range end. */
  end?: string

  /** Numeric ID of the account to retrieve. */
  id: number

  /** Analytic field name to retrieve. */
  field: 'requestTime' | 'responseTime' | 'fetchTime' | 'redirectTime'
}

export namespace Account {
  /**
   * @description Retrieve an analytic account data by perfAnalyticsId.
   * @name AccountDetail
   * @summary Retrieve an analytic account data by perfAnalyticsId.
   * @request GET:/account/{perfAnalyticsId}
   */
  export namespace AccountDetail {
    export type RequestParams = { perfAnalyticsId: string }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = { status: string; data: { data: { id: number; accountName: string } } }
  }
  /**
   * No description
   * @name AnalyticsCreate
   * @summary Post analytics data for an account
   * @request POST:/account/{id}/analytics
   */
  export namespace AnalyticsCreate {
    export type RequestParams = { id: number }
    export type RequestQuery = {}
    export type RequestBody = AnalyticsCreatePayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieve analytic field.
   * @name AnalyticsDetail
   * @summary Retrieve an analytic field value and time for an analytic account.
   * @request GET:/account/{id}/analytics/{field}
   */
  export namespace AnalyticsDetail {
    export type RequestParams = {
      id: number
      field:
        | 'ttfb'
        | 'fcp'
        | 'requestTime'
        | 'responseTime'
        | 'dnsLookUp'
        | 'connectionTime'
        | 'tlsTime'
        | 'redirectTime'
        | 'redirectCount'
        | 'unloadTime'
        | 'domInteractive'
        | 'domComplete'
        | 'domContentLoad'
        | 'windowLoad'
    }
    export type RequestQuery = { start?: string; end?: string }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = { status: string; data: { value: number; analyzeStartAt: string }[] }
  }
  /**
   * No description
   * @name ResourceAnalyticsCreate
   * @summary Post resource analytics data for an account
   * @request POST:/account/{id}/resourceAnalytics
   */
  export namespace ResourceAnalyticsCreate {
    export type RequestParams = { id: number }
    export type RequestQuery = {}
    export type RequestBody = ResourceAnalyticsCreatePayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieve resource analytic field.
   * @name ResourceAnalyticsDetail
   * @summary Retrieve resource analytic field value and time array for an analytic account.
   * @request GET:/account/{id}/resourceAnalytics/{field}
   */
  export namespace ResourceAnalyticsDetail {
    export type RequestParams = {
      id: number
      field: 'initiatorType' | 'requestTime' | 'responseTime' | 'fetchTime' | 'redirectTime'
    }
    export type RequestQuery = { start?: string; end?: string }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = { status: string; data: { value: number; analyzeStartAt: string }[] }
  }
  /**
   * @description Retrieve aggregated resource analytic field.
   * @name ResourceAnalyticsByTypeDetail
   * @summary Retrieve aggregated resource analytic field value by type for an analytic account.
   * @request GET:/account/{id}/resourceAnalyticsByType/{field}
   */
  export namespace ResourceAnalyticsByTypeDetail {
    export type RequestParams = { id: number; field: 'requestTime' | 'responseTime' | 'fetchTime' | 'redirectTime' }
    export type RequestQuery = { start?: string; end?: string }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = {
      status: string
      data: { initiatorType: string; count: number; avg: number; max: number; min: number }[]
    }
  }
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded'
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ''
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
  }

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    }
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        ...(requestParams.headers || {})
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title PerfAnalyticsAPI
 * @version 1.0.0
 * @license Licensed Under MIT (https://spdx.org/licenses/MIT.html)
 * @contact Yigit Yesilpinar (yigityesilpinar@gmail.com)
 *
 * a restful API which saves data, posted from PerfAnalytics.JS and returns time specific filtered data.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  account = {
    /**
     * @description Retrieve an analytic account data by perfAnalyticsId.
     *
     * @name AccountDetail
     * @summary Retrieve an analytic account data by perfAnalyticsId.
     * @request GET:/account/{perfAnalyticsId}
     */
    accountDetail: (perfAnalyticsId: string, params: RequestParams = {}) =>
      this.request<{ status: string; data: { data: { id: number; accountName: string } } }, any>({
        path: `/account/${perfAnalyticsId}`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name AnalyticsCreate
     * @summary Post analytics data for an account
     * @request POST:/account/{id}/analytics
     */
    analyticsCreate: (id: number, data: AnalyticsCreatePayload, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/account/${id}/analytics`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * @description Retrieve analytic field.
     *
     * @name AnalyticsDetail
     * @summary Retrieve an analytic field value and time for an analytic account.
     * @request GET:/account/{id}/analytics/{field}
     */
    analyticsDetail: ({ id, field, ...query }: AnalyticsDetailParams, params: RequestParams = {}) =>
      this.request<{ status: string; data: { value: number; analyzeStartAt: string }[] }, any>({
        path: `/account/${id}/analytics/${field}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ResourceAnalyticsCreate
     * @summary Post resource analytics data for an account
     * @request POST:/account/{id}/resourceAnalytics
     */
    resourceAnalyticsCreate: (id: number, data: ResourceAnalyticsCreatePayload, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/account/${id}/resourceAnalytics`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * @description Retrieve resource analytic field.
     *
     * @name ResourceAnalyticsDetail
     * @summary Retrieve resource analytic field value and time array for an analytic account.
     * @request GET:/account/{id}/resourceAnalytics/{field}
     */
    resourceAnalyticsDetail: ({ id, field, ...query }: ResourceAnalyticsDetailParams, params: RequestParams = {}) =>
      this.request<{ status: string; data: { value: number; analyzeStartAt: string }[] }, any>({
        path: `/account/${id}/resourceAnalytics/${field}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      }),

    /**
     * @description Retrieve aggregated resource analytic field.
     *
     * @name ResourceAnalyticsByTypeDetail
     * @summary Retrieve aggregated resource analytic field value by type for an analytic account.
     * @request GET:/account/{id}/resourceAnalyticsByType/{field}
     */
    resourceAnalyticsByTypeDetail: (
      { id, field, ...query }: ResourceAnalyticsByTypeDetailParams,
      params: RequestParams = {}
    ) =>
      this.request<
        { status: string; data: { initiatorType: string; count: number; avg: number; max: number; min: number }[] },
        any
      >({
        path: `/account/${id}/resourceAnalyticsByType/${field}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      })
  }
}
