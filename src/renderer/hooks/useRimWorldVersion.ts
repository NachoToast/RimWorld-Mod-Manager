import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getRimWorldVersion, getRimWorldVersionOverride } from '../redux/slices/main';

function useRimWorldVersion(): number {
    const { native: rimWorldVersion, fallback } = useSelector(getRimWorldVersion);
    const overridenVersion = useSelector(getRimWorldVersionOverride);

    const finalVersion = useMemo(
        () => overridenVersion || rimWorldVersion?.major || fallback,
        [fallback, overridenVersion, rimWorldVersion?.major],
    );

    return finalVersion;
}

export default useRimWorldVersion;
