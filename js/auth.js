// js/auth.js

// Register
function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const registerBtn = document.getElementById("registerBtn");

  if (!name || !email || !password) {
    alert("All fields must be filled in!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters!");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.innerText = "Processed...";

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // console.log("✅ Berhasil createUser");
      const user = userCredential.user;

      return user.updateProfile({
        displayName: name
      }).then(() => {
        // console.log("✅ Display name diupdate:", name);
        return firebase.database().ref("users/" + user.uid).set({
          name: name,
          email: email,
          role: "admin",
          createdAt: new Date().toISOString()
        });
      }); 
    })
    .then(() => {
      // console.log("✅ Data user disimpan ke Realtime Database");
      alert("Registration successful.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      // console.error("❌ Gagal:", error);
      alert("Registrasi gagal: " + error.message);
      registerBtn.disabled = false;
      registerBtn.innerText = "Register";
    });
}


// Login
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  document.getElementById("loginEmail").classList.add("error-input");

  const password = document.getElementById("loginPassword").value;

  // Reset error text
  document.getElementById("emailError").innerText = "";
  document.getElementById("passwordError").innerText = "";

  let hasError = false;

  if (!email) {
    document.getElementById("emailError").innerText = "Email is required.";
    hasError = true;
  }

  if (!password) {
    document.getElementById("passwordError").innerText = "Password is required.";
    hasError = true;
  }

  if (hasError) return;

  // Firebase login
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      const errorCode = error.code || (error.error && error.error.message);

      if (errorCode === "auth/user-not-found" || errorCode === "INVALID_LOGIN_CREDENTIALS") {
        document.getElementById("emailError").innerText = "Email not found.";
      } else if (errorCode === "auth/wrong-password") {
        document.getElementById("passwordError").innerText = "Incorrect password.";
      } else {
        alert("Login failed: " + error.message);
      }
    });
}


// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}
