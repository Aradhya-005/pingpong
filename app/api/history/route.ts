import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { NextResponse } from "next/server";

// Prisma client setup with Neon adapter
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  // Extract the URL query param from the request
  // e.g. /api/ping?url=https://api.github.com
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // If no URL was provided, return an empty array
  if (!url) return NextResponse.json([]);

  // Fetch all ping results for this URL from the database
  const results = await prisma.apiResult.findMany({
    where: { url },
    // Return newest pings first
    orderBy: { timestamp: "desc" },
    // Only return last 10 results for the chart
    take: 10,
  });

  return NextResponse.json(results);
}