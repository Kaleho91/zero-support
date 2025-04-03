import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" },
};

const fadeInStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function ZeroSupportLanding() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-40 px-6 relative overflow-hidden">
        <motion.div
          variants={fadeInStagger}
          initial="hidden"
          animate="show"
          className="z-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            variants={fadeInUp}
          >
            Support Isn't Scaled. <br />It's Deleted.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
            variants={fadeInUp}
          >
            Zero Support is an AI-native platform that replaces your support team.
            It reads your code. Watches your users. Flags friction. Solves problems.
            Before anyone asks for help.
          </motion.p>
          <motion.a
            href="https://zerosupport.substack.com"
            className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
            variants={fadeInUp}
          >
            Join the Waitlist
          </motion.a>
        </motion.div>

        {/* Animated Background Circles */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          style={{ top: "10%", left: "-15%" }}
        />

        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-white/10 blur-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          style={{ bottom: "5%", right: "-10%" }}
        />
      </section>

      {/* Vision Section */}
      <section className="px-6 py-24 border-t border-gray-800">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            The Future of Support Is No Support
          </h2>
          <p className="text-gray-400 text-lg">
            Every ticket is a product failure. Every handoff is a design flaw.
            Zero Support isn't a better help desk. It's an end to needing one.
            AI sees the friction, solves the issue, and files the bug — without slowing down the user.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-center text-3xl font-semibold mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-10 text-center"
            variants={fadeInStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {["Understands the Code", "Monitors User Behavior", "Acts Before the Ask"].map((title, index) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="bg-white/5 p-6 rounded-lg backdrop-blur border border-white/10"
              >
                <h3 className="text-xl font-medium mb-2">{title}</h3>
                <p className="text-gray-400">
                  {title === "Understands the Code" && "Reads your frontend/backend to deeply understand product logic."}
                  {title === "Monitors User Behavior" && "Detects rage clicks, dead-ends, and UX blockers in real time."}
                  {title === "Acts Before the Ask" && "Solves issues, suggests improvements, and answers contextually in-app."}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 border-t border-gray-800 text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Zero Support. Zero Delay.
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Join the early builders shaping the future of product-native intelligence.
        </motion.p>
        <motion.a
          href="https://zerosupport.substack.com"
          className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Get Early Access
        </motion.a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center border-t border-gray-800 text-gray-500">
        © 2025 Zero Support. Built in public.
      </footer>
    </div>
  );
}
