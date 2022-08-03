declare type GenericObject = {
  [key: string]: any
}
export declare type HeadElementWithChildren<T> = {
  children?: string
} & T
export declare type Meta = Partial<Omit<HTMLMetaElement, 'children'>> | string
export declare type Link = Partial<Omit<HTMLLinkElement, 'children'>> | string
export declare type Style = Partial<HeadElementWithChildren<Omit<HTMLStyleElement, 'children'>>> | string
export declare type Script = Partial<HeadElementWithChildren<Omit<HTMLScriptElement, 'children'>>> | string
export declare type HeadElement = Meta | Link | Style | Script
declare type Social = {
  title?: string
  description?: string
  image?: string
  url?: string
  [key: string]: string | undefined
}
export declare type PrestaHead = {
  title: string
  description: string
  image: string
  url: string
  og: Social
  twitter: Social
  meta: Meta[]
  link: Link[]
  script: Script[]
  style: Style[]
}
export declare type DocumentProperties = {
  body?: string
  head?: Partial<PrestaHead>
  foot?: Partial<Pick<PrestaHead, 'script' | 'style'>>
  htmlAttributes?: Partial<{
    [key in keyof HTMLHtmlElement]: string
  }>
  bodyAttributes?: Partial<HTMLBodyElement>
}
export declare function pruneEmpty(obj: GenericObject): GenericObject
export declare function filterUnique(arr: HeadElement[]): HeadElement[]
export declare function tag(name: string): (props: HeadElement) => string
export declare function prefixToObjects(
  prefix: string,
  props: Social
): HeadElementWithChildren<Partial<HTMLMetaElement>>[]
export declare function createHeadTags(config?: Partial<PrestaHead>): string
export declare function createFootTags(config?: Partial<Pick<PrestaHead, 'script' | 'style'>>): string
/**
 * Generates a string representing a complete HTML document
 */
export declare function html({ body, head, foot, htmlAttributes, bodyAttributes }: DocumentProperties): string
export {}
