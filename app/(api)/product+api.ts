import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const {
      name,
      offerId,
      image,
      restaurantId,
      cuisineId,
      specialities,
      description,
      price,
      isPopular,
      isBengali,
      isSpecial,
    } = await request.json();

    // Basic validation
    if (!name || !restaurantId || !cuisineId || price === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO products (
        name, offer_id, image, restaurant_id, cuisine_id, specialities, description, price, is_popular, is_bengali, is_special
      ) VALUES (
        ${name}, ${offerId}, ${image}, ${restaurantId}, ${cuisineId}, ${specialities}, ${description}, ${price}, ${isPopular}, ${isBengali}, ${isSpecial}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /products error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const products = await sql`
      SELECT * FROM products ORDER BY id DESC;
    `;

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /products error:", error);
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
      offerId,
      image,
      restaurantId,
      cuisineId,
      specialities,
      description,
      price,
      isPopular,
      isBengali,
      isSpecial,
    } = await request.json();

    if (!id || !name || !restaurantId || !cuisineId || price === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sql`
      UPDATE products SET
        name = ${name},
        offer_id = ${offerId},
        image = ${image},
        restaurant_id = ${restaurantId},
        cuisine_id = ${cuisineId},
        specialities = ${specialities},
        description = ${description},
        price = ${price},
        is_popular = ${isPopular},
        is_bengali = ${isBengali},
        is_special = ${isSpecial}
      WHERE id = ${id}
      RETURNING *;
    `;

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /products error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id } = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *;
    `;

    if (deleted.length === 0) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(deleted[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /products error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
