"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ExternalLink } from "lucide-react";
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from "@/lib/animations";
import { DecorativeHeader } from "@/components/ui/SectionDecor";
import { useState } from "react";

const inputClassName =
  "w-full bg-white border border-zinc-200/60 rounded-xl text-slate-800 placeholder-zinc-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300/30 transition-colors py-3 px-4 text-sm outline-none font-sans";

const labelClassName =
  "text-slate-800 font-sans font-semibold text-xs tracking-wider uppercase mb-2 block";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", school: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#fafaf7] py-28 lg:py-40 border-t border-zinc-200/60"
    >
      <div
        className="absolute inset-0 bg-[url('/images/malaysia-landmark.jpg')] bg-cover bg-center opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <DecorativeHeader>
            <motion.p
              variants={fadeInUp}
              className="text-amber-700 font-sans tracking-widest text-xs uppercase font-bold mb-3 block"
            >
              Get In Touch
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-slate-900 font-serif font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight"
            >
              Join The Journey
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-16 h-0.5 mx-auto mb-6 rounded-full bg-zinc-200"
            />
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 font-sans text-sm leading-relaxed max-w-2xl mx-auto"
            >
              Ready to register your school or learn more about MyLENS 2026? We&apos;d love to hear
              from you.
            </motion.p>
          </DecorativeHeader>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ── Contact info cards ── */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-4"
          >
            {[
              {
                icon: Mail,
                label: "Email Us",
                value: "myceoedu@gmail.com",
                sub: "We reply within 24 hours",
                href: "mailto:myceoedu@gmail.com",
              },
              {
                icon: Phone,
                label: "Call Us",
                value: "+603 1234 5678",
                sub: "Mon–Fri, 9am–6pm",
                href: "tel:+60312345678",
              },
              {
                icon: MapPin,
                label: "Office",
                value: "Shah Alam, Selangor, Malaysia",
                sub: "MyCEO EDUCATION SDN. BHD.",
                href: "#",
              },
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="flex items-start gap-5 bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-50 border border-zinc-200 group-hover:border-zinc-300 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-slate-800 font-sans font-semibold text-xs tracking-wider uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="text-slate-800 font-sans font-semibold text-lg mb-0.5">
                    {item.value}
                  </p>
                  <p className="text-gray-600 font-sans text-xs">{item.sub}</p>
                </div>
              </motion.a>
            ))}

            <div className="pt-2">
              <p className="text-zinc-400 font-sans font-bold tracking-wider text-[11px] uppercase mb-4">
                Follow MyLENS 2026
              </p>
              <div className="flex flex-wrap gap-3">
                {["Instagram", "TikTok", "YouTube", "Facebook"].map((s) => (
                  <motion.a
                    key={s}
                    href="#"
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-white border border-zinc-200/60 shadow-sm hover:border-zinc-300 transition-all duration-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    {s}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Registration form ── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-10 shadow-md relative overflow-hidden">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-900 shadow-sm">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-slate-800 font-sans font-semibold text-2xl mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-slate-800 font-sans font-semibold text-2xl tracking-tight mb-2">
                      Register Your School
                    </h3>
                    <p className="text-gray-600 font-sans text-sm leading-relaxed">
                      Fill in the form and we&apos;ll be in touch within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                      { id: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                      { id: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                      { id: "school", label: "School Name", type: "text", placeholder: "e.g. SMK Seri Kembangan" },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className={labelClassName}>
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={form[field.id as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                          required
                          className={inputClassName}
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="message" className={labelClassName}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Tell us about your school and why you want to join MyLENS 2026..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        className={`${inputClassName} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors w-full flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
