export let headCache = {}

export function head (obj) {
  headCache = { ...headCache, ...obj }
}
