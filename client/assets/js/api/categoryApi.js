// creating a new category
const addCategory = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const itemData = { name: name };
  const div = document.getElementById("categoryDiv");
  fetch("https://localhost:44325/api/Category/AddCategory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status == 400) {
          div.innerHTML = `<h2 style="color: red">Category Not Added</h2>`;
        } else if (response.status == 404) {
          div.innerHTML = `<h2 style="color: red">Category Already Exists</h2>`;
        }
      }
      return response.text();
    })
    .then((data) => {
      if (data == "Duplicate name") {
        div.innerHTML = `<h2 style="color: red">Category Already Exists</h2>`;
      } else {
        div.innerHTML = `<h2 style="color: red">Category Added Successfully</h2>`;
      }
    });
  div.classList.remove("d-none");
  location.reload();
};

const fillCategories = () => {
  fetch("https://localhost:44325/api/Category")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((category) => {
        const categoryDropdown = document.getElementById("category");
        let link = document.createElement("option");
        link.value = category.id;
        link.textContent = category.name;
        categoryDropdown.appendChild(link);
        categoryDropdown.appendChild(document.createElement("hr"));
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  fetch("https://localhost:44325/api/Currency")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((currency) => {
        const currencyDropdown = document.getElementById("Currency");
        const sellingCurrencyDropdown = document.getElementById("sellingCurrency");
        let link = document.createElement("option");
        let link1 = document.createElement("option");
        link.value = currency.id;
        link1.value = currency.id;
        link.textContent = currency.currencyCode;
        link1.textContent = currency.currencyCode;
        currencyDropdown.appendChild(link);
        currencyDropdown.appendChild(document.createElement("hr"));
        sellingCurrencyDropdown.appendChild(link1);
        sellingCurrencyDropdown.appendChild(document.createElement("hr"));
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const fillCategoriesTable = async () => {
  let cats = await fetch("https://localhost:44325/api/Category").then(
    (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
  );
  let table = document.getElementById("categoryTable");
  cats.map((category) => {
    let tr = document.createElement("tr");
    let idTd = document.createElement("td");
    let nameTd = document.createElement("td");
    let deleteTd = document.createElement("td");
    deleteTd.innerHTML = `<i class="bi bi-trash-fill" style="color:red"></i>`;
    deleteTd.onclick = () => {
      deleteCategory(category.id);
    };
    idTd.innerHTML = category.id;
    nameTd.innerHTML = category.name;
    tr.appendChild(idTd);
    tr.appendChild(nameTd);
    tr.appendChild(deleteTd);
    table.appendChild(tr);
  });
};

const deleteCategory = async (id) => {
  fetch(`https://localhost:44325/api/Category?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error deleting Category:", error);
    });
};
