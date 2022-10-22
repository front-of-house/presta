import { Event } from '../'
/**
 * Takes a `Partial<Event>` and returns `Event`. Requires at least an `event.path` property.
 */
export declare function normalizeEvent(event: Pick<Event, 'path'> & Partial<Omit<Event, 'path'>>): Event
