import cloudflare from '@presta/adapter-cloudflare-workers'

export const files = ['src/pages/*.ts']
export const plugins = [cloudflare()]
