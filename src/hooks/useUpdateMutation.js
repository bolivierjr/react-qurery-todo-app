import { useMutation, useQueryClient } from 'react-query';

const useUpdateMutation = (queryKey, mutationFn, optionsOverride = {}) => {
  if (!optionsOverride.onMutate) throw new Error('Missing onMutate override.');
  const queryClient = useQueryClient();

  const onError = (err, newData, context) => {
    queryClient.setQueryData(queryKey, context.previousData);
  };

  const onSuccess = (data, newData, context) => {
    queryClient.invalidateQueries(queryKey);
  };

  return useMutation(mutationFn, {
    onError: onError,
    onSuccess: onSuccess,
    ...optionsOverride
  });
};

export default useUpdateMutation;
