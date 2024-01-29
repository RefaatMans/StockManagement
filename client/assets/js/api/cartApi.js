let total = 0;
const fillCartItems = async (cart) => {
  let itemsDiv = document.getElementById("itemsDiv");
  itemsDiv.innerHTML = "";
  if (cart == "") {
    itemsDiv.innerHTML = "no Items";
  }
  let cartArray = cart.split(",");
  cartArray.splice(0, 1);
  const cartItems = cartArray.reduce((acc, itemId) => {
    acc[itemId] = acc[itemId] || { count: 0, item: null };
    acc[itemId].count += 1;
    return acc;
  }, {});
  const fetchPromises = cartArray.map((cartItem) => {
    let fetchUrl = `https://localhost:44325/api/Items/GetItemById/${cartItem}`;
    if (!cartItem) {
      return;
    }
    return fetch(fetchUrl).then((response) => {
      if (!response.ok) {
        console.error(
          `Error fetching item with ID ${cartItem}: ${response.status}`
        );
        return null;
      }
      if (response.status === 400 || response.status === 404) {
        console.warn(`Item with ID ${cartItem} not found`);
        return null;
      }
      return response.json();
    });
  });
  const items = await Promise.all(fetchPromises);
  items.forEach((item, index) => {
    if (item && !cartItems[cartArray[index]].itemRendered) {
      let itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.dataset.rendered = true;
      itemDiv.innerHTML = `
          <img src="./assets/img/mtc.png" alt="" width="50" />
          <h3>${item[0].name}</h3>
          <p id='priceP${item[0].id}'>Price: $${item[0].sellingPrice}</p>
          <input type="number" value=${
            cartItems[cartArray[index]].count
          } min="1" onchange="changeQty(${item[0].id});changeTotal(${
        item[0].id
      })" id="input${item[0].id}"/>
          <p id="rowTotal${item[0].id}" class="rowTotal">Total: $${
        item[0].sellingPrice * cartItems[cartArray[index]].count
      }</p>
          <button class="remove-item" onclick="removeItem(${item[0].id})">
            <i class="bi bi-trash3-fill"></i>
          </button>`;
      itemsDiv.appendChild(itemDiv);
      cartItems[cartArray[index]].itemRendered = true;
      cartItems[cartArray[index]].item = item[0];
      total = total + item[0].sellingPrice * cartItems[cartArray[index]].count;
      document.getElementById("totalPrice").innerHTML = `Total: $${total}`;
    }
  });
};

const changeTotal = (id) => {
  total = 0;
  let price = document.getElementById(`priceP${id}`).innerHTML;
  const qty = document.getElementById(`input${id}`).value;
  price = price.split("$")[1];
  document.getElementById(`rowTotal${id}`).innerHTML = `Total: $${
    parseFloat(price) * parseFloat(qty)
  }`;
  let rows = document.getElementsByClassName("rowTotal");
  let rowsArray = Array.from(rows);
  rowsArray.map((row) => {
    price = row.innerHTML.split("$")[1];
    total = parseFloat(total) + parseFloat(price);
  });
  document.getElementById("totalPrice").innerHTML = `Total: $${total}`;
};

const removeItem = (id) => {
  var inputString = sessionStorage.getItem("cartItems");
  var arrayFromString = inputString ? inputString.split(",") : [];
  var filteredArray = arrayFromString.filter((item) => item !== `${id}`);
  sessionStorage.setItem("cartItems", filteredArray.join(","));
  location.reload();
};
const changeQty = (id) => {
  let newValue = document.getElementById(`input${id}`).value;

  let inputString = sessionStorage.getItem("cartItems");
  let cartArray = inputString ? inputString.split(",") : [];
  let resultArray = cartArray.filter((item) => item !== "");

  let copyArr = [...resultArray];
  let filtered = copyArr.filter((item) => item !== id.toString());

  for (let i = 0; i < newValue; i++) {
    filtered.push(id);
  }
  sessionStorage.setItem("cartItems", filtered.toString());
};

