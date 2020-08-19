type Component = () => string;
type Context = { pathname: string };
type Renderer = (component: Component, ctx: Context) => string;
type Resolved = { body: string; data: { [key: string]: any } };

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
  } = {}
) {
  const key = options.key || _id++ + "";
  return cache(key, loader);
}

export async function render(
  component: Component,
  ctx: Context,
  renderer: Renderer
): Promise<Resolved> {
  const body = renderer(component, ctx);

  if (isPending()) {
    await resolve();
    return render(component, ctx, renderer);
  }

  _reqs = [];

  return {
    body,
    data: _cache,
  };
}
