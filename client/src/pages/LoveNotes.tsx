import { motion } from "framer-motion";
import { Send, Loader2, StickyNote } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Masonry from "react-masonry-css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLoveNotes, useCreateLoveNote } from "@/hooks/use-love-notes";
import { insertLoveNoteSchema } from "@shared/routes";
import { HeartBackground } from "@/components/HeartBackground";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = insertLoveNoteSchema;

// Pastel colors for notes
const NOTE_COLORS = [
  "bg-yellow-100",
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-orange-100",
];

export default function LoveNotes() {
  const { data: notes, isLoading } = useLoveNotes();
  const createNote = useCreateLoveNote();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      author: "Me",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createNote.mutateAsync(values);
      toast({ title: "Note Added to Jar!", description: "It's stored with love." });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add note.", variant: "destructive" });
    }
  }

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="min-h-screen pb-24">
      <HeartBackground />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl mb-2">Jar of Love</h1>
            <p className="text-muted-foreground">Little notes to make you smile</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
                <Send className="mr-2 h-5 w-5" /> Write Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-pink-100">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Write a Love Note</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="You make me smile because..." 
                            className="min-h-[120px] rounded-xl border-pink-200 resize-none text-lg font-handwriting" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value || 'Me'}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Me" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Me</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="You" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">You</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full rounded-xl" disabled={createNote.isPending}>
                    {createNote.isPending ? "Putting in jar..." : "Put in Jar"}
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
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-6"
            columnClassName="pl-6 bg-clip-padding"
          >
            {notes?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground col-span-full w-full">
                <StickyNote className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>The jar is empty. Write the first note!</p>
              </div>
            ) : (
              notes?.map((note, i) => {
                const randomRotation = (i % 5 - 2) * 2; // Slight rotation between -4deg and 4deg
                const colorClass = NOTE_COLORS[i % NOTE_COLORS.length];
                
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "mb-6 p-6 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 relative",
                      colorClass
                    )}
                    style={{ 
                      transform: `rotate(${randomRotation}deg)`,
                    }}
                  >
                    {/* Tape effect */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm" />
                    
                    <p className="text-lg md:text-xl font-display text-gray-800 leading-relaxed mb-4">
                      {note.content}
                    </p>
                    <div className="flex justify-end">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        - {note.author}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </Masonry>
        )}
      </div>
    </div>
  );
}
