import { database } from "@/lib/db";
import { serverAdminKeysTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminKey = req.headers.get("x-admin-key");

  if (!adminKey) {
    return NextResponse.json({ error: "Admin key required" }, { status: 400 });
  }

  const { id } = await params;
  const serverId = parseInt(id, 10);

  if (isNaN(serverId)) {
    return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
  }

  const serverAdminKey = (
    await database
      .select()
      .from(serverAdminKeysTable)
      .where(
        and(
          eq(serverAdminKeysTable.serverId, serverId),
          eq(serverAdminKeysTable.adminKey, adminKey)
        )
      )
      .limit(1)
  )[0];

  if (!serverAdminKey) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 403 });
  }

  return NextResponse.json({ error: null });
}