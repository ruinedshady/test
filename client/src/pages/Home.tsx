import { motion } from "framer-motion";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Heart, Sparkles } from "lucide-react";
import { HeartBackground } from "@/components/HeartBackground";
import { useEffect, useState } from "react";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center mt-8">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.2 }}
          className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-pink-100 min-w-[90px]"
        >
          <span className="text-3xl md:text-4xl font-bold text-primary font-display">
            {Math.max(0, item.value)}
          </span>
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  // Set a date in the future for "Next Date" or "Anniversary"
  // If user didn't specify, default to 7 days from now
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 5); 

  return (
    <div className="min-h-screen pb-24">
      <HeartBackground />
      
      <main className="container mx-auto px-4 pt-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <Sparkles className="absolute -top-8 -right-8 text-yellow-400 w-12 h-12 animate-pulse" />
          <Heart className="w-32 h-32 text-primary fill-pink-300 animate-bounce" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl mt-8 mb-4 drop-shadow-sm"
        >
          For My Favorite Person
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Every moment with you is my favorite memory. I built this little corner of the internet just for us.
        </motion.p>

        <div className="mt-16 w-full max-w-3xl">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
            <h2 className="text-3xl mb-2 text-primary">Countdown to Our Next Date</h2>
            <p className="text-muted-foreground mb-6">I can't wait to see you again!</p>
            <Countdown targetDate={nextDate} />
          </div>
        </div>

        {/* Decorative Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 md:p-12 relative"
        >
          <span className="text-6xl text-pink-200 absolute top-0 left-0 font-display">"</span>
          <p className="text-2xl md:text-3xl font-display text-primary/80 italic relative z-10 px-6">
            You are the finest, loveliest, tenderest, and most beautiful person I have ever known—and even that is an understatement.
          </p>
          <span className="text-6xl text-pink-200 absolute bottom-0 right-0 font-display">"</span>
          <p className="mt-4 text-sm text-muted-foreground font-semibold uppercase tracking-widest">- F. Scott Fitzgerald</p>
        </motion.div>
      </main>
    </div>
  );
}
