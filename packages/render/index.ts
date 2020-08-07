import { renderToString } from "react-dom/server";

let renders = 0;

export function render(context: any): any {
  return async function inner(tree: any): Promise<{ html: string; data: object }> {
    const html = renderToString(tree);

    if (renders > 4) {
      console.warn(`@presta/render - excessive data loading. You should consider un-nesting your loaders as much as possible`)
    }

    renders++

    if (!!context.reqs.length) {
      const requests = context.cache.keys.map((key: string) => context.cache.get(key));

      // @ts-ignore
      await Promise.allSettled(requests).then(() => {
        context.id = 0;
        context.reqs = [];
      });

      return inner(tree);
    }

    const data = context.cache.serialize()

    context.id = 0
    context.reqs = []
    context.cache.clear()

    renders = 0

    return {
      html,
      data,
    };
  }
}
