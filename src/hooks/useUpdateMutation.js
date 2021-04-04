import { useMutation, useQueryClient } from "react-query";

const useUpdateMutation = (queryKey, mutationFn, optionsOverride = {}) => {
  const queryClient = useQueryClient();

  const onMutate = async (newData) => {
    await queryClient.cancelQueries(queryKey);
    const previousData = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (oldData) => {
      const { id, update } = newData;
      return [...oldData].map((data) => {
        return data.id === id ? { ...data, ...update } : data;
      });
    });
    return { previousData };
  };

  const onError = (err, newData, context) => {
    queryClient.setQueryData(queryKey, context.previousData);
  };

  const onSuccess = (data, newData, context) => {
    queryClient.invalidateQueries("todos");
  };

  return useMutation(mutationFn, {
    onMutate: onMutate,
    onError: onError,
    onSuccess: onSuccess,
    ...optionsOverride,
  });
};

export default useUpdateMutation;
