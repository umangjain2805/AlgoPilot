import Spinner from './Spinner.jsx'

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  google: 'btn-google',
}

const sizeClasses = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {isLoading && <Spinner size="sm" light={variant !== 'secondary' && variant !== 'ghost' && variant !== 'google'} />}
    {children}
  </button>
)

export default Button
