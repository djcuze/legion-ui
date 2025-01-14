import {useEffect, useMemo, useRef} from "react";
import { debounce } from '@mui/material/utils'

export const useDebounce = (callback) => {
    const ref = useRef(callback);

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    return useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 800);
    }, []);
};
