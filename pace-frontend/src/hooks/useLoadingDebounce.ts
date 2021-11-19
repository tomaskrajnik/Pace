import { useEffect, useState } from 'react';
/**
 * Use to avoid flashing of
 * @param loading
 * @param minLoadTimeMs
 */
export const useLoadingDebounce = (loading: boolean, minLoadTimeMs = 400) => {
    const [debounceLoader, setDebounceLoader] = useState(true);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    // starts loading and the disables it self after minLoadTimeMs, unless loading
    // was switched to false and then true, then the setTimeout is canceled
    const startLoading = () => {
        setDebounceLoader(true);
        const id = setTimeout(() => {
            setDebounceLoader(false);
            setTimeoutId(null);
        }, minLoadTimeMs);
        setTimeoutId(id);
    };

    // when ever the component mounts, the loader starts itself
    useEffect(() => {
        startLoading();
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        //@ts-ignore eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // reapplies the loading effect if loading is set to true within minLoadTimeMs
    useEffect(() => {
        if (loading) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }
            startLoading();
        }
        //@ts-ignore eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, minLoadTimeMs]);
    return debounceLoader || loading;
};
