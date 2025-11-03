interface PaymentMethodsProps {
  t: (key: string, options?: Record<string, unknown>) => string
  selectedMethod: string
  onChange: (method: string) => void
}

const methods = [
  {
    id: 'direct_bank_transfer',
    labelKey: 'payment_direct_bank_transfer',
    descriptionKey: 'payment_direct_bank_transfer_desc'
  },
  {
    id: 'cash_on_delivery',
    labelKey: 'payment_cash_on_delivery',
    descriptionKey: 'payment_cash_on_delivery_desc'
  },
  {
    id: 'credit_card',
    labelKey: 'payment_credit_card',
    descriptionKey: 'payment_credit_card_desc'
  }
]

export default function PaymentMethods({ t, selectedMethod, onChange }: PaymentMethodsProps) {
  return (
    <div className='rounded-xl bg-white p-6 shadow'>
      <h2 className='mb-4 text-2xl font-bold'>{t('payment_methods')}</h2>
      <div className='space-y-4'>
        {methods.map((method) => (
          <label
            key={method.id}
            className={`block cursor-pointer rounded-lg border p-4 ${
              selectedMethod === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className='flex items-start gap-3'>
              <input
                type='radio'
                name='paymentMethod'
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onChange(method.id)}
                className='mt-1 size-4 text-blue-600 focus:ring-blue-500'
              />
              <div>
                <p className='font-medium'>{t(method.labelKey)}</p>
                <p className='text-sm text-gray-600'>{t(method.descriptionKey)}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
