
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const { name, address, district, logo, userId } = await request.json();

    // Basic validation
    if (!name || !address || !district || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Insert into the database
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
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/* export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing user_id in query params" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    const restaurants = await sql`
      SELECT * FROM restaurants
      WHERE user_id = ${userId};
    `;

    return new Response(JSON.stringify(restaurants), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /restaurants error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET_ALL(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const restaurants = await sql`
      SELECT * FROM restaurants
      ORDER BY created_at DESC;
    `;

    return new Response(JSON.stringify(restaurants), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET_ALL /restaurants error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
 */
export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const url = new URL(request.url);

    const userId = url.searchParams.get("user_id");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    let restaurants;

    if (userId) {
      restaurants = await sql`
        SELECT * FROM restaurants
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else {
      restaurants = await sql`
        SELECT * FROM restaurants
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const {
      id,
      name,
      logo,
      address,
      district,
      user_id,
    } = await request.json();

    if (!id || !name || !address || !district || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      UPDATE restaurants
      SET
        name = ${name},
        logo = ${logo},
        address = ${address},
        district = ${district},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(
        JSON.stringify({ error: "Restaurant not found or not owned by user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(response[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /restaurants error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
