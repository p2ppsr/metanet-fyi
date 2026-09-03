import { cp, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import './generate-social-cards.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await cp(join(root, 'src'), join(dist, 'src'), { recursive: true })
await cp(join(root, 'public'), join(dist, 'public'), { recursive: true })
console.log(`Built metanet.fyi into ${dist}`)
