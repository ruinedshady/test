import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertMemory, type Memory } from "@shared/routes";

export function useMemories() {
  return useQuery({
    queryKey: [api.memories.list.path],
    queryFn: async () => {
      const res = await fetch(api.memories.list.path);
      if (!res.ok) throw new Error("Failed to fetch memories");
      return api.memories.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMemory) => {
      const res = await fetch(api.memories.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create memory");
      }
      
      return api.memories.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.memories.list.path] });
    },
  });
}
