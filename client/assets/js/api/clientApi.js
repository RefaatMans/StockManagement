const logout = () => {
  sessionStorage.removeItem("loggedIn");
  window.location = `index.html`;
};

const login = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const itemData = { name: name, password: password };
  fetch("https://localhost:44325/api/User/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementById("saved").classList.remove("d-none");
      }
      return response.text();
    })
    .then((data) => {
      if (data == "LoggedIn") {
        window.location = "home.html";
        sessionStorage.setItem("loggedIn", true);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// this is related to clients
const addClient = (e) => {
  e.preventDefault();
  const name = document.getElementById("clientFullname").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  document.getElementById("saved").classList.remove("d-none");

  const clientData = {
    name: name,
    phoneNb: phone,
    address: address,
  };
  fetch("https://localhost:44325/api/Client/AddClient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      console.log("Client added successfully:", data);
    })
    .catch((error) => {
      console.error("Error adding client:", error);
    });
};

const fillClientsInvoices = () => {
  const dropdown = document.getElementById("myDropdown");
  fetch("https://localhost:44325/api/Client")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((client) => {
        let link = document.createElement("a");
        link.textContent = client.name;
        link.onclick = function () {
          document.getElementById("myDropdown").classList.remove("show");
          document.getElementById("clientInfo").classList.remove("d-none");
          document.getElementById("allCarts").classList.remove("d-none");
          document.getElementById("clientInfo").innerHTML = client.name;
          sessionStorage.setItem("clientName", client.name);
          sessionStorage.setItem("clientId", client.id);
          getAllCarts(client.id);
        };
        dropdown.appendChild(link);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
