/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Handler, Event } from 'presta';
export declare type VercelEvent = Event & {
    env: NextApiRequest['env'];
    cookies: {
        [cookie: string]: string;
    };
};
export declare function requestToEvent(req: NextApiRequest): VercelEvent;
export declare function adapter(handler: Handler): (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
