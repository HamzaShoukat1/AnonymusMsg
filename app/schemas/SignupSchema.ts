import {z} from "zod"


export const usernameValidation = z.string().min(2,"username must be atleast 2 characters").max(20," Username must be no more than 20 characters ").
regex(/^[a-zA-Z0-9]+$/,"Username must not contained special character")


export const emailValidation = z.string().email({
    message: "invalid email address"})
export const PasswordValidation = z.string().min(6, {message: "password must be at least 6 character"})

export const SignupSchem = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: PasswordValidation,

})