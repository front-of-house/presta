type Obj = { [key: string]: any }

export function pruneObject(obj: Obj) {
  return Object.entries(obj)
    .filter(([key, val]) => !!val)
    .reduce((o, [key, val]) => {
      o[key] = val
      return o
    }, {} as Obj)
}
