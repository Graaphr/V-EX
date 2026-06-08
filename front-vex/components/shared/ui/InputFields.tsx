'use client';

import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordFieldProps {
  value: string;
  placeholder?: string;
  error?: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle?: () => void;
  className: string;
}

interface InputFieldProps {
  type?: string;
  name?: string;
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function InputField({
  type = 'text',
  name,
  value,
  placeholder,
  error,
  disabled = false,
  onChange,
  className,
}: InputFieldProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        className={`${className} ${error ? 'focus:outline-none border-red-500 ring-2 ring-red-200 focus:ring-red-300' : ''}`}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function PasswordField({
  value,
  placeholder,
  error,
  showPassword,
  onChange,
  onToggle,
  className,
}: PasswordFieldProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`${className} ${error ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-300' : ''}`}
        />

        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2">
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
