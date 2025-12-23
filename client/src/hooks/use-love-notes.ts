import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertLoveNote, type LoveNote } from "@shared/routes";

export function useLoveNotes() {
  return useQuery({
    queryKey: [api.loveNotes.list.path],
    queryFn: async () => {
      const res = await fetch(api.loveNotes.list.path);
      if (!res.ok) throw new Error("Failed to fetch love notes");
      return api.loveNotes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLoveNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLoveNote) => {
      const res = await fetch(api.loveNotes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send love note");
      }
      
      return api.loveNotes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.loveNotes.list.path] });
    },
  });
}
