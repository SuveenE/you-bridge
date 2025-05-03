import { useQuery } from '@tanstack/react-query';

const getAllChats = async () => {
  return [];
};

export default function useChats() {
  const { isLoading, data } = useQuery({
    queryKey: ['allChats'],
    queryFn: getAllChats,
  });
  return { data, isLoading };
}
