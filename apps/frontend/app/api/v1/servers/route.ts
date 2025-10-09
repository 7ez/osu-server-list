import { database } from "@/lib/db";
import { serverAdminKeysTable, serversTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Server } from "@/types/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const servers = await database.select().from(serversTable).all() as Server[];

  await Promise.all(servers.map(async (server) => {
    server.hasAdminKeys = (await database
      .select()
      .from(serverAdminKeysTable)
      .where(eq(serverAdminKeysTable.serverId, server.id))
    ).length > 0;
  }));

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

  const server = await database
    .insert(serversTable)
    .values(body)
    .returning()
    .get();

  return NextResponse.json(server, { status: 201 });
}
