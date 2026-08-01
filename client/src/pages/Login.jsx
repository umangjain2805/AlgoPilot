import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.js'
import { useGoogleLogin } from '../hooks/useGoogleLogin.js'
import Button from '../components/Button.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import { Input, PasswordInput } from '../components/Input.jsx'

const Login = () => {
  const { login, googleLogin, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const onSubmit = async (data) => {
    const result = await login({ email: data.email, password: data.password })
    if (!result.error) {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    }
  }

  const onGoogleSuccess = async (idToken) => {
    const result = await googleLogin(idToken)
    if (!result.error) {
      toast.success('Logged in with Google')
      navigate('/dashboard', { replace: true })
    }
  }

  const { signInWithGoogle, isConfigured } = useGoogleLogin(onGoogleSuccess, (err) => {
    toast.error(err.message || 'Google sign-in failed')
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        Log in to continue your coaching journey.
      </p>

      {isConfigured && (
        <>
          <div className="mt-6">
            <GoogleButton onClick={signInWithGoogle} isLoading={isLoading} />
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
              or continue with email
            </span>
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
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

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <span className="cursor-not-allowed text-sm font-medium text-ink-400" title="Coming soon">
            Forgot password?
          </span>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-300">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default Login
