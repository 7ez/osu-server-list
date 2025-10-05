import { Server } from "@/types/server";
import { NextRequest, NextResponse } from "next/server";

// TODO: database.
const servers: Server[] = [
    {
        id: 1,
        name: "RealistikOsu",
        description: "please play on my server",
        logoUrl: "https://ussr.pl/favicon.ico",
        url: "ussr.pl",
        features: ["Patcher", "Beatmap Submission"],
        onlineCount: 6,
        votes: 42,
    },
    {
        id: 2,
        name: "Akatsuki",
        description: "everyone knows akatsuki atp",
        logoUrl: "https://akatsuki.gg/static/images/logos/logo.png",
        url: "akatsuki.gg",
        features: ["Patcher"],
        onlineCount: 7,
        votes: 41,
    },
    {
        id: 3,
        name: "Akatsuki 2",
        description: "everyone knows akatsuki atp",
        logoUrl: "https://akatsuki.gg/static/images/logos/logo.png",
        url: "akatsuki.gg",
        features: ["Feature"],
        onlineCount: 7,
        votes: 40,
    },
    {
        id: 4,
        name: "Titanic",
        description: "the server is sinking",
        logoUrl: "https://osu.titanic.sh/images/logo/main-vector.min.svg?commit=0aa8b1557d8a62ed6d9c85b31cced0c7bb3eab22",
        url: "titanic.sh",
        features: ["old clients", "boat sink"],
        onlineCount: 7,
        votes: 39,
    },
];

// test delay with this
async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest)
{
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

    servers.push(body);
    return NextResponse.json(body, { status: 201 });
}

export async function PATCH(req: NextRequest)
{
    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Server = await req.json();

    if (!body.name || !body.url || !body.logoUrl) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const index = servers.findIndex(s => s.id === body.id);
    if (index === -1) {
        return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    servers[index] = body;
    return NextResponse.json(body);
}

export async function DELETE(req: NextRequest)
{
    await sleep(5000);

    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: { id: number } = await req.json();
    const index = servers.findIndex(s => s.id === body.id);
    if (index === -1) {
        return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    servers.splice(index, 1);
    return NextResponse.json({ success: true });
}