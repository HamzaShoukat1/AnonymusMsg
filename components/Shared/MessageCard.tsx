"use client"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "../ui/button"
import { X } from "lucide-react"
import { Message } from "@/app/model/User.model"
import axios from "axios"
import { ApiResponse } from "@/app/types/ApiResponse"
import { toastBlack } from "@/app/hooks/toastBlack"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageid: string) => void
}

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {

  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id.toString()}`
      )

      toastBlack("Success", res.data.message)
      onMessageDelete(message._id.toString())

    } catch (error) {
      toastBlack("Error", "Failed to delete message")
    }
  }

  return (
    <Card className="relative p-4">

      {/* Delete Button */}
      <div className="absolute top-3 right-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="cursor-pointer"  size="icon" variant="destructive">
              <X className="w-4 h-4 " />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction className="cursor-pointer" onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Date */}
      <CardHeader className="p-0 pb-2">
        <p className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <p className="text-base">{message.content}</p>
      </CardContent>

    </Card>
  )
}
