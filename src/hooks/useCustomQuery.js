import { useQuery } from 'react-query';

const useCustomQuery = (queryKey, queryFn, optionsOverride = {}) => {
  const opts = {
    cacheTime: 60000,
    // refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    retry: 2,
    ...optionsOverride
  };
  return useQuery(queryKey, queryFn, opts);
};

export default useCustomQuery;
