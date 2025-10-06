import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Server } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        return NextResponse.json({ error: "ID in body does not match URL parameter" }, { status: 400 });
    }

    const server = await prisma.server.findUnique({
        where: { id: serverId }
    });

    if (!server) {
        return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: body
    });

    return NextResponse.json(updatedServer);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const serverId = parseInt(id, 10);
    if (isNaN(serverId)) {
        return NextResponse.json({ error: "Invalid server ID" }, { status: 400 });
    }

    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const server = await prisma.server.findUnique({
        where: { id: serverId }
    });

    if (!server) {
        return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    await prisma.server.delete({
        where: { id: serverId }
    });

    return NextResponse.json({ message: "Server deleted" }, { status: 200 });
}