import { dbConnect } from "@/app/lib/dbConnect";
import { UserModel } from "@/app/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationemail";
// import { ApiResponse } from "@/app/types/ApiResponse";


export async function POST(req: Request) {
    await dbConnect()
    try {

        const { username, email, password } = await req.json()
        //user who verified with usernmae already
        const existingUserVerifiedwithUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedwithUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"


            }, { status: 400 })
        };



        //user  eixsting with email
        const existingUserWithemail = await UserModel.findOne({
            email,
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserWithemail) {
            //if email verify or if not
            if (existingUserWithemail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this"


                }, { status: 400 })


            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserWithemail.password = hashedPassword
                existingUserWithemail.verifyCode = verifyCode
                existingUserWithemail.username = username
                existingUserWithemail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000) //new is required because we want a Date object, not a string.
                await existingUserWithemail.save()


            }

        }
        else {
            //first ecrypt password
            const hashedPaasword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPaasword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptMessage: true,
                messages: []
            })
            await newUser.save()
        };
        ///send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message


            }, { status: 500 })

        }
        return Response.json({
            success: true,
            message: "user registered successfully,please verify your email"


        }, { status: 201 })



    } catch (error) {
        console.log("error registering user", error)
     
        return Response.json(
            { success: false, message: "Error registering user" },
            { status: 500 }
        );

    }
}