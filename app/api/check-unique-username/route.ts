import { dbConnect } from "@/app/lib/dbConnect";
import { UserModel } from "@/app/model/User.model";
import z from "zod"
import { usernameValidation } from "@/app/schemas/SignupSchema";

const UserNameQuerySchema = z.object({
    username: usernameValidation
})
export async function GET(request: Request) {

    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        //validate with zod
        const result = UserNameQuerySchema.safeParse(queryParams)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'invalid query parameter'
            },
                { status: 400 },

            )
        }
        const { username } = result.data
        const existingVerfiedUserwithsameusername = await UserModel.findOne({ username, isVerified: true })
        if (existingVerfiedUserwithsameusername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            },
                { status: 400 },

            )
        }
        return Response.json({
            success: true,
            message: 'username is available'
        },
            { status: 200 },

        )








    } catch (error) {
        console.error("error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )

    }



}