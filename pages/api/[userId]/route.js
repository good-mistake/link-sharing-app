import { NextResponse } from "next/server";
import connectDB from "../../../utils/connectDB.js";
import User from "../../../model/User";
export async function GET(req, { params }) {
  await connectDB();

  const { userId } = params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
