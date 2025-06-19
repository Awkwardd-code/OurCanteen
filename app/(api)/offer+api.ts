import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { title, image, discount,restaurant_id } = await request.json();

    // Basic validation
    if (!title || discount === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO offers (
        title, image, discount , restaurant_id
      ) VALUES (
        ${title}, ${image}, ${discount} , ${restaurant_id}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /offers error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    let response;
    if (id) {
      response = await sql`SELECT * FROM offers WHERE id = ${id}`;
      if (response.length === 0) {
        return new Response(JSON.stringify({ error: "Offer not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(response[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      response = await sql`SELECT * FROM offers ORDER BY created_at DESC`;
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("GET /offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, title, image, discount } = await request.json();

    if (!id || (!title && !image && discount === undefined)) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await sql`SELECT * FROM offers WHERE id = ${id}`;
    if (existing.length === 0) {
      return new Response(JSON.stringify({ error: "Offer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await sql`
      UPDATE offers SET
        title = COALESCE(${title}, title),
        image = COALESCE(${image}, image),
        discount = COALESCE(${discount}, discount),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    return new Response(JSON.stringify(updated[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /offers error:", error);
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

    const existing = await sql`SELECT * FROM offers WHERE id = ${id}`;
    if (existing.length === 0) {
      return new Response(JSON.stringify({ error: "Offer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await sql`DELETE FROM offers WHERE id = ${id}`;

    return new Response(JSON.stringify({ message: "Offer deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /offers error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

