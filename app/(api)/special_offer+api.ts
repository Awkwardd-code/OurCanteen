import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, type, cuisineId, restaurantId, description, discount, image } = await request.json();

    // Basic validation
    if (!name || !cuisineId || !restaurantId || discount === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO special_offers (
        name, type, cuisine_id, restaurant_id, description, discount, image
      ) VALUES (
        ${name}, ${type}, ${cuisineId}, ${restaurantId}, ${description}, ${discount}, ${image}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /special_offers error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const results = await sql`SELECT * FROM special_offers ORDER BY id DESC;`;

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /special_offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, name, type, cuisineId, restaurantId, description, discount, image } = await request.json();

    if (!id || !name || !cuisineId || !restaurantId || discount === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      UPDATE special_offers SET
        name = ${name},
        type = ${type},
        cuisine_id = ${cuisineId},
        restaurant_id = ${restaurantId},
        description = ${description},
        discount = ${discount},
        image = ${image}
      WHERE id = ${id}
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /special_offers error:", error);
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
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await sql`DELETE FROM special_offers WHERE id = ${id};`;

    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /special_offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
