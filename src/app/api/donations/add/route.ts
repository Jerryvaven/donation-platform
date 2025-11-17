import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    const {
      donorName,
      city,
      county,
      address,
      productId,
      quantity,
      matched,
      fireDepartmentId,
    } = body;

    if (!donorName || !productId || !quantity) {
      return NextResponse.json(
        { error: "Donor name, product, and quantity are required" },
        { status: 400 }
      );
    }

    // Check if donor exists
    const { data: existingDonor } = await supabase
      .from("donors")
      .select("id, total_donated_value, total_products_donated")
      .eq("name", donorName)
      .single();

    // Get product value
    const { data: product } = await supabase
      .from("products")
      .select("value")
      .eq("id", productId)
      .single();

    const productValue = product
      ? parseFloat(product.value.toString()) * parseInt(quantity)
      : 0;

    let donorId: string;

    if (existingDonor) {
      // Update existing donor
      donorId = existingDonor.id;
      const newTotalValue =
        parseFloat(existingDonor.total_donated_value.toString()) + productValue;
      const newTotalProducts =
        (existingDonor.total_products_donated || 0) + parseInt(quantity);

      await supabase
        .from("donors")
        .update({
          total_donated_value: newTotalValue,
          total_products_donated: newTotalProducts,
          city: city || null,
          county: county || null,
          address: address || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", donorId);
    } else {
      // Create new donor
      const { data: newDonor, error: donorError } = await supabase
        .from("donors")
        .insert([
          {
            name: donorName,
            total_donated_value: productValue,
            total_products_donated: parseInt(quantity),
            city: city || null,
            county: county || null,
            address: address || null,
          },
        ])
        .select("id")
        .single();

      if (donorError) throw donorError;
      donorId = newDonor.id;
    }

    // Add product donation
    const { data: donation, error: donationError } = await supabase
      .from("product_donations")
      .insert([
        {
          donor_id: donorId,
          product_id: productId,
          fire_department_id:
            matched && fireDepartmentId ? fireDepartmentId : null,
          quantity: parseInt(quantity),
          donation_date: new Date().toISOString().split("T")[0],
          matched: matched || false,
          status: matched ? "MATCHED" : "PENDING",
        },
      ])
      .select()
      .single();

    if (donationError) throw donationError;

    return NextResponse.json(
      {
        data: donation,
        message: "Product donation added successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Exception in add donation API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
