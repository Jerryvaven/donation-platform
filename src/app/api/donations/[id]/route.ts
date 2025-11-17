import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await context.params;

    // First, get the donation details to update donor stats
    const { data: donation, error: fetchError } = await supabase
      .from("product_donations")
      .select("donor_id, product_id, quantity, products(value)")
      .eq("id", id)
      .single();

    if (fetchError || !donation) {
      console.error("Error fetching donation:", fetchError);
      return NextResponse.json(
        { error: "Donation not found", details: fetchError?.message },
        { status: 404 }
      );
    }

    // Delete the donation
    const { error: deleteError } = await supabase
      .from("product_donations")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting donation:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete donation", details: deleteError.message },
        { status: 500 }
      );
    }

    // Update donor statistics
    const productValue = (donation.products as any)?.value || 0;
    const donationValue = productValue * donation.quantity;

    // Get current donor stats
    const { data: donor, error: donorError } = await supabase
      .from("donors")
      .select("total_donated_value, total_products_donated")
      .eq("id", donation.donor_id)
      .single();

    if (!donorError && donor) {
      // Update donor stats by subtracting the deleted donation
      const newTotalValue = Math.max(
        0,
        (donor.total_donated_value || 0) - donationValue
      );
      const newTotalProducts = Math.max(
        0,
        (donor.total_products_donated || 0) - donation.quantity
      );

      // Check if donor has any remaining donations
      const { data: remainingDonations, error: checkError } = await supabase
        .from("product_donations")
        .select("id")
        .eq("donor_id", donation.donor_id);

      if (
        !checkError &&
        remainingDonations &&
        remainingDonations.length === 0
      ) {
        // No remaining donations, delete the donor
        await supabase.from("donors").delete().eq("id", donation.donor_id);
      } else {
        // Update donor stats
        await supabase
          .from("donors")
          .update({
            total_donated_value: newTotalValue,
            total_products_donated: newTotalProducts,
            updated_at: new Date().toISOString(),
          })
          .eq("id", donation.donor_id);
      }
    }

    return NextResponse.json({ message: "Donation deleted successfully" });
  } catch (error: any) {
    console.error("Exception in delete donation API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();
    const { id } = await context.params;

    const {
      product_id,
      quantity,
      donation_date,
      notes,
      matched,
      fire_department_id,
    } = body;

    // Get the current donation details
    const { data: currentDonation, error: fetchError } = await supabase
      .from("product_donations")
      .select("donor_id, product_id, quantity, products(value)")
      .eq("id", id)
      .single();

    if (fetchError || !currentDonation) {
      console.error("Error fetching donation:", fetchError);
      return NextResponse.json(
        { error: "Donation not found", details: fetchError?.message },
        { status: 404 }
      );
    }

    // Get current product value
    const currentProductValue = (currentDonation.products as any)?.value || 0;
    const oldValue = currentProductValue * currentDonation.quantity;

    // Get new product value if product_id is changing
    let newProductValue = currentProductValue;
    if (product_id && product_id !== currentDonation.product_id) {
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .select("value")
        .eq("id", product_id)
        .single();

      if (productError || !newProduct) {
        return NextResponse.json(
          { error: "Invalid product ID", details: productError?.message },
          { status: 400 }
        );
      }
      newProductValue = parseFloat(newProduct.value.toString());
    }

    const newQuantity =
      quantity !== undefined ? quantity : currentDonation.quantity;
    const newValue = newProductValue * newQuantity;

    // Update donor statistics
    const valueDifference = newValue - oldValue;
    const quantityDifference = newQuantity - currentDonation.quantity;

    if (valueDifference !== 0 || quantityDifference !== 0) {
      const { data: donor, error: donorError } = await supabase
        .from("donors")
        .select("total_donated_value, total_products_donated")
        .eq("id", currentDonation.donor_id)
        .single();

      if (!donorError && donor) {
        const newTotalValue = Math.max(
          0,
          (donor.total_donated_value || 0) + valueDifference
        );
        const newTotalProducts = Math.max(
          0,
          (donor.total_products_donated || 0) + quantityDifference
        );

        await supabase
          .from("donors")
          .update({
            total_donated_value: newTotalValue,
            total_products_donated: newTotalProducts,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentDonation.donor_id);
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (product_id !== undefined) updateData.product_id = product_id;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (donation_date !== undefined) updateData.donation_date = donation_date;
    if (notes !== undefined) updateData.notes = notes;
    if (matched !== undefined) updateData.matched = matched;
    if (fire_department_id !== undefined)
      updateData.fire_department_id = fire_department_id;
    if (matched !== undefined)
      updateData.status = matched ? "MATCHED" : "PENDING";

    const { data, error } = await supabase
      .from("product_donations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating donation:", error);
      return NextResponse.json(
        { error: "Failed to update donation", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: "Donation updated successfully",
    });
  } catch (error: any) {
    console.error("Exception in update donation API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
