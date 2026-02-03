import { Message } from "../model/User.model"
export interface ApiResponse {
    success: boolean,
    message:string, //"Verification email sent successfully"
    isAcceptingMessages?: boolean
    messages?: Array<Message>
    status?:number
}