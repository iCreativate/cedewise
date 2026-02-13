'use client'

import { useForm } from 'react-hook-form'
import CurrencySelector, { Currency, currencies } from './CurrencySelector'
import { useCurrency } from '@/context/CurrencyContext'

export interface TreatyFormData {
  name: string
  cedant: string
  renewal: string
  premium: number
  status: 'Active' | 'Pending' | 'Expired'
  type: 'Proportional' | 'Non-Proportional'
  currency: Currency
}

interface TreatyFormProps {
  initialData?: Partial<TreatyFormData>
  onSubmit: (data: TreatyFormData) => void
  onCancel: () => void
}

export default function TreatyForm({ initialData, onSubmit, onCancel }: TreatyFormProps) {
  const { currency: currencyCode } = useCurrency()
  const selectedCurrency = currencies.find(c => c.code === currencyCode) ?? currencies[0]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TreatyFormData>({
    defaultValues: {
      ...initialData,
      currency: selectedCurrency,
    },
  })

  const onFormSubmit = (data: TreatyFormData) => {
    onSubmit({
      ...data,
      currency: selectedCurrency,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Treaty Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Treaty name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="cedant" className="block text-sm font-medium text-gray-700">
            Cedant
          </label>
          <input
            type="text"
            id="cedant"
            {...register('cedant', { required: 'Cedant is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.cedant && (
            <p className="mt-1 text-sm text-red-600">{errors.cedant.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="renewal" className="block text-sm font-medium text-gray-700">
            Renewal Date
          </label>
          <input
            type="date"
            id="renewal"
            {...register('renewal', { required: 'Renewal date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.renewal && (
            <p className="mt-1 text-sm text-red-600">{errors.renewal.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="premium" className="block text-sm font-medium text-gray-700">
              Premium Amount
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                id="premium"
                step="0.01"
                {...register('premium', {
                  required: 'Premium amount is required',
                  min: { value: 0, message: 'Premium must be positive' },
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {errors.premium && (
              <p className="mt-1 text-sm text-red-600">{errors.premium.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <div className="mt-1">
              <CurrencySelector />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Treaty Type
            </label>
            <select
              id="type"
              {...register('type', { required: 'Treaty type is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Proportional">Proportional</option>
              <option value="Non-Proportional">Non-Proportional</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Treaty
        </button>
      </div>
    </form>
  )
} 