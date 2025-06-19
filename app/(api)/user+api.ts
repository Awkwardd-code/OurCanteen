import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id,
        phone
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId},
        0
      ) RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const url = new URL(request.url);
    const clerkId = url.searchParams.get("clerkId");

    if (!clerkId) {
      return Response.json(
        { error: "Missing required field: clerkId" },
        { status: 400 }
      );
    }

    const response = await sql`
      SELECT *
      FROM users
      WHERE clerk_id = ${clerkId};
    `;

    if (response.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
