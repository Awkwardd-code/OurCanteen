import { neon } from "@neondatabase/serverless";

// CREATE an order
export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const {
      product_name,
      number,
      amount,
      price,
      user_id,
      quantity,
      is_paid,
      image,
      student_id,
      restaurant_name,
      cuisine_name,
    } = await request.json();

    // Parse numeric fields
    const parsedNumber = parseInt(number, 10);
    const parsedStudentId = parseInt(student_id, 10);
    const parsedQuantity = parseInt(quantity, 10);
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(price);

    // Validate required fields and numeric parsing
    if (
      !product_name ||
      isNaN(parsedNumber) ||
      isNaN(parsedAmount) ||
      isNaN(parsedPrice) ||
      isNaN(parsedQuantity) ||
      isNaN(parsedStudentId) ||
      !user_id ||
      !restaurant_name
    ) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO orders (
        product_name, number, amount, price, quantity,
        is_paid, student_id, restaurant_name, cuisine_name, image, user_id
      ) VALUES (
        ${product_name}, ${parsedNumber}, ${parsedAmount}, ${parsedPrice}, ${parsedQuantity},
        ${is_paid ?? false}, ${parsedStudentId}, ${restaurant_name}, ${cuisine_name ?? null}, ${image ?? null}, ${user_id}
      )
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /orders error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// GET all orders
export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    let response;

    if (userId) {
      response = await sql`
        SELECT * FROM orders
        WHERE user_id = ${userId}
        ORDER BY created_at DESC;
      `;
    } else {
      response = await sql`
        SELECT * FROM orders
        ORDER BY created_at DESC;
      `;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /orders error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
