/* eslint-disable no-console */
import { promises } from 'fs'
import { generateApi } from 'swagger-typescript-api'

const apiDocsUrl = process.env.API_DOCS_URL || 'http://localhost:8080/api-docs'
const destination = 'src/api/generated/perfAnalytics'
export const indexTs = `export * from './perfAnalytics'
`

export const generate = async () => {
  try {
    await promises.access(destination)
  } catch {
    await promises.mkdir(destination, { recursive: true })
  }
  const { files } = await generateApi({
    generateRouteTypes: true,
    enumNamesAsValues: true,
    url: apiDocsUrl,
    name: 'perfAnalytics.ts',
    extractRequestParams: true,
    extractRequestBody: true
  })
  files.forEach(async ({ content, name }) => {
    await promises.writeFile(`${destination}/${name}`, content)
  })
  await promises.writeFile(`${destination}/index.ts`, indexTs)
}

generate()
