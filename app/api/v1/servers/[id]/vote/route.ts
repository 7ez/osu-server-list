import { database } from "@/lib/db";
import { serversTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serverId = parseInt(id, 10);

  if (isNaN(serverId)) {
    return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
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

  // Increment the vote count
  const updatedServer = await database
    .update(serversTable)
    .set({
      votes: server.votes + 1,
    })
    .where(eq(serversTable.id, serverId))
    .returning()
    .get();

  return NextResponse.json(updatedServer);
}
