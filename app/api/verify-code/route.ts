import { dbConnect } from "@/app/lib/dbConnect";
import { UserModel } from "@/app/model/User.model";
import * as z from "zod"
import { usernameValidation } from "@/app/schemas/SignupSchema";

const verifyCodeSchema = z.object({
    code: z.string().min(6),
    username: usernameValidation

})

export async function POST(request: Request) {
    await dbConnect()
    try {
        const body = await request.json()
        const result = verifyCodeSchema.safeParse(body)
        if (!result.success) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid input",
                    errors: result.error.format()
                },
                { status: 400 }
            )
        }

        const { username, code } = result.data

        const decodeUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decodeUsername
        })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    messgae: "user not found",
                },
                {
                    status: 400
                }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    messgae: " Account verified successfully",
                },
                {
                    status: 200
                }
            )

        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    messgae: "verification code has expired plz signup again to get new code",
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    messgae: "Incorrect verification code",
                },
                {
                    status: 400
                }
            )
        }



    } catch (error) {
        console.error(" error verify user", error)
        return Response.json(
            {
                success: false,
                messgae: " error verify user",
            },
            {
                status: 500
            }
        )


    }
}
