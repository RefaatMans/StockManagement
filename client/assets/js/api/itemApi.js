// adding the item to the db
const addItem = (e) => {
  e.preventDefault();
  var url = new URL(window.location.href);
  var id = url.searchParams.get("id");
  if (id) {
    updateItem(e, id);
    return;
  }
  const category = document.getElementById("category").value;
  const currency = document.getElementById("Currency").value;
  const sellingCurrency = document.getElementById("sellingCurrency").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const isActive = document.getElementById("activeCheckBox").checked;
  const sellingprice = document.getElementById("sellingprice").value;
  const image = document.getElementById("image").value;

  const itemData = {
    //   catId: category,
    //   name: name,
    //   price: price,
    //   isActive: isActive,
    //   sellingPrice: sellingprice,
    //   sellingCurrencyId: parseInt(sellingCurrency),
    //   currancyId: parseInt(currency),
    //   image: "",
    // };
    // {
    catId: category,
    currencyId: parseInt(currency),
    sellingCurrencyId: parseInt(sellingCurrency),
    price: parseFloat(price),
    sellingPrice: parseFloat(sellingprice),
    name: name,
    image: "",
    isActive: isActive,
  };
  console.log(JSON.stringify(itemData));
  fetch("https://localhost:44325/api/Items/AddItem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementById(
          "saved"
        ).innerHTML = `<h2 style="color: red">Item already exists</h2>`;
        document.getElementById("saved").classList.remove("d-none");
        return;
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("saved").classList.remove("d-none");
    })
    .catch((error) => {
      console.error("Error adding client:", error);
    });
};

const checkForEdit = () => {
  var url = new URL(window.location.href);
  var id = url.searchParams.get("id");
  if (id !== null) {
    document.getElementById("title").innerHTML = `Edit Item`;
    document.getElementById("");
    document.getElementById("deleteBtn").classList.remove("d-none");
    document.getElementById("activeBtn").classList.remove("d-none");
    editItem(id);
  }
};

// deleting an item

const deleteItem = async () => {
  var url = new URL(window.location.href);
  var id = url.searchParams.get("id");
  await fetch(`https://localhost:44325/api/Items?id=${id}`, {
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
      window.location = `allItems.html`;
    })
    .catch((error) => {
      console.error("Error deleting Item:", error);
    });
};

