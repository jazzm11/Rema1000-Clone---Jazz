import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";

export async function backendHandler(req, res) {
  const { brukernavn, passord, liste } = req.body;
  const epost = brukernavn + "@epost.no";

  // 1. Try to find the user
  const { data: eksisterendeBruker } = await supabase
    .from("Brukere")
    .select("BrukerID, Brukernavn, Passord")
    .eq("Brukernavn", brukernavn)
    .single();

  if (eksisterendeBruker) {
    // LOGIN: Check password with bcrypt
    const passwordMatch = await bcrypt.compare(
      passord,
      eksisterendeBruker.Passord
    );
    if (passwordMatch) {
      return res.status(200).json({
        success: true,
        message: "Bruker funnet",
        bruker: eksisterendeBruker,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Feil passord",
      });
    }
  } else {
    // REGISTER: Hash password and create new user
    const hashedPassword = await bcrypt.hash(passord, 10);
    const { error: registreringsFeil, data: nyBruker } = await supabase
      .from("Brukere")
      .insert([
        {
          Brukernavn: brukernavn,
          Passord: hashedPassword,
          Epost: epost,
        },
      ])
      .select()
      .single();

    if (registreringsFeil) {
      console.log("Kan ikke registrere bruker: ", registreringsFeil);
      return res
        .status(500)
        .json({ success: false, message: "Klarte ikke registrere" });
    }
    return res.status(200).json({
      success: true,
      message: "Bruker er registrert",
      bruker: nyBruker,
    });
  }
}
