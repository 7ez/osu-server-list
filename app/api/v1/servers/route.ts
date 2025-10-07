import { database } from "@/lib/db";
import { serversTable } from "@/lib/db/schema";
import { Server } from "@/types/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const servers = await database.select().from(serversTable).all();
  return NextResponse.json(servers);
}

export async function PUT(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Server = await req.json();

  if (!body.name || !body.url || !body.logoUrl) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  console.log(body)

  const server = await database
    .insert(serversTable)
    .values(body)
    .returning()
    .get();
  return NextResponse.json(server, { status: 201 });
}
