/* eslint-disable no-param-reassign */
import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export function useCombinedRefs<T>(...refs: (React.MutableRefObject<T> | React.ForwardedRef<T> | Function)[]) {
    const targetRef = React.useRef<T>(null);

    React.useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) return;

            if (typeof ref === 'function') {
                ref(targetRef.current);
            } else {
                ref.current = targetRef.current;
            }
        });
    }, [refs]);

    return targetRef;
}
