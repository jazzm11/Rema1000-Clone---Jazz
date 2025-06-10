let liste = 0;

async function loggInnBruker() {
  const brukernavn = document.getElementById("brukernavn").value;
  const passord = document.getElementById("passord").value;

  liste = 0;

  try {
    const response = await fetch("https://rema1000-clone-jazz.onrender.com/api/backend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brukernavn, passord, liste }),
    });

    const resultat = await response.json();
    console.log("Resultat fra server: ", resultat);
    if (resultat.success) {
      localStorage.setItem("BrukerID", resultat.bruker.BrukerID);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify([]));
      window.location.href = "/rema.html";
      console.log("Bruker logget inn: ", localStorage.getItem("BrukerID"));
    } else {
      alert("Feil: " + resultat.message);
    }
  } catch (error) {
    console.error();
  }
}