// this is to fill the items
const fillItems = () => {
  fetch("https://localhost:44325/api/Category")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const itemsDiv = document.getElementById("itemsDiv");
      data.map((category) => {
        let name = document.createElement("h1");
        let div = document.createElement("div");
        div.classList.add("cardsDiv");
        fetch(
          `https://localhost:44325/api/Items/GetItemsByCategory/${category.id}`
        )
          .then((response) => {
            if (!response.ok) {
              div.classList.add("justify-content-center");
              const card = document.createElement("div");
              div.classList.remove("cardsDiv");
              card.style = `text-align: center`;
              card.innerHTML = `
                <h3 class="text-center" style="font-size 13px !important;">This Category Has No Items <br /><br /><a href="addItem.html" class="addItemsBtn" style="font-size: 10px">Add Item</a></h3>
                `;
              div.appendChild(card);
            }
            if (response.status == 400 || response.status == 404)
              return response.text();
            return response.json();
          })
          .then((items) => {
            if (!Array.isArray(items)) {
              return;
            }
            items.map((item) => {
              const card = document.createElement("div");
              card.classList.add("card");
              if (item.isActive) {
                card.innerHTML = `
                <a href="addItem.html?id=${item.id}" class="cardsA">
                <img src="./assets/img/mtc.png" alt="Product Image" />
                <div class="card-content">
                <h2>${item.name}</h2>
                <p>Price: <span>$${item.sellingPrice}</span></p>
                </div>
                </a>
                `;
              } else {
                card.innerHTML = `
                <a href="addItem.html?id=${item.id}" class="cardsA">
                <img src="./assets/img/mtc.png" alt="Product Image" />
                <div class="card-content">
                <h2>${item.name}</h2>
                <p>Price: <span>$${item.sellingPrice}</span></p>
                <p style="color:red"><span>Item Disabled!</span></p>
                </div>
                </a>
                `;
              }
              div.appendChild(card);
            });
          });
        name.innerHTML = category.name;

        let hr = document.createElement("hr");
        itemsDiv.appendChild(name);
        itemsDiv.appendChild(div);
        itemsDiv.appendChild(hr);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

// update item
const updateItem = (e, id) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const sellingPrice = document.getElementById("sellingprice").value;
  const isActive = document.getElementById("activeCheckBox").checked;
  const catId = document.getElementById("category").value;
  const currancyId = document.getElementById("Currency").value;
  let div = document.getElementById("save");
  let itemData = {
    catId: parseFloat(catId),
    currancyId: parseFloat(currancyId),
    price: parseFloat(price),
    sellingPrice: parseFloat(sellingPrice),
    name: name,
    image: "",
    isActive: isActive,
  };
  console.log(itemData);
  fetch(`https://localhost:44325/api/Items/UpdateItem/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status == 400) {
          div.innerHTML = `<h2 style="color: red">Category Not Added</h2>`;
        }
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("title").innerHTML = "Item Edit Successfully";
      setTimeout(function () {
        window.location.href = "allItems.html";
      }, 500);
    });
};

// this is to edit a item
const editItem = async () => {
  const currentUrl = window.location.search;
  const urlSearchParams = new URLSearchParams(currentUrl);
  const id = urlSearchParams.get("id");
  await fetch(`https://localhost:44325/api/Items/GetItemById/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("name").value = data[0].name;
      document.getElementById("price").value = data[0].price;
      document.getElementById("sellingprice").value = data[0].sellingPrice;
      const categoryDropdown = document.getElementById("category");
      const currencyDropdown = document.getElementById("Currency");
      document.getElementById("activeCheckBox").checked = data[0].isActive;
      const categoryName = data[0].category.name;
      const currenctName = data[0].currency.currencyCode;

      for (let i = 0; i < categoryDropdown.options.length; i++) {
        if (categoryDropdown.options[i].text === categoryName) {
          categoryDropdown.options[i].selected = true;
          break;
        }
      }
      for (let i = 0; i < currencyDropdown.options.length; i++) {
        if (currencyDropdown.options[i].text === currenctName) {
          currencyDropdown.options[i].selected = true;
          break;
        }
      }
    });
};

const fillItemsTable = async () => {
  let table = document.getElementById("itemPricesTable");
  await fetch("https://localhost:44325/api/Items")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((item) => {
        let tr = document.createElement("tr");
        tr.id = item.id;
        let IdTd = document.createElement("td");
        IdTd.innerHTML = item.id;
        tr.appendChild(IdTd);
        let nameTd = document.createElement("td");
        nameTd.innerHTML = item.name;
        tr.appendChild(nameTd);
        let curTd = document.createElement("td");
        curTd.innerHTML = item.currency.currencyCode;
        tr.appendChild(curTd);
        let priceTd = document.createElement("td");
        priceTd.innerHTML = `<input type='number' class='pricesClass' disabled value='${parseFloat(
          item.price
        )}' id='input${item.id}'/>`;
        tr.appendChild(priceTd);
        let checkTd = document.createElement("td");
        checkTd.innerHTML = `<input type='checkbox' value='${item.price}' data-item-id='${item.id}' onclick="toggleInput(this)"/>`;
        tr.appendChild(checkTd);
        table.appendChild(tr);
      });
    });
};

const toggleInput = (checkbox) => {
  const itemId = checkbox.dataset.itemId;
  const inputElement = document.getElementById(`input${itemId}`);

  if (inputElement) {
    inputElement.disabled = !checkbox.checked;
  }
};

// change all prices
const addAllPrices = (e) => {
  e.preventDefault();
  let percentage = document.getElementById("percentage").value;
  if (percentage == "") {
    return;
  }
  let inputs = document.getElementsByClassName("pricesClass");
  let inputArray = [...inputs];
  if (document.getElementById("byPercent").checked) {
    percentage = percentage / 100;
  }
  inputArray.map((input) => {
    if (document.getElementById("byPercent").checked) {
      input.value = (
        parseFloat(input.value) + parseFloat(input.value * percentage)
      ).toFixed(2);
    } else {
      input.value = (parseFloat(input.value) + parseFloat(percentage)).toFixed(
        2
      );
    }
  });
};

const saveAllPrices = () => {
  let inputs = document.getElementsByClassName("pricesClass");
  let list = [];
  let inputArray = [...inputs];
  inputArray.map((input) => {
    let dataObj = {
      id: parseInt(input.id.split("input")[1]),
      price: parseFloat(input.value),
    };
    list.push(dataObj);
  });
  fetch(`https://localhost:44325/api/Items/UpdatePrice`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(list),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status == 400) {
          // div.innerHTML = `<h2 style="color: red">Category Not Added</h2>`;
        }
      }
      return response.text();
    })
    .then((data) => {
      location.reload();
    });
};
let i = true;
const filterItems = async () => {
  if (!i) {
    await fillItemsTable();
  }
  i = false;
  let currency = document.getElementById("Currency").value;
  if (currency == "Currency") {
    location.reload();
  }
  let trs = document.getElementsByTagName("tr");
  let trsArray = [...trs];
  trsArray.splice(0, 1);
  trsArray.map(async (tr) => {
    if (tr.children[2].innerHTML != currency) {
      tr.remove();
    }
  });
};
