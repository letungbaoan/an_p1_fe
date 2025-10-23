import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FormInputProps {
  label: string
  name: string
  type: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type, onChange }) => (
  <div>
    <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      required={label.includes('*')}
      onChange={onChange}
      className='mt-1 w-full rounded-md border border-gray-300 p-3 focus:border-purple-600 focus:ring-purple-600'
    />
  </div>
)

const ContactFormSection: React.FC = () => {
  const { t } = useTranslation('contact')

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', form)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <FormInput
          label={t('form_name')}
          name='name'
          type='text'
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormInput
          label={t('form_email')}
          name='email'
          type='email'
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <FormInput
        label={t('form_subject')}
        name='subject'
        type='text'
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />

      <div>
        <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
          {t('form_message')}
        </label>
        <textarea
          id='message'
          name='message'
          rows={6}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className='mt-1 w-full resize-none rounded-md border border-gray-300 p-3 focus:border-purple-600 focus:ring-purple-600'
        />
      </div>

      <button
        type='submit'
        className='rounded-md bg-purple-700 px-6 py-3 font-medium text-white transition hover:bg-purple-800'
      >
        {t('form_send_button')}
      </button>
    </form>
  )
}

export default ContactFormSection
