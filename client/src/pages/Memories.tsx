import { motion } from "framer-motion";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMemories, useCreateMemory } from "@/hooks/use-memories";
import { insertMemorySchema } from "@shared/routes";
import { HeartBackground } from "@/components/HeartBackground";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertMemorySchema.extend({
  // Override date to be string for input, then coerce
  date: z.string().transform((str) => new Date(str)),
});

export default function Memories() {
  const { data: memories, isLoading } = useMemories();
  const createMemory = useCreateMemory();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      date: new Date().toISOString().split("T")[0] as any,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createMemory.mutateAsync(values);
      toast({ title: "Memory Saved!", description: "Another beautiful moment stored forever." });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save memory.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <HeartBackground />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl mb-2">Our Gallery</h1>
            <p className="text-muted-foreground">Snapshots of our journey together</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Plus className="mr-2 h-5 w-5" /> Add Memory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-pink-100">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Add a Memory</DialogTitle>
                <DialogDescription>Paste a link to a photo of us!</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Beach Day..." {...field} className="rounded-xl border-pink-200 focus-visible:ring-pink-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} className="rounded-xl border-pink-200 focus-visible:ring-pink-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl border-pink-200 focus-visible:ring-pink-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="We had so much fun..." {...field} className="rounded-xl border-pink-200 focus-visible:ring-pink-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full rounded-xl" disabled={createMemory.isPending}>
                    {createMemory.isPending ? "Saving..." : "Save Memory"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories?.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
                <p>No memories yet. Add our first photo!</p>
              </div>
            ) : (
              memories?.map((memory, i) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-pink-100 border border-white hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback image if load fails
                        e.currentTarget.src = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{memory.title}</h3>
                      <span className="text-xs font-semibold bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                        {new Date(memory.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">{memory.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
