/// <reference types="node" />
import http from 'http';
import { Event } from '../';
/**
 * Used internally. Converts a `http.IncomingMessage` to a AWS Lambda flavored
 * `Event` object. This method only has access to the incoming message, so it
 * can't populate all `Event` properties, like `pathParameters`.
 */
export declare function requestToEvent(req: http.IncomingMessage): Promise<Event>;
