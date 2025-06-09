import { supabase } from "../config/supabase.js";

export async function stockHandler(req, res) {
  const cart = req.body.cart;

  for (const item of cart) {
    // 1. Get the current stock for the product
    const { data: product, error: fetchError } = await supabase
      .from("produkter")
      .select("Lager")
      .eq("ProduktID", item.ProduktID)
      .single();

    if (fetchError || !product) {
      return res.json({
        success: false,
        message: `Product not found (ID: ${item.ProduktID})`,
      });
    }

    if (product.Lager < item.quantity) {
      return res.json({
        success: false,
        message: `Not enough stock for ${item.Navn}`,
      });
    }

    // 2. Update the stock
    const { error: updateError } = await supabase
      .from("produkter")
      .update({ Lager: product.Lager - item.quantity })
      .eq("ProduktID", item.ProduktID);

    if (updateError) {
      return res.json({
        success: false,
        message: `Failed to update stock for ${item.Navn}`,
      });
    }
  }

  res.json({ success: true });
}
