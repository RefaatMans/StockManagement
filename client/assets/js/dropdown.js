function myFunction() {
  
  document.getElementById("posDiv").classList.add("d-none");
  // document.getElementById("allCarts").classList.add("d-none");
  // document.getElementById("pdf-content1").classList.add("d-none");
  document.getElementById("clientInfo").classList.add("d-none");
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

const fillClients = () => {
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
          document.getElementById("posDiv").classList.remove("d-none");
          document.getElementById("myDropdown").classList.remove("show");
          document.getElementById("clientInfo").classList.remove("d-none");
          document.getElementById("clientInfo").innerHTML = client.name;
          sessionStorage.setItem("clientName", client.name);
          sessionStorage.setItem("clientId", client.id);
          sessionStorage.setItem("cartItems", [0]);
          document.getElementById("cartCount").innerHTML = 0;
          location.reload();
        };
        dropdown.appendChild(link);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
