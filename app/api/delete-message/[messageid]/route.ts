import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { UserModel } from "@/app/model/User.model";
import { dbConnect } from "@/app/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const {messageid:msgId} = await params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const user: User = session.user as User;

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: msgId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete message route", error);
    return Response.json(
      { success: false, message: "Failed to delete message" },
      { status: 500 }
    );
  }
}
