import { useMutation, useQueryClient } from 'react-query';

const useDeleteMutation = (queryKey, mutationFn, optionsOverride = {}) => {
  const queryClient = useQueryClient();

  const onMutate = async (newData) => {
    await queryClient.cancelQueries(queryKey);
    const previousData = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (oldData) => {
      return [...oldData].filter((data) => data.id !== newData);
    });
    return { previousData };
  };

  const onError = (err, newData, context) => {
    queryClient.setQueryData(queryKey, context.previousData);
  };

  const onSuccess = (data, newData, context) => {
    queryClient.invalidateQueries('todos');
  };

  return useMutation(mutationFn, {
    onMutate: onMutate,
    onError: onError,
    onSuccess: onSuccess,
    ...optionsOverride
  });
};

export default useDeleteMutation;
