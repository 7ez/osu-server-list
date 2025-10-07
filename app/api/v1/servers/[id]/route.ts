import { database } from "@/lib/db";
import { serversTable } from "@/lib/db/schema";
import { Server } from "@/types/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serverId = parseInt(id, 10);

  if (isNaN(serverId)) {
    return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
  }

  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Partial<Server> = await req.json();

  if (body.id && body.id !== serverId) {
    return NextResponse.json(
      { error: "ID in body does not match URL parameter" },
      { status: 400 }
    );
  }

  const server = (
    await database
      .select()
      .from(serversTable)
      .where(eq(serversTable.id, serverId))
      .limit(1)
  )[0];

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  const updatedServer = await database
    .update(serversTable)
    .set(body)
    .where(eq(serversTable.id, serverId))
    .returning()
    .get();

  return NextResponse.json(updatedServer);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serverId = parseInt(id, 10);
  if (isNaN(serverId)) {
    return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
  }

  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const server = (
    await database
      .select()
      .from(serversTable)
      .where(eq(serversTable.id, serverId))
      .limit(1)
  )[0];

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  await database
    .delete(serversTable)
    .where(eq(serversTable.id, serverId));

  return NextResponse.json({ message: "Server deleted" }, { status: 200 });
}
