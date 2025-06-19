import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, type, cuisineId, restaurantId, description, image } = await request.json();

    // Basic validation
    if (!name || !cuisineId || !restaurantId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO combo_offers (
        name, type, cuisine_id, restaurant_id, description, image
      ) VALUES (
        ${name}, ${type}, ${cuisineId}, ${restaurantId}, ${description}, ${image}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /combo_offers error:", error);
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
    const id = searchParams.get("id");

    const result = id
      ? await sql`SELECT * FROM combo_offers WHERE id = ${id}`
      : await sql`SELECT * FROM combo_offers ORDER BY id DESC`;

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /combo_offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, name, type, cuisineId, restaurantId, description, image } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing offer ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [existing] = await sql`SELECT * FROM combo_offers WHERE id = ${id}`;
    if (!existing) {
      return new Response(JSON.stringify({ error: "Offer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await sql`
      UPDATE combo_offers SET
        name = ${name ?? existing.name},
        type = ${type ?? existing.type},
        cuisine_id = ${cuisineId ?? existing.cuisine_id},
        restaurant_id = ${restaurantId ?? existing.restaurant_id},
        description = ${description ?? existing.description},
        image = ${image ?? existing.image}
      WHERE id = ${id}
      RETURNING *;
    `;

    return new Response(JSON.stringify(updated[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /combo_offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function DELETE(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing offer ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [existing] = await sql`SELECT * FROM combo_offers WHERE id = ${id}`;
    if (!existing) {
      return new Response(JSON.stringify({ error: "Offer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await sql`DELETE FROM combo_offers WHERE id = ${id}`;
    return new Response(JSON.stringify(existing), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("DELETE /combo_offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