const fillReceipt = async () => {
  document.getElementById("pdf-content").classList.remove("d-none");
  const currentDate = new Date();

  const formattedDate = `${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours() % 12 || 12}:${String(
    currentDate.getMinutes()
  ).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")} ${
    currentDate.getHours() >= 12 ? "pm" : "am"
  }`;

  const currentDateTimeString = `${formattedDate} at ${formattedTime}`;

  document.getElementById("recieptDate").innerHTML = currentDateTimeString;

  let receiptNb = await fetch(
    "https://localhost:44325/api/Cart/getLastCart"
  ).then((response) => {
    return response.json();
  });
  document.getElementById("recietNb").innerHTML = `Receipt#${receiptNb + 1}`;

  document.getElementById("recieptName").innerHTML =
    sessionStorage.getItem("clientName");
  const receiptTable = document.getElementById("receiptTable");
  receiptTable.innerHTML = "";
  const cartString = sessionStorage.getItem("cartItems");
  const cartArray = cartString ? cartString.split(",") : [];
  const headerRow = receiptTable.insertRow();
  headerRow.innerHTML =
    "<th>Id</th><th>Name</th><th>Qty</th><th>Price</th><th>Total</th>";
  cartArray.splice(0, 1);
  const countMap = cartArray.reduce((acc, item) => {
    if (acc[item]) {
      acc[item]++;
    } else {
      acc[item] = 1;
    }
    return acc;
  }, {});
  const newArray = Object.entries(countMap).map(([id, count]) => ({
    id,
    count,
  }));
  const fetchPromises = newArray.map(async (cartItem) => {
    const fetchUrl = `https://localhost:44325/api/Items/GetItemById/${cartItem.id}`;
    if (cartItem == 0) return null;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.error(
        `Error fetching item with ID ${cartItem}: ${response.status}`
      );
      return null;
    }
    return response.json();
  });
  const items = await Promise.all(fetchPromises);
  let totalPrice = 0;
  items.map((item) => {
    let tr = document.createElement("tr");
    let idTd = document.createElement("td");
    let nameTd = document.createElement("td");
    let qtyTd = document.createElement("td");
    let priceTd = document.createElement("td");
    let totalTd = document.createElement("td");
    const countObj = newArray.find((cartItem) => cartItem.id == item[0].id);
    const count = countObj ? countObj.count : 0;
    idTd.innerHTML = item[0].id;
    nameTd.innerHTML = item[0].name;
    qtyTd.innerHTML = count;
    priceTd.innerHTML = item[0].sellingPrice;
    totalPrice = totalPrice + count * item[0].sellingPrice;
    totalTd.innerHTML = count * item[0].sellingPrice;
    tr.appendChild(idTd);
    tr.appendChild(nameTd);
    tr.appendChild(qtyTd);
    tr.appendChild(priceTd);
    tr.appendChild(totalTd);
    receiptTable.appendChild(tr);
    document.getElementById("recieptTotal").innerHTML = `Total: $${totalPrice}`;
  });
};

const exitReceipt = () => {
  document.getElementById("pdf-content").classList.add("d-none");
};

const saveCart = async () => {
  let id = sessionStorage.getItem("clientId");
  let total = document.getElementById("recieptTotal").innerHTML;
  total = total.split("$")[1];
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  let itemData = {
    clientId: id,
    total: total,
    date: formattedDate,
  };
  await fetch("https://localhost:44325/api/Cart/AddCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      console.log("cart added successfully:", data);
    })
    .catch((error) => {
      console.error("Error adding cart:", error);
    });

  // this is to save the details
  let table = document.getElementsByTagName("table")[0].children;
  let tableArray = [...table];
  tableArray.shift();
  let receiptNb = await fetch(
    "https://localhost:44325/api/Cart/getLastCart"
  ).then((response) => {
    return response.json();
  });

  tableArray.map(async (cartItem) => {
    let idTdContent = cartItem.getElementsByTagName("td")[0].textContent;
    let qtyTdContent = cartItem.getElementsByTagName("td")[2].textContent;
    let priceTdContent = cartItem.getElementsByTagName("td")[3].textContent;

    let data = {
      cartId: receiptNb,
      itemId: parseInt(idTdContent),
      unitPrice: parseFloat(priceTdContent),
      qty: parseInt(qtyTdContent),
    };
    await fetch("https://localhost:44325/api/CartDetials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        console.log("cartDetails added successfully:", data);
      })
      .catch((error) => {
        console.error("Error adding cartDetails:", error);
      });
  });
};
