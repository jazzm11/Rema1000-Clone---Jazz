import { supabase } from "../config/supabase.js";

export async function produktHandler(req, res) {

  const { data, error } = await supabase
  .from("produkter")
  .select("*");


  if (error) {
    throw new Error("Could not load products.");
  } else {
    return res.status(200).json(data); // Sender tilbake produktene som JSON 
  }
}
