'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/navigation"
import { SignupSchema } from "@/app/schemas/SignupSchema"
import { ApiResponse } from "@/app/types/ApiResponse"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toastBlack } from "@/app/hooks/toastBlack"

function Page() {
  const [username, setusername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const debouncedUsername = useDebounceCallback(setusername, 500)
  const router = useRouter()


  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',


    },
  })
  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setisCheckingUsername(true)
        setusernameMessage('')
        try {
          const res = await axios.get(`/api/check-unique-username?username=${username}`)
          setusernameMessage(res.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setusernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )

        } finally {
          setisCheckingUsername(false)
        }

      }
    }
    checkUniqueUsername()
  }, [username])

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setisSubmitting(true)
    try {
      const res = await axios.post<ApiResponse>('/api/sign-up', data)

      toastBlack("Success", res.data.message)
      router.replace(`/verify/${data.username}`)

    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMsg = axiosError.response?.data.message ?? "Something went wrong"
            toastBlack("Sign up failed", errorMsg)





    } finally {
      setisSubmitting(false)
    }

  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${usernameMessage === 'username is available'
                        ? 'text-green-500'
                        : 'text-red-500'
                        }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <p className=' text-muted text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full cursor-pointer' disabled={isSubmitting || isCheckingUsername}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default Page