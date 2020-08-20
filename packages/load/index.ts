import { cache as prestaCache } from '@presta/cache'

type Component = () => string;
type Context = { pathname: string; head: string; body: string; data: { [key: string]: any } };
type Renderer = (component: Component, ctx: Context) => string;

let _id = 0;
let _reqs: string[] = [];
let _cache: { [key: string]: Promise<any> } = {};

function isPending() {
  return !!_reqs.length;
}

function resolve() {
  const requests = Object.keys(_cache).map((key) => _cache[key]);

  // @ts-ignore
  return Promise.allSettled(requests).then(() => {
    _id = 0;
    _reqs = [];
  });
}

function cache(key: string, loader: () => Promise<any>) {
  if (_cache[key]) return _cache[key];

  _reqs.push(key);

  _cache[key] = loader();

  _cache[key].then((res) => {
    _cache[key] = res;
    _reqs.splice(_reqs.indexOf(key), 1);
  });

  return null;
}

export function load(
  loader: () => Promise<any>,
  options: {
    key?: string;
    cache?: string;
  } = {}
) {
  const { key = _id++ + "", cache: duration } = options

  if (key && duration) {
    return cache(key, () => prestaCache(loader, { key, duration }));
  }

  return cache(key, loader);
}

export async function render(
  component: Component,
  ctx: Context,
  renderer: Renderer
): Promise<Context> {
  const body = renderer(component, ctx);

  if (isPending()) {
    await resolve();
    return render(component, ctx, renderer);
  }

  _reqs = [];

  return {
    ...ctx,
    body: body + (ctx.body || ''),
    data: {
      ..._cache,
      ...(ctx.data || {}),
    },
  };
}
