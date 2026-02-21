import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { UserModel } from "@/app/model/User.model";
import { dbConnect } from "@/app/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated "

            },
            { status: 401 }
        )


    }

    const userId = user._id



    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isAcceptingMessage: acceptMessages
                },
            },

            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages "

                },
                { status: 404 }
            )

        }
        return Response.json(
            {
                success: true,
                message: "messages acceptecne status updated successfully ",
                updatedUser

            },
            { status: 200 }
        )

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages "

            },
            { status: 404 }
        )

    }



};

export async function GET(_request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user: User = session?.user as User
    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated "

            },
            { status: 401 }
        )


    };

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found "

                },
                { status: 404 }
            )
        };
        return Response.json(
            {
                success: true,
                message: "user found",
                isAcceptMessages: foundUser.isAcceptingMessage

            },
            { status: 200 }
        )
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Error is getting message acceptance "

            },
            { status: 500 }
        )


    }



}