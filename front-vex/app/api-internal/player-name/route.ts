import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore =
    await cookies();

  const username =
    cookieStore.get("username")
      ?.value;

  if (username) {
    return NextResponse.json({
      name: username,
    });
  }

  const guest =
    `guest${String(
      Math.floor(
        Math.random() * 999
      ) + 1
    ).padStart(3, "0")}`;

  return NextResponse.json({
    name: guest,
  });
}