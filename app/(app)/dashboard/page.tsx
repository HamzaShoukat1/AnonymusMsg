"use client"

import { toastBlack } from "@/app/hooks/toastBlack"
import { Message } from "@/app/model/User.model"
import { acceptMessagedSchema } from "@/app/schemas/acceptMessageSchema"
import { ApiResponse } from "@/app/types/ApiResponse"
import MessageCard from "@/components/Shared/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
export default function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setisLoading] = useState(false)
  const [isSwitchLoading, setisSwitchLoading] = useState(false)

  const handleDeleteMessage = (meesgaeId: string) => {
    setMessages(prev =>
      prev.filter(msg => msg._id.toString() !== meesgaeId)
    )
  };

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessagedSchema)
  })
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessaged')
  //fetch accept message
  const fetchedAcceptMessage = useCallback(async () => {
    setisSwitchLoading(true)
    try {
      const res = await axios.get<ApiResponse>('/api/accept-messages')
      setValue("acceptMessaged", res.data.isAcceptMessages)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "failed to fetch message settings"

      })



    } finally {
      setisSwitchLoading(false)
    }
  }, [setValue]);

  //fetch all msg
  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setisLoading(true)
    setisSwitchLoading(false)
    try {
      const res = await axios.get<ApiResponse>('/api/get-messages')
      console.log(res)
      setMessages(res.data.messages || [])
      if (refresh) {

        toastBlack("refresh messages", "showing latest messages")
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toastBlack("Error", axiosError.response?.data.message || "failed to fetch messages")



    } finally {
      setisLoading(false)
      setisSwitchLoading(false)

    }

  }, []);

  useEffect(() => {
    if (!session || !session.user) return
    fetchAllMessages()
    fetchedAcceptMessage()

  }, [session, fetchAllMessages, fetchedAcceptMessage])

  //handle siwthc chnge

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessaged", !acceptMessages)
      toastBlack("success", res.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toastBlack("Error", axiosError.response?.data.message || "ailed to change handle switch")

    }
  }
  if (!session || !session.user) {
    return <div className="min-h-screen w-full font-bold flex justify-center items-center ">
      <Link href={'/sign-in'}>
        <Button className="cursor-pointer">

          Please login
        </Button>
      </Link>
    </div>
  }

  const { username } = session?.user as User
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${username}`


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("Url copied Successfully")
  }

















  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button className="cursor-pointer" onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessaged")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

}
