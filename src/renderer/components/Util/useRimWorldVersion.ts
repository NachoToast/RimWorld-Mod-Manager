import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fallBackVersion } from '../../constants/constants';
import { getRimWorldVersion, getRimWorldVersionOverride } from '../../redux/slices/main.slice';

function useRimWorldVersion(): number {
    const rimWorldVersion = useSelector(getRimWorldVersion);
    const overridenVersion = useSelector(getRimWorldVersionOverride);

    const finalVersion = useMemo(
        () => overridenVersion || rimWorldVersion?.major || fallBackVersion,
        [overridenVersion, rimWorldVersion?.major],
    );

    return finalVersion;
}

export default useRimWorldVersion;
