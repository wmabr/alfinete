'use client'

import { authClient } from '@/lib/auth-client'
import { LoginFormSchema, loginFormSchema } from '@/schemas/login-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoaderCircleIcon } from 'lucide-react'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit({ email }: LoginFormSchema) {
    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: '/dashboard',
    })

    if (error) {
      // TODO: replace it with a good looking toast
      alert('Não foi possível fazer login')
    } else {
      reset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start gap-5 p-6 w-11/12 max-w-lg border border-zinc-200 rounded-lg"
    >
      <div className="space-y-2">
        <h1 className="font-bold text-2xl">Entrar</h1>
        <p className="text-zinc-500">Entre com a sua conta WMA</p>
      </div>

      <label className="w-full">
        E-mail
        <input
          autoFocus
          type="email"
          autoComplete="off"
          className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
          {...register('email')}
        />
      </label>
      {errors.email && (
        <p className="text-xs text-red-500">{errors.email.message}</p>
      )}

      <button
        type="submit"
        className="flex items-center justify-center w-full h-12 text-white bg-purple-500 rounded-lg cursor-pointer"
      >
        {isSubmitting ? (
          <LoaderCircleIcon className="size-5 animate-spin" />
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  )
}
