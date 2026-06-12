// components/shared/ui/InputFields.tsx
'use client';

import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const baseClass =
  'w-full p-2.5 px-3 rounded-lg border border-gray-300 mt-1.5 focus:outline-none focus:border-main-blue focus:ring-1 focus:ring-main-blue transition-all text-sm';

const errorClass =
  'border-red-500 ring-1 ring-red-400 focus:ring-red-400 focus:border-red-500';

// ─── Label ───────────────────────────────────────────────
export function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="text-sm font-semibold">
      {text} {required && <span className="text-red-500">*</span>}
    </p>
  );
}

// ─── ErrorMessage ────────────────────────────────────────
function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500">{error}</p>;
}

// ─── InputField ───────────────────────────────────────────
interface InputFieldProps {
  type?: string;
  name?: string;
  value: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function InputField({
  type = 'text',
  name,
  value,
  placeholder,
  label,
  required,
  error,
  disabled = false,
  readOnly = false,
  onChange,
  className,
}: InputFieldProps) {
  return (
    <div className="w-full">
      {label && <Label text={label} required={required} />}
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
        className={`
          ${baseClass}
          ${error ? errorClass : ''}
          ${disabled || readOnly ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}
          ${className ?? ''}
        `}
      />
      <ErrorMessage error={error} />
    </div>
  );
}

// ─── SelectField ──────────────────────────────────────────
interface SelectFieldProps {
  name?: string;
  value: string;
  label?: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export function SelectField({
  name,
  value,
  label,
  required,
  error,
  options,
  placeholder,
  onChange,
  className,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      {label && <Label text={label} required={required} />}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
          ${baseClass}
          ${error ? errorClass : ''}
          ${className ?? ''}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorMessage error={error} />
    </div>
  );
}

// ─── TextareaField ────────────────────────────────────────
interface TextareaFieldProps {
  name?: string;
  value: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function TextareaField({
  name,
  value,
  placeholder,
  label,
  required,
  error,
  rows = 5,
  onChange,
  className,
}: TextareaFieldProps) {
  return (
    <div className="w-full">
      {label && <Label text={label} required={required} />}
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
        className={`
          ${baseClass}
          resize-none
          ${error ? errorClass : ''}
          ${className ?? ''}
        `}
      />
      <ErrorMessage error={error} />
    </div>
  );
}

// ─── PasswordField ────────────────────────────────────────
interface PasswordFieldProps {
  value: string;
  name?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle?: () => void;
  className?: string;
}

export function PasswordField({
  value,
  name,
  placeholder,
  label,
  required,
  error,
  showPassword,
  onChange,
  onToggle,
  className,
}: PasswordFieldProps) {
  return (
    <div className="w-full">
      {label && <Label text={label} required={required} />}
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`
            ${baseClass}
            pr-10
            ${error ? errorClass : ''}
            ${className ?? ''}
          `}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
        >
          {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
        </button>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}