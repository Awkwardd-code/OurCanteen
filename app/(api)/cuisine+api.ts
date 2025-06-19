import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { restaurantId, name, image } = await request.json();

    // Basic validation
    if (!restaurantId || !name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO cuisines (
        restaurant_id, name, image
      ) VALUES (
        ${restaurantId}, ${name}, ${image}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /cuisines error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    const response = restaurantId
      ? await sql`SELECT * FROM cuisines WHERE restaurant_id = ${restaurantId}`
      : await sql`SELECT * FROM cuisines`;

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /cuisines error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, name, image } = await request.json();

    if (!id || (!name)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existing = await sql`SELECT * FROM cuisines WHERE id = ${id}`;
    if (existing.length === 0) {
      return new Response(JSON.stringify({ error: "Cuisine not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await sql`
      UPDATE cuisines
      SET
        name = COALESCE(${name}, name),
        image = COALESCE(${image}, image)
      WHERE id = ${id}
      RETURNING *;
    `;

    return new Response(JSON.stringify(updated[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATCH /cuisines error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function DELETE(request: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing cuisine ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [existing] = await sql`SELECT * FROM cuisines WHERE id = ${id}`;

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Cuisine not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await sql`DELETE FROM cuisines WHERE id = ${id}`;

    return new Response(JSON.stringify(existing), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /cuisines error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


