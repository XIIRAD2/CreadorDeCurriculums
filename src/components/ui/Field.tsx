import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

const baseInput =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

interface LabelWrapProps {
  label?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function LabelWrap({ label, hint, required, children, className }: LabelWrapProps) {
  return (
    <label className={`block ${className ?? ''}`}>
      {label && (
        <span className="mb-1 flex items-baseline justify-between text-xs font-medium text-slate-600">
          <span>
            {label}
            {required && <span className="ml-0.5 text-rose-500">*</span>}
          </span>
          {hint && <span className="text-[11px] font-normal text-slate-400">{hint}</span>}
        </span>
      )}
      {children}
    </label>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function TextField({ label, hint, required, className, ...rest }: TextFieldProps) {
  return (
    <LabelWrap label={label} hint={hint} required={required}>
      <input className={`${baseInput} ${className ?? ''}`} required={required} {...rest} />
    </LabelWrap>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export function TextAreaField({ label, hint, className, rows = 4, ...rest }: TextAreaFieldProps) {
  return (
    <LabelWrap label={label} hint={hint}>
      <textarea className={`${baseInput} resize-y ${className ?? ''}`} rows={rows} {...rest} />
    </LabelWrap>
  )
}

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function CheckboxField({ label, className, ...rest }: CheckboxFieldProps) {
  return (
    <label className={`flex select-none items-center gap-2 text-sm text-slate-600 ${className ?? ''}`}>
      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" {...rest} />
      {label}
    </label>
  )
}
