firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("displayName").innerText = user.displayName || "Guru";
  document.getElementById("userEmail").innerText = user.email;

  // Ambil total guru
  firebase.database().ref("guru").once("value", snapshot => {
    const count = snapshot.numChildren();
    document.getElementById("totalGuru").innerText = count;
  });

  // Ambil total pelajaran
  firebase.database().ref("mataPelajaran").once("value", snapshot => {
    const count = snapshot.numChildren();
    document.getElementById("totalPelajaran").innerText = count;
  });

  // Ambil total santri (dari setiap kelas)
  firebase.database().ref("kelas").once("value", snapshot => {
    let totalSantri = 0;
    snapshot.forEach(kelasSnap => {
      const santriData = kelasSnap.child("santri");
      if (santriData.exists()) {
        totalSantri += santriData.numChildren();
      }
    });
    document.getElementById("totalSantri").innerText = totalSantri;
  });
});
