import React from "react";
import lur from "lur";

type Options = {
  key?: string;
};

type DataloaderState<T> = {
  loading: boolean;
  reloading: boolean;
  result: T;
};

const isServer = typeof window === "undefined";
const win = isServer ? {} : window;
export const initialData: object =
  // @ts-ignore
  isServer ? {} : win.__hydrate || {};

export let context: {
  id: number;
  reqs: any[];
  cache: ReturnType<typeof lur>;
} = {
  id: 0,
  reqs: [],
  cache: lur(1000, initialData),
}

export function getContext() {
  return context
}

export function configure({ cacheSize }: { cacheSize: number }) {
  context.cache = lur(cacheSize, context.cache.serialize())
}

/*
 * CLIENT
 */

export function useDataloader<T>(
  loader: () => Promise<T>,
  deps: any[] = [],
  options: Options = {}
): DataloaderState<T> & { reload: () => void } {
  let result = null;
  const { key } = options;

  if (isServer) {
    const id = key || context.id++ + "";
    result = context.cache.get(id);

    if (!result) {
      context.reqs.push(id);

      const req = loader();

      context.cache.set(id, req);

      req.then((res: any) => {
        context.cache.set(id, res);
        context.reqs.splice(context.reqs.indexOf(id), 1);
      });
    }
  } else if (key) {
    result = context.cache.get(key);
  }

  const [state, setState] = React.useState<DataloaderState<T>>({
    loading: !result,
    reloading: false,
    result: (result as unknown) as T,
  });

  const reload = React.useCallback(async () => {
    setState({
      ...state,
      reloading: !state.loading,
    });

    const res = await loader();

    if (key) {
      context.cache.set(key, res);
    }

    setState({
      loading: false,
      reloading: false,
      result: res,
    });
  }, [state, setState, loader]);

  React.useEffect(() => {
    reload();
  }, deps);

  return {
    ...state,
    reload,
  };
}
