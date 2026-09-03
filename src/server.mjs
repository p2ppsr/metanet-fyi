import { createServer } from 'node:http'
import { createHandler } from './app.mjs'

const port = Number.parseInt(process.env.PORT || '4321', 10)
const server = createServer(createHandler())

server.listen(port, '0.0.0.0', () => {
  console.log(`metanet.fyi listening on http://0.0.0.0:${port}`)
})

function shutdown () {
  server.close(() => process.exit(0))
}

process.once('SIGTERM', shutdown)
process.once('SIGINT', shutdown)
