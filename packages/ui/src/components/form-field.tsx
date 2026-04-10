import * as React from 'react'
import { Label } from './label'
import { Input } from './input'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  minLength?: number
}

export function FormField({ id, label, type = 'text', value, onChange, required, minLength }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} required={required} minLength={minLength} />
    </div>
  )
}
