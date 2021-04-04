import { useMutation, useQueryClient } from "react-query";

const useCreateMutation = (queryKey, mutationFn, optionsOverride = {}) => {
  const queryClient = useQueryClient();

  const onMutate = async (newData) => {
    await queryClient.cancelQueries(queryKey);
    const previousData = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (oldData) => {
      return [
        {
          id: "fakeId",
          completed: false,
          prioritized: false,
          description: newData,
        },
        ...oldData,
      ];
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

export default useCreateMutation;
