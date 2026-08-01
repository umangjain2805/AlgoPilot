const Avatar = ({ name = '', src = '', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-2xl',
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ring-2 ring-primary-400/50 ${sizes[size]} ${className}`}
      />
    )
  }

  return (
    <span
      className={`grid place-items-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 font-semibold text-white ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  )
}

export default Avatar
