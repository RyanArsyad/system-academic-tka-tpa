const db = firebase.database();
const table = document.getElementById("tableKelas");

const form = document.getElementById("formKelas");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");

const idKelas = document.getElementById("idKelas");
const namaKelas = document.getElementById("namaKelas");
const tingkat = document.getElementById("tingkat");
const tahunAkademik = document.getElementById("tahunAkademik");
const waliKelasId = document.getElementById("waliKelasId");
const aktif = document.getElementById("aktif");
const kelasIdHidden = document.getElementById("kelasIdHidden");

// Data guru disimpan di sini agar bisa digunakan untuk menampilkan nama guru di tabel
let guruList = {};

// Auth check dan load data
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Load guru lalu baru load kelas
    firebase.database().ref("guru").once("value").then(snapshot => {
      guruList = snapshot.val() || {};
      Object.entries(guruList).forEach(([id, guru]) => {
        const option = document.createElement("option");
        option.value = id;
        option.text = `${id} - ${guru.namaLengkap}`;
        waliKelasId.appendChild(option);
      });

      loadData();
    });
  }
});

// Load data kelas ke tabel
function loadData() {
  db.ref("kelas").on("value", snapshot => {
    table.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const data = child.val();
      const namaGuru = guruList[data.waliKelasId]?.namaLengkap || "Undefined";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${id}</td>
        <td>${data.namaKelas}</td>
        <td>${data.tingkat}</td>
        <td>${data.tahunAkademik}</td>
        <td>${data.waliKelasId} - ${namaGuru}</td>
        <td>${data.aktif ? "Aktif" : "Tidak"}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editKelas('${id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="hapusKelas('${id}')">Delete</button>
          <a href="detailKelas.html?kelasId=${id}" class="btn btn-sm btn-info">Detail</a>
        </td>
      `;
      table.appendChild(row);
    });
  });
}

// Simpan data kelas (tambah atau edit)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = idKelas.value.trim();
  const data = {
    namaKelas: namaKelas.value,
    tingkat: tingkat.value,
    tahunAkademik: tahunAkademik.value,
    waliKelasId: waliKelasId.value,
    aktif: aktif.value === "true"
  };

  if (kelasIdHidden.value) {
    // Edit → update agar tidak overwrite child node (jadwal, absensi, santri)
    db.ref("kelas/" + id).update(data).then(() => resetForm());
  } else {
    // Tambah baru
    db.ref("kelas/" + id).set(data).then(() => resetForm());
  }
});

// Isi form untuk edit
function editKelas(id) {
  db.ref("kelas/" + id).once("value").then(snapshot => {
    const data = snapshot.val();
    idKelas.value = id;
    idKelas.disabled = true;
    namaKelas.value = data.namaKelas;
    tingkat.value = data.tingkat;
    tahunAkademik.value = data.tahunAkademik;
    waliKelasId.value = data.waliKelasId;
    aktif.value = data.aktif ? "true" : "false";

    formTitle.innerText = "Edit Kelas";
    submitButton.innerText = "Save";
    kelasIdHidden.value = id;
  });
}

// Hapus kelas
function hapusKelas(id) {
  if (confirm("Are you sure you want to delete this kelas?")) {
    db.ref("kelas/" + id).remove();
  }
}

// Reset form
function resetForm() {
  form.reset();
  idKelas.disabled = false;
  submitButton.innerText = "Add";
  formTitle.innerText = "Add Kelas";
  kelasIdHidden.value = "";
}
