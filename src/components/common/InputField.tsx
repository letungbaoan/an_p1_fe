import React from 'react'

interface InputFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'textarea'
  value?: string
  defaultValue?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  hint?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  rows?: number
}

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  defaultValue = '',
  placeholder = '',
  error,
  disabled = false,
  hint,
  onChange,
  rows = 4
}: InputFieldProps) {
  return (
    <div>
      <label className='mb-1 block font-medium text-gray-700'>{label}</label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          onChange={onChange}
          className={`w-full resize-none rounded-lg border p-3 focus:ring-1 focus:ring-purple-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          className={`w-full rounded-lg border p-3 focus:ring-1 focus:ring-purple-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {hint && <small className='text-gray-500'>{hint}</small>}
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  )
}
