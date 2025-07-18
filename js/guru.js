const db = firebase.database();
const guruRef = db.ref("guru");

const form = document.getElementById("formGuru");
const kodeInput = document.getElementById("kode");
const namaInput = document.getElementById("nama");
const pelajaranInput = document.getElementById("pelajaran");
const jenjangInput = document.getElementById("jenjang");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const tableBody = document.getElementById("guruTable");

// Tampilkan data
function loadGuru() {
  guruRef.once("value", (snapshot) => {
    tableBody.innerHTML = "";
    snapshot.forEach((child) => {
      const id = child.key;
      const data = child.val();
      const spesialisasi = data.spesialisasi.join(", ");

      const row = `
        <tr>
          <td>${id}</td>
          <td>${data.namaLengkap}</td>
          <td>${spesialisasi}</td>
          <td>${data.email || "-"}</td>
          <td>${data.nomorTelepon || "-"}</td>
          <td>${data.tanggalBergabung || "-"}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editGuru('${id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteGuru('${id}')">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  });
}

// Simpan data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = kodeInput.value.trim();
  const nama = namaInput.value.trim();
  const pelajaran = pelajaranInput.value.trim().split(",").map(s => s.trim());
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  const guruData = {
    namaLengkap: nama,
    email: email,
    nomorTelepon: phone,
    spesialisasi: pelajaran,
    tanggalBergabung: new Date().toISOString().split("T")[0]
  };

  guruRef.child(id).set(guruData, (error) => {
    if (error) {
      alert("Failed to save.");
    } else {
      alert("Added successfully.");
      form.reset();
      setReadonlyId(false);
      loadGuru();
    }
  });
});

// Edit data
window.editGuru = function (id) {
  guruRef.child(id).once("value", (snapshot) => {
    const data = snapshot.val();
    kodeInput.value = id;
    namaInput.value = data.namaLengkap || "";
    pelajaranInput.value = data.spesialisasi?.join(", ") || "";
    emailInput.value = data.email || "";
    phoneInput.value = data.nomorTelepon || "";

    setReadonlyId(true); // Lock ID saat edit
    setFormMode("edit");  
  });
};

// Hapus data
window.deleteGuru = function (id) {
  if (confirm("Are you sure you want to delete it?")) {
    guruRef.child(id).remove().then(() => {
      loadGuru();
    });
  }
};

// Reset form
window.resetForm = function () {
  form.reset();
  setReadonlyId(false);
  setFormMode("add");
};

loadGuru();
