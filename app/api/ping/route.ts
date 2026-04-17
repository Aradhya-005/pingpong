import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { NextResponse } from "next/server"

// Create a Neon adapter using our database URL from .env
// This is how Prisma knows HOW to talk to Neon specifically
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })

// Create a single Prisma client instance
// We use this to read/write to our database
const prisma = new PrismaClient({ adapter })

export async function POST(request: Request) {
  // Get the URL the user wants to test from the request body
  const { url } = await request.json()

  // Start the stopwatch before fetching
  const start = Date.now()

  // Ping the external URL (simple GET request)
  const response = await fetch(url)

  // Stop the stopwatch after we get a response
  const end = Date.now()

  // get the status code
  const status = response.status

  // Calculate how long it took in milliseconds
  const latency = end - start

  // Save the result to our database using Prisma
  await prisma.apiResult.create({
    data: { url, status, latency },
  })

  // Send the result back to the browser as JSON
  return NextResponse.json({ url, status, latency })
}