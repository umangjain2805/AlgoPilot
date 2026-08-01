import { useForm } from 'react-hook-form'
import Button from '../Button.jsx'
import { Input } from '../Input.jsx'

const LeetCodeConnectForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '' } })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="leetcode-username"
        label="LeetCode Username"
        placeholder="e.g. leetcode_username"
        autoComplete="username"
        error={errors.username?.message}
        {...register('username', {
          required: 'LeetCode username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' },
          maxLength: { value: 30, message: 'Username cannot exceed 30 characters' },
          pattern: {
            value: /^[a-zA-Z0-9_-]+$/,
            message: 'Only letters, numbers, underscores and hyphens are allowed',
          },
        })}
      />

      <Button type="submit" className="w-full" size="lg" isLoading={loading}>
        Connect LeetCode Profile
      </Button>
    </form>
  )
}

export default LeetCodeConnectForm
