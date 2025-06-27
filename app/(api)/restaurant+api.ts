import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, address, district, logo, userId } = await request.json();

    if (!name || !address || !district || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await sql`
      INSERT INTO restaurants (
        name, address, district, logo, user_id
      ) VALUES (
        ${name}, ${address}, ${district}, ${logo}, ${userId}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /restaurant error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const url = new URL(request.url);

    const id = url.searchParams.get("id");
    const userId = url.searchParams.get("user_id");

    let restaurants;

    if (id) {
      // Fetch single restaurant by ID
      restaurants = await sql`
        SELECT * FROM restaurants WHERE id = ${id};
      `;
    } else if (userId) {
      // Fetch all restaurants by user ID (no limit)
      restaurants = await sql`
        SELECT * FROM restaurants WHERE user_id = ${userId} ORDER BY created_at DESC;
      `;
    } else {
      // Fetch all restaurants (no limit)
      restaurants = await sql`
        SELECT * FROM restaurants ORDER BY created_at DESC;
      `;
    }

    return new Response(JSON.stringify(restaurants), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /restaurants error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
