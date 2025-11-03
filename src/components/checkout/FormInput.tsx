import React from 'react'

interface FormInputProps {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type, value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
      {label}
      {required && <span className='text-red-500'> *</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='mt-1 w-full rounded-md border border-gray-300 p-3 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
    />
  </div>
)

export default FormInput
