const Spinner = ({ size = 'md', light = false, className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }

  return (
    <span
      className={`inline-block animate-spin rounded-full border-solid border-t-transparent ${
        light ? 'border-white' : 'border-primary-600'
      } ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner
