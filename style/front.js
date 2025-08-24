
//login krne condidate data fatch kre ga

  // Page load hone par condidate ka data fetch karo
  fetch("/api/user", {
    method: "GET",
    credentials: "include"   
  })
  .then(res => {
    if (!res.ok) throw new Error("Not logged in");
    return res.json();
  })
  .then(user => {
    document.getElementById("username").innerText = user.name;
    document.getElementById("useremail").innerText = user.email;
  })
  .catch(err => {
    console.error(err);
    window.location.href = "/login.html";
  });

////
async function loadBabies() {
  const res = await fetch("/my-babies");
  const babies = await res.json();

  let rows = "";
  babies.forEach(b => {
    rows += `<tr>
      <td>${b.name}</td>
      <td>${b.dob}</td>
      <td>${b.Fname}</td>
      <td>${b.Mname}</td>
      <td>${b.phone}</td>
      <td>${b.email}</td>
    </tr>`;
  });

  document.getElementById("babyList").innerHTML = rows;
}

window.onload = loadBabies;

