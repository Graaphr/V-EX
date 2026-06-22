"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

// =============================
// GLOBAL TOAST TRIGGER
// =============================
type ToastListener = (message: string, type: ToastType) => void;
let listener: ToastListener | null = null;

export const toast = {
  success: (message: string) =>
    listener?.("message", "success") ?? listener?.(message, "success"),
  error: (message: string) => listener?.(message, "error"),
  info: (message: string) => listener?.(message, "info"),
  warning: (message: string) => listener?.(message, "warning"),
};

// Fix toast.success
export const showToast = (message: string, type: ToastType = "success") => {
  listener?.(message, type);
};

// =============================
// CONFIG
// =============================
const CONFIG: Record<
  ToastType,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  }
> = {
  success: {
    icon: <FaCheckCircle />,
    bg: "bg-white dark:bg-neutral-900",
    border: "border-l-4 border-l-green-500",
    text: "text-gray-800 dark:text-gray-100",
    iconColor: "text-green-500",
  },
  error: {
    icon: <FaTimesCircle />,
    bg: "bg-white dark:bg-neutral-900",
    border: "border-l-4 border-l-red-500",
    text: "text-gray-800 dark:text-gray-100",
    iconColor: "text-red-500",
  },
  info: {
    icon: <FaInfoCircle />,
    bg: "bg-white dark:bg-neutral-900",
    border: "border-l-4 border-l-blue-500",
    text: "text-gray-800 dark:text-gray-100",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: <FaExclamationTriangle />,
    bg: "bg-white dark:bg-neutral-900",
    border: "border-l-4 border-l-yellow-500",
    text: "text-gray-800 dark:text-gray-100",
    iconColor: "text-yellow-500",
  },
};

// =============================
// SINGLE TOAST
// =============================
function ToastItem({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const config = CONFIG[item.type];

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, 3500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [item.id, onRemove]);

  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm px-4 py-3 rounded-lg shadow-lg
        border border-gray-100 dark:border-neutral-700
        ${config.bg} ${config.border} ${config.text}
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* ICON */}
      <span className={`mt-0.5 text-base shrink-0 ${config.iconColor}`}>
        {config.icon}
      </span>

      {/* MESSAGE */}
      <p className="text-sm flex-1 leading-snug">{item.message}</p>

      {/* CLOSE */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(item.id), 300);
        }}
        className="mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
}

// =============================
// TOAST CONTAINER
// =============================
export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listener = (message: string, type: ToastType) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
    };
    return () => {
      listener = null;
    };
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} onRemove={remove} />
      ))}
    </div>
  );
}
