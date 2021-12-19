import { RefObject } from 'react';

import useEventListener from './useEventListener';

type Handler = (event: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    refs: RefObject<T>[],
    handler: Handler,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {
    refs.forEach((r) => {
        useEventListener(mouseEvent, (event) => {
            const el = r?.current;

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            // Explicit type for "mousedown" event.
            handler(event as unknown as MouseEvent);
        });
    });
}

export default useOnClickOutside;
