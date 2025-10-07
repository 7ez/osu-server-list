import { database } from "@/lib/db";
import { ipVotesTable, serversTable, votesTable } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function getClientIp(req: NextRequest): string {
  let ip = "unknown";
  let x_forwarded_for = req.headers.get('x-forwarded-for');
  let x_real_ip = req.headers.get('x-real-ip');

  if (x_forwarded_for) {
    ip = x_forwarded_for.split(',')[0];
  } else if (x_real_ip) {
    ip = x_real_ip;
  } 
  
  return ip;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await req.json();
  const serverId = parseInt(id, 10);
  const serverUserId = parseInt(userId, 10);

  if (isNaN(serverId)) {
    return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
  }

  if (isNaN(serverUserId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
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

  const ipAddress = getClientIp(req);
  if (ipAddress === "unknown") {
    return NextResponse.json({ error: "Unable to determine client IP" }, { status: 400 });
  }

  // check if the user id has voted for this server in the last 24 hours
  // or if the ip address has voted for any server in the last 24 hours
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentIpVote = (await database
    .select()
    .from(ipVotesTable)
    .where(and(
      eq(ipVotesTable.ipAddress, ipAddress),
      gte(ipVotesTable.lastVoted, twentyFourHoursAgo)
    ))
    .limit(1))[0];
  console.log(recentIpVote);

  if (recentIpVote) {
    return NextResponse.json({ error: "You can only vote once every 24 hours" }, { status: 429 });
  }

  const recentUserVote = (await database
    .select()
    .from(votesTable)
    .where(and(
      eq(votesTable.serverId, serverId),
      eq(votesTable.userId, serverUserId),
      gte(votesTable.lastVoted, twentyFourHoursAgo)
    ))
    .limit(1))[0];
  console.log(recentUserVote);
  if (recentUserVote) {
    return NextResponse.json({ error: "You can only vote once every 24 hours" }, { status: 429 });
  }

  await database.insert(ipVotesTable).values({
    ipAddress: ipAddress,
    lastVoted: Date.now(),
  }).onConflictDoUpdate({
    target: ipVotesTable.ipAddress,
    set: {
      lastVoted: Date.now(),
    },
  }).run();

  await database.insert(votesTable).values({
    serverId: serverId,
    userId: serverUserId,
    lastVoted: Date.now(),
  }).onConflictDoUpdate({
    target: [votesTable.serverId, votesTable.userId],
    set: {
      lastVoted: Date.now(),
    },
  }).run();

  const updatedServer = await database
    .update(serversTable)
    .set({
      votes: server.votes + 1,
    })
    .where(eq(serversTable.id, serverId))
    .returning()
    .get();


  // TODO: configurable vote url for the server that we can POST to
  return NextResponse.json(updatedServer);
}
