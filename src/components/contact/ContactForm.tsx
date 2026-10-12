"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { inquiryTypes } from "@/content/site";

type Fields = { name: string; email: string; type: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EASE = [0.23, 1, 0.32, 1] as const;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please tell me your name.";
  if (!f.email.trim()) e.email = "I need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "That email doesn't look right.";
  if (f.message.trim().length < 10) e.message = "A sentence or two helps me understand what you need.";
  return e;
}

/**
 * No backend yet: on submit it opens the visitor's email app with everything filled in.
 * To send directly later, replace `deliver` with a fetch to Formspree, Resend, or a Server Action.
 */
function deliver(to: string, f: Fields) {
  const subject = `[${f.type}] Hello from ${f.name}`;
  const body = `${f.message}\n\n${f.name}\n${f.email}`;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="flex items-center gap-1.5 overflow-hidden text-[13px] text-[#c2410c] dark:text-[#fb923c]"
        >
          <WarningCircleIcon size={14} weight="fill" aria-hidden="true" className="shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "w-full rounded-[var(--radius-control)] border bg-surface px-4 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink-3 focus:outline-none focus:ring-4 focus:ring-accent/15";

export function ContactForm({ to }: { to: string }) {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", type: inquiryTypes[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields, v: string) => {
    const next = { ...fields, [k]: v };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  const field = (k: "name" | "email" | "message") => ({
    id: `${uid}-${k}`,
    value: fields[k],
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
    onBlur: () => blur(k),
    className: `${inputCls} ${errors[k] ? "border-[#c2410c] focus:border-[#c2410c]" : "border-line-strong focus:border-accent"}`,
  });


  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex min-h-[420px] flex-col items-start justify-center"
            role="status"
          >
            {/* Flag planted: a small celebration for a rare moment */}
            <span className="relative block h-16 w-16" aria-hidden="true">
              <motion.span
                className="absolute bottom-0 left-2 h-16 w-[3px] rounded-full bg-ink"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 0.45, ease: EASE }}
              />
              <motion.span
                className="absolute top-0 left-[11px] h-8 w-11 origin-left bg-accent [clip-path:polygon(0_0,100%_45%,0_90%)]"
                initial={{ opacity: 0, scaleX: 0.3, rotate: -8 }}
                animate={{ opacity: 1, scaleX: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.3, delay: 0.35 }}
              />
              <span className="absolute right-0 bottom-0 -left-2 h-px bg-line-strong" />
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink">Your email app should be open.</h3>
            <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
              Hit send there and I&apos;ll get back to you soon, {fields.name.split(" ")[0]}. If nothing opened, use the
              copy button to email me directly.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="link-underline mt-6 text-sm font-medium text-accent"
            >
              Write another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            onSubmit={(e) => {
              e.preventDefault();
              const errs = validate(fields);
              setErrors(errs);
              setTouched({ name: true, email: true, message: true });
              if (Object.keys(errs).length) {
                document.getElementById(`${uid}-${Object.keys(errs)[0]}`)?.focus();
                return;
              }
              deliver(to, fields);
              setSent(true);
            }}
            className="grid gap-5"
          >
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink">What can I help with?</legend>
              <div className="flex flex-wrap gap-2">
                {inquiryTypes.map((t) => {
                  const checked = fields.type === t;
                  return (
                    <label
                      key={t}
                      className={`relative flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-[13.5px] transition-[color,background-color,border-color,transform] duration-200 select-none active:scale-[0.97] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                        checked
                          ? "border-accent bg-accent text-accent-ink"
                          : "border-line-strong bg-surface text-ink-2 hover:border-ink-3 hover:text-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={checked}
                        onChange={() => set("type", t)}
                        className="sr-only"
                      />
                      {t}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor={`${uid}-name`} className="text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  {...field("name")}
                  type="text"
                  autoComplete="name"
                  placeholder="Juan dela Cruz"
                  onChange={(e) => set("name", e.target.value)}
                  className={`${field("name").className} h-12`}
                />
                <ErrorText id={`${uid}-name-err`} message={errors.name} />
              </div>
              <div className="grid gap-2">
                <label htmlFor={`${uid}-email`} className="text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  {...field("email")}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  onChange={(e) => set("email", e.target.value)}
                  className={`${field("email").className} h-12`}
                />
                <ErrorText id={`${uid}-email-err`} message={errors.email} />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor={`${uid}-message`} className="text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                {...field("message")}
                rows={5}
                placeholder="Tell me about the role or project, the timeline, and anything else that helps."
                onChange={(e) => set("message", e.target.value)}
                className={`${field("message").className} resize-y py-3 leading-relaxed`}
              />
              <ErrorText id={`${uid}-message-err`} message={errors.message} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[13px] text-ink-3">Opens your email app with this message ready to send.</p>
              <button type="submit" className="btn btn-primary">
                Send message
                <ArrowRightIcon size={16} weight="bold" className="btn-arrow" aria-hidden="true" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
