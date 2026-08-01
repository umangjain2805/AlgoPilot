import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.js'
import { useGoogleLogin } from '../hooks/useGoogleLogin.js'
import Button from '../components/Button.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import { Input, PasswordInput } from '../components/Input.jsx'

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

const Register = () => {
  const { register: registerUser, googleLogin, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const password = watch('password')

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const onSubmit = async (data) => {
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    if (!result.error) {
      toast.success('Account created! Welcome aboard.')
      navigate('/dashboard', { replace: true })
    }
  }

  const onGoogleSuccess = async (idToken) => {
    const result = await googleLogin(idToken)
    if (!result.error) {
      toast.success('Account created with Google')
      navigate('/dashboard', { replace: true })
    }
  }

  const { signInWithGoogle, isConfigured } = useGoogleLogin(onGoogleSuccess, (err) => {
    toast.error(err.message || 'Google sign-in failed')
  })

  const [showPasswordHint, setShowPasswordHint] = useState(false)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        Start your personalized coaching journey today.
      </p>

      {isConfigured && (
        <>
          <div className="mt-6">
            <GoogleButton onClick={signInWithGoogle} isLoading={isLoading} />
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
              or sign up with email
            </span>
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
        <Input
          id="name"
          label="Name"
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
          })}
        />

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        <div onFocus={() => setShowPasswordHint(true)} onBlur={() => setShowPasswordHint(false)}>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: passwordPattern,
                message:
                  'Password must include uppercase, lowercase, number and special character',
              },
            })}
          />
          {showPasswordHint && !errors.password && (
            <p className="mt-1.5 text-xs text-ink-500 dark:text-ink-400">
              Use 8+ characters with uppercase, lowercase, a number and a symbol.
            </p>
          )}
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-300">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Register
