import { useReadContract, useWriteContract } from 'wagmi';
import { TODO_CONTRACT_ABI, TODO_CONTRACT_ADDRESS } from './todoContract';

export function useAddTodo() {
  const { writeContractAsync, isPending } = useWriteContract();

  const addTodo = (title: string, description: string) => {
    return writeContractAsync({
      address: TODO_CONTRACT_ADDRESS,
      abi: TODO_CONTRACT_ABI,
      functionName: 'addTodo',
      args: [title, description],
    });
  };

  return { addTodo, isLoading: isPending };
}

export function useMarkTodo() {
  const { writeContractAsync, isPending } = useWriteContract();

  const markTodo = (id: number) => {
    return writeContractAsync({
      address: TODO_CONTRACT_ADDRESS,
      abi: TODO_CONTRACT_ABI,
      functionName: 'markTodo',
      args: [BigInt(id)],
    });
  };

  return { markTodo, isLoading: isPending };
}

export function useReadTodo(id: number) {
  const { data, isPending, isError } = useReadContract({
    address: TODO_CONTRACT_ADDRESS,
    abi: TODO_CONTRACT_ABI,
    functionName: 'readTodo',
    args: [BigInt(id)],
  });

  return { data, isLoading: isPending, isError };
}
