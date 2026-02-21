import { UserModel } from "@/app/model/User.model";
import { dbConnect } from "@/app/lib/dbConnect";
import { Message } from "@/app/model/User.model";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: " user not found"
                },
                { status: 404 }
            )
        };

        //is user accepting the message
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: " user is not  accepting the  messages"
                },
                { status: 403 }
            )
        };

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)

        await user.save()
        return Response.json(
            {
                success: true,
                message: "message send successfully"
            },
            { status: 201 }
        )
    } catch (error) {
        console.log("error to send meessage", error)
        return Response.json(
            {
                success: false,
                message: "Error sending message"
            },
            { status: 500 }
        )

    }

}