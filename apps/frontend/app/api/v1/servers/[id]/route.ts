import { database } from "@/lib/db";
import { serverAdminKeysTable, serversTable } from "@/lib/db/schema";
import { Server } from "@/types/server";
import { ServerAdminKey } from "@/types/server-admin-key";
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

  const serverAdminKey: ServerAdminKey | undefined = (
    await database
      .select()
      .from(serverAdminKeysTable)
      .where(eq(serverAdminKeysTable.serverId, serverId))
      .limit(1)
  )[0];

  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY && (!serverAdminKey || adminKey !== serverAdminKey.adminKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const updatedServer = await database
    .update(serversTable)
    .set(body)
    .where(eq(serversTable.id, serverId))
    .returning()
    .get() as Server;

  updatedServer.hasAdminKeys = (await database
    .select()
    .from(serverAdminKeysTable)
    .where(eq(serverAdminKeysTable.serverId, server.id))
    .limit(1)
  ).length > 0;

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
