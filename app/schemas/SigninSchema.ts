import {z} from "zod"

export const SigninSchema = z.object({
    identifier: z.string(), //usrname
    password: z.string(),

})