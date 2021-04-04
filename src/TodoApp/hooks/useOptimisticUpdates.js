import { useQueryClient } from 'react-query';

const useOptimisticUpdates = (queryKey) => {
  const queryClient = useQueryClient();

  return {
    onMutateCreate: async (newData) => {
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);
      // Set optimistic udpdate
      queryClient.setQueryData(queryKey, (oldData) => {
        return [
          {
            id: 'fakeId',
            completed: false,
            prioritized: false,
            description: newData
          },
          ...oldData
        ];
      });
      return { previousData };
    },

    onMutateDelete: async (newData) => {
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);
      // Set optimistic udpdate
      queryClient.setQueryData(queryKey, (oldData) => {
        return [...oldData].filter((data) => data.id !== newData);
      });
      return { previousData };
    },

    onMutateUpdate: async (newData) => {
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);
      // Set optimistic udpdate
      queryClient.setQueryData(queryKey, (oldData) => {
        const { id, update } = newData;
        return [...oldData].map((data) => {
          return data.id === id ? { ...data, ...update } : data;
        });
      });
      return { previousData };
    }
  };
};

export default useOptimisticUpdates;
