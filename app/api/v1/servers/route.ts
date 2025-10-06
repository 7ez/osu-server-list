import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Server } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(_: NextRequest)
{
    const servers = await prisma.server.findMany();
    return NextResponse.json(servers);
}

export async function PUT(req: NextRequest)
{
    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Server = await req.json();

    if (!body.name || !body.url || !body.logoUrl) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const server = await prisma.server.create({
        data: body
    });
    return NextResponse.json(server, { status: 201 });
}