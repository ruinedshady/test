import { motion } from "framer-motion";
import { Calendar, Star, Heart, BellRing, Flag, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTimeline, useCreateTimelineEvent } from "@/hooks/use-timeline";
import { insertTimelineEventSchema } from "@shared/routes";
import { HeartBackground } from "@/components/HeartBackground";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = insertTimelineEventSchema.extend({
  date: z.string().transform((str) => new Date(str)),
});

const ICONS = {
  heart: Heart,
  star: Star,
  ring: BellRing, // Note: Lucide might not have 'BellRing', fallback to Circle or custom
  flag: Flag,
  calendar: Calendar,
};

export default function Timeline() {
  const { data: events, isLoading } = useTimeline();
  const createEvent = useCreateTimelineEvent();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "heart",
      date: new Date().toISOString().split("T")[0] as any,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createEvent.mutateAsync(values);
      toast({ title: "Milestone Added!", description: "Another step in our journey." });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save event.", variant: "destructive" });
    }
  }

  // Sort events by date
  const sortedEvents = events?.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <div className="min-h-screen pb-24">
      <HeartBackground />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl mb-2">Our Story</h1>
            <p className="text-muted-foreground">Every step we took together</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-5 w-5" /> Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-pink-100">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Add a Milestone</DialogTitle>
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
                          <Input placeholder="First Date..." {...field} className="rounded-xl border-pink-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="rounded-xl border-pink-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || 'heart'}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-pink-200">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="heart">Heart</SelectItem>
                              <SelectItem value="star">Star</SelectItem>
                              <SelectItem value="flag">Flag</SelectItem>
                              <SelectItem value="calendar">Calendar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What happened?" {...field} className="rounded-xl border-pink-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full rounded-xl" disabled={createEvent.isPending}>
                    {createEvent.isPending ? "Adding..." : "Add Milestone"}
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
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-pink-200 -translate-x-1/2" />

            {sortedEvents.map((event, i) => {
              const IconComponent = ICONS[event.icon as keyof typeof ICONS] || Heart;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={cn(
                    "relative flex items-center gap-8 mb-12",
                    "md:justify-center"
                  )}
                >
                  {/* Timeline Point */}
                  <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full border-4 border-pink-200 flex items-center justify-center z-10 shadow-sm">
                    <IconComponent className="w-4 h-4 text-primary fill-pink-100" />
                  </div>

                  {/* Content Card */}
                  <div className={cn(
                    "ml-[60px] md:ml-0 flex-1 md:flex-none md:w-[calc(50%-40px)]",
                    isEven ? "md:mr-auto md:text-right" : "md:ml-auto"
                  )}>
                    <div className={cn(
                      "bg-white p-6 rounded-2xl shadow-md border border-pink-50 hover:shadow-lg transition-shadow",
                      "relative before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:border-[8px] before:border-transparent",
                      isEven 
                        ? "md:before:-right-[16px] md:before:border-l-white before:-left-[16px] before:border-r-white md:before:border-r-transparent" 
                        : "before:-left-[16px] before:border-r-white"
                    )}>
                      <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
