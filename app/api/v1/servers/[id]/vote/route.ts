import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const serverId = parseInt(id, 10);

    if (isNaN(serverId)) {
        return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
    }

    const server = await prisma.server.findUnique({
        where: { id: serverId }
    });

    if (!server) {
        return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Increment the vote count
    const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: { votes: { increment: 1 } }
    });

    return NextResponse.json(updatedServer);
}