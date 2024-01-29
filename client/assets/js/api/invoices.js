const getAllCarts = async (id) => {
  let allcarts = document.getElementById("allCarts");
  allcarts.innerHTML = ``;
  await fetch(`https://localhost:44325/api/Cart/GetByClientId?clientId=${id}`)
    .then((response) => {
      if (!response.ok) {
        allcarts.innerHTML = `No Invoices`;
        return;
      }
      return response.json();
    })
    .then((data) => {
      data.map((item) => {
        let date = document.createElement("h4");
        var dateStr = new Date(item.date);
        var formattedDate = dateStr.toLocaleDateString("en-GB");
        var formattedTime = dateStr.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        var formattedDateTime = formattedDate + " - " + formattedTime;
        console.log(formattedDateTime);
        date.innerHTML =
          formattedDateTime +
          `<i class="bi bi-arrow-right-square-fill ms-5" style="color: #1c82d4;" onclick="openReceipt(${item.id})"></i>`;
        let hr = document.createElement("hr");
        allcarts.appendChild(date);
        allcarts.appendChild(hr);
      });
    });
};

const openReceipt = async (id) => {
  let table = document.getElementById("receiptTable");
  table.innerHTML = ` <tr><th>Name</th><th>Qty</th><th>Price</th><th>Total</th></tr>`;
  let cart = await fetch(
    `https://localhost:44325/api/Cart/GetById?id=${id}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
  document.getElementById("recieptName").innerHTML =
    sessionStorage.getItem("clientName");
  const timestampObj = new Date(cart[0].date);
  const formattedTimestamp = timestampObj.toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  document.getElementById("recieptDate").innerHTML = formattedTimestamp;
  document.getElementById(
    "recieptTotal"
  ).innerHTML = `Total: $${cart[0].total}`;
  document.getElementById("pdf-content1").classList.remove("d-none");
  document.getElementById("recietNb").innerHTML = `Receipt#: ${id}`;

  let cartItems = await fetch(
    `https://localhost:44325/api/CartDetials/GetByCartId?id=${id}`
  ).then((response) => {
    if (!response.ok) {
      return;
    }
    return response.json();
  });
  cartItems.map(async (item) => {
    let itemDetails = await fetch(
      `https://localhost:44325/api/Items/GetItemById/${item.itemId}`
    ).then((response) => {
      if (!response.ok) {
        return;
      }
      return response.json();
    });
    let tr = document.createElement("tr");
    let nameTd = document.createElement("td");
    let qtyTd = document.createElement("td");
    let priceTd = document.createElement("td");
    let totalTd = document.createElement("td");
    nameTd.innerHTML = itemDetails[0].name;
    qtyTd.innerHTML = item.qty;
    priceTd.innerHTML = item.unitPrice;
    totalTd.innerHTML = parseFloat(item.unitPrice) * parseFloat(item.qty);
    tr.appendChild(nameTd);
    tr.appendChild(qtyTd);
    tr.appendChild(priceTd);
    tr.appendChild(totalTd);
    table.appendChild(tr);
  });
};

const exitReceipt = () => {
  document.getElementById("pdf-content1").classList.add("d-none");
};

const printReciept = async () => {
  let content = document.getElementById("realContent").innerHTML;
  var pattern =
    /<div class="d-flex justify-content-end"><button[\s\S]*?<\/div>/;
  let modifiedHtmlString = content.replace(pattern, "");
  console.log(modifiedHtmlString);
  let name = sessionStorage.getItem("clientName");
  let opt = {
    margin: 1,
    filename: `${name}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: "mm",
      format: [80, 297],
      orientation: "portrait",
    },
  };
  await html2pdf().set(opt).from(content).save();
};
