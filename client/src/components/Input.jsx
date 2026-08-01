import { forwardRef, useState } from 'react'

// Text input wired for react-hook-form.
const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className={className}>
    {label && (
      <label className="form-label" htmlFor={props.id}>
        {label}
      </label>
    )}
    <input ref={ref} className={`input-field ${error ? '!border-red-400 !ring-2 !ring-red-400/30' : ''}`} {...props} />
    {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
  </div>
))

Input.displayName = 'Input'

// Password input with show/hide toggle.
const PasswordInput = forwardRef(({ label, error, id, className = '', ...props }, ref) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? 'text' : 'password'}
          className={`input-field pr-12 ${error ? '!border-red-400 !ring-2 !ring-red-400/30' : ''}`}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export { Input, PasswordInput }
