"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { SUPPORT_EMAIL } from "@/components/layout/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!message.trim()) newErrors.message = "Please enter your message";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 text-left">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Contact & Support
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Have feedback on our calculations or suggestions for new features? We would love to hear from you.
        </p>
      </div>

      {/* Support Info Card */}
      <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-4">
        <div className="p-3 bg-blue-600 text-white rounded-xl">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Direct Support Email
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            For support inquiries and mobile app questions, contact:
          </p>
          <div className="mt-1 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
            {SUPPORT_EMAIL}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Message Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Thank you for reaching out, {name}. Our team will review your message and reply to {email} as soon as possible.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
              className="mt-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="John Doe"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400/20"
                    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-600"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="john@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400/20"
                    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-600"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                }}
                rows={5}
                placeholder="How can we help you with Paint Calculator & Estimator?"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.message
                    ? "border-red-500 focus:ring-red-400/20"
                    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-600"
                }`}
              />
              {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
