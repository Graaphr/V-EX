import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

/* ====================== */
/* GET */
/* ====================== */

export async function GET() {
  const keys =
    await redis.keys(
      "player:*"
    );

  const players = [];

  for (const key of keys) {
    const data =
      await redis.get(key);

    if (data) {
      players.push(
        JSON.parse(data)
      );
    }
  }

  return NextResponse.json(
    players
  );
}

/* ====================== */
/* POST */
/* ====================== */

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const playerData = {
      id: body.id,
      name: body.name,

      x: body.x ?? 0,
      y: body.y ?? 0,
      z: body.z ?? 0,

      rotation:
        body.rotation ?? 0,

      updatedAt:
        Date.now(),
    };

    await redis.set(
      `player:${body.id}`,
      JSON.stringify(playerData),
      "EX",
      5
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

/* ====================== */
/* DELETE */
/* ====================== */

export async function DELETE(
  req: Request
) {
  try {
    const {
      searchParams,
    } = new URL(req.url);

    const id =
      searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    await redis.del(
      `player:${id}`
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}