// js/firebase-config.js
// const firebaseConfig = {
//     apiKey: "AIzaSyCSeeWmz77kxlpk0jIEYiGwBzJ1C21yIok",
//     authDomain: "system-academic-tpa-tka.firebaseapp.com",
//     projectId: "system-academic-tpa-tka",
//     storageBucket: "system-academic-tpa-tka.firebasestorage.app",
//     messagingSenderId: "113836728009",
//     appId: "1:113836728009:web:f9e028cad99e7d90cb3718",
//     measurementId: "G-B62ZSBTCZC"
//   };
  
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
  
// js/firebase-config.js
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSeeWmz77kxlpk0jIEYiGwBzJ1C21yIok",
  authDomain: "system-academic-tpa-tka.firebaseapp.com",
  databaseURL: "https://system-academic-tpa-tka-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "system-academic-tpa-tka",
  storageBucket: "system-academic-tpa-tka.firebasestorage.app",
  messagingSenderId: "113836728009",
  appId: "1:113836728009:web:f9e028cad99e7d90cb3718",
  measurementId: "G-B62ZSBTCZC"
};
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// Highlight Sidebar
const currentPath = window.location.pathname.split("/").pop();
const links = {
  "dashboard.html": "nav-dashboard",
  "mataPelajaran.html": "nav-pelajaran",
  "guru.html": "nav-guru",
  "kelas.html": "nav-kelas",
  "detailKelas.html": "nav-kelas",
  "absen.html": "nav-kelas",
  "addJadwal.html": "nav-kelas",
  "addSantri.html": "nav-kelas",
  "detailAbsen.html": "nav-kelas"
};
if (links[currentPath]) {
  document.getElementById(links[currentPath]).classList.add("active");
}


    function toggleSidebar() {
      const sidebar = document.getElementById("sidebar");
      const topbar = document.getElementById("topbar");
      const content = document.getElementById("content");

      if (window.innerWidth <= 768) {
        // MOBILE: pakai class show
        sidebar.classList.toggle("show");
      } else {
        // DESKTOP: toggle hide & atur margin
        sidebar.classList.toggle("hide");
        topbar.classList.toggle("full");
        content.classList.toggle("full");
      }
    }

    // DETEKSI KLIK DI LUAR SIDEBAR
  document.addEventListener("click", function (e) {
    const isMobile = window.innerWidth <= 768;
    const isSidebarOpen = sidebar.classList.contains("show");

    if (
      isMobile &&
      isSidebarOpen &&
      !sidebar.contains(e.target) &&
      !e.target.closest(".hamburger")
    ) {
      sidebar.classList.remove("show");
    }
  });