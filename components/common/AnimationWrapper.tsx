"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimationWrapperProps {
  variant?: "fade-up" | "float" | "wavy" | "pop";
  delay?: number; // seconds
  className?: string;
  children: React.ReactNode;
  triggerOnScroll?: boolean; // if true, animate when element enters viewport
  once?: boolean; // if true, animate only once
}

export default function AnimationWrapper({
  variant = "fade-up",
  delay = 0,
  className = "",
  children,
  triggerOnScroll = true,
  once = true,
}: AnimationWrapperProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!triggerOnScroll) {
      // immediate
      setVisible(true);
      return;
    }

    // Check if already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setVisible(true);
      if (once) return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once && el) obs.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerOnScroll, once]);

  const style: React.CSSProperties = {
    ["--animation-delay" as any]: `${delay}s`,
  };

  const baseClass = variant === "float" ? "animation-float" : variant === "pop" ? "animation-pop" : variant === "wavy" ? "animation-wavy" : "animation-fade-up";
  const visibleClass = visible ? "animation-visible" : "";

  // If wavy and children is string, split into spans but still attach ref
  if (variant === "wavy") {
    if (typeof children === "string") {
      return (
        <span ref={ref as any} className={`${baseClass} ${visibleClass} ${className}`} style={style}>
          {children.split("").map((ch, i) => (
            <span key={i} style={{ ["--i" as any]: i }} aria-hidden={ch === " "}>
              {ch}
            </span>
          ))}
        </span>
      );
    }
    return (
      <span ref={ref as any} className={`${baseClass} ${visibleClass} ${className}`} style={style}>
        {children}
      </span>
    );
  }

  return (
    <div ref={ref as any} className={`${baseClass} ${visibleClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
