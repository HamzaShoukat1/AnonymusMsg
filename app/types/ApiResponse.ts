import { Message } from "../model/User.model"
export interface ApiResponse {
    success: boolean,
    message:string, //"Verification email sent successfully"
    isAcceptMessages: boolean
    messages?: Array<Message>
    status?:number
}