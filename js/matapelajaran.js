const db = firebase.database();
const form = document.getElementById("formMapel");
const table = document.getElementById("tableMapel");

// Elemen UI
const mapelIdInput = document.getElementById("idMapel");
const namaMapelInput = document.getElementById("namaMapel");
const deskripsiInput = document.getElementById("deskripsi");
const formTitle = document.getElementById("formTitle");
const mapelIdHidden = document.getElementById("mapelId");
const submitButton = form.querySelector("button[type='submit']");

// Autentikasi
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadData();
  }
});

// Load data dari Firebase
function loadData() {
  db.ref("mataPelajaran").on("value", snapshot => {
    table.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const data = child.val();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${id}</td>
        <td>${data.nama}</td>
        <td>${data.deskripsi}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editMapel('${id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="hapusMapel('${id}')">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  });
}

// Simpan (add/update)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = mapelIdInput.value.trim();
  const data = {
    nama: namaMapelInput.value,
    deskripsi: deskripsiInput.value
  };

  db.ref("mataPelajaran/" + id).set(data).then(() => resetForm());
});

// Edit
function editMapel(id) {
  db.ref("mataPelajaran/" + id).once("value").then(snapshot => {
    const data = snapshot.val();

    mapelIdInput.value = id;
    mapelIdInput.disabled = true;
    mapelIdInput.classList.add("bg-light");

    namaMapelInput.value = data.nama;
    deskripsiInput.value = data.deskripsi;

    mapelIdHidden.value = id;
    formTitle.innerText = "Edit Mata Pelajaran";
    submitButton.innerText = "Save";
  });
}

// Hapus
function hapusMapel(id) {
  if (confirm("Are you sure you want to delete it?")) {
    db.ref("mataPelajaran/" + id).remove();
  }
}

// Reset form
function resetForm() {
  form.reset();
  mapelIdInput.disabled = false;
  mapelIdInput.classList.remove("bg-light");
  mapelIdHidden.value = "";
  formTitle.innerText = "Add Mata Pelajaran";
  submitButton.innerText = "Add";
}
