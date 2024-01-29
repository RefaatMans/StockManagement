// this is to fill the pos categories
const fillPosCategories = async () => {
  let categories = document.getElementById("categories");
  await fetch(`https://localhost:44325/api/Category`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((category) => {
        var a = document.createElement("a");
        a.innerHTML = category.name;
        a.onclick = function () {
          handleCategoryClick(category.id);
        };
        categories.appendChild(a);
      });
    });
  let cartItemsString = sessionStorage.getItem("cartItems");
  let cartItemsArray = cartItemsString ? cartItemsString.split(",") : [];
  let cartArray = [...cartItemsArray];
  cartArray.splice(0, 1);
  document.getElementById("cartCount").innerHTML = cartArray.length;
};
// This is to fill items when a specific category is clicked
const handleCategoryClick = (id) => {
  let div = document.getElementById("itemsDiv");
  fetch(`https://localhost:44325/api/Items/GetItemsByCategory/${id}`)
    .then((response) => {
      if (!response.ok) {
        div.innerHTML = "";
      }
      if (response.status == 400 || response.status == 404)
        return response.text();
      return response.json();
    })
    .then((items) => {
      div.innerHTML = "";
      if (!Array.isArray(items)) {
        div.innerHTML = `No Items in this category`;
        div.style.color = "white";
        return;
      }
      items.map((item) => {
        console.log(item);
        if (!item.isActive) {
          return;
        }
        const card = document.createElement("div");
        card.classList.add("posCard");
        let price = item.sellingPrice;
        if (item.currencyId == parseInt(sessionStorage.getItem("currency"))) {
          price = price;
        } else {
          console.log(parseFloat(sessionStorage.getItem("rate")));
          price = price * parseFloat(sessionStorage.getItem("rate"));
        }
        card.innerHTML = `
          <a onclick="addToCart(${item.id})" class="posCardsA">
          <img src="./assets/img/mtc.png" alt="Product Image" />
          <div class="card-content">
          <h2>${item.name}</h2>
          <p>Price: <span>$${price}</span></p>
          </div>
          </a>
          `;
        div.appendChild(card);
      });
    });
};

// this is to add to cart
let cartItems = [];
const addToCart = (id) => {
  cartItems.push(id);
  let count = document.getElementById("cartCount").innerHTML;
  document.getElementById("cartCount").innerHTML = parseInt(count) + 1;
};
// this is to navigate to cart
const goToCart = () => {
  let arr = sessionStorage.getItem("cartItems");
  sessionStorage.setItem("cartItems", [arr, cartItems]);
  window.location = `cart.html`;
};

if (sessionStorage.getItem("currency") != 1) {
  let id = sessionStorage.getItem("currency");
  fetch(`https://localhost:44325/api/ExchangeRate`)
    .then((response) => {
      if (!response.ok) {
      }
      if (response.status == 400 || response.status == 404)
        return response.text();
      return response.json();
    })
    .then((rates) => {
      rates.map((rate) => {
        // if (!rate.rate) {
        //   document.getElementById(
        //     "rate"
        //   ).innerHTML = `Exchange Rate Not Defined for this currency`;
        //   return;
        // }
        // document.getElementById(
        //   "rate"
        // ).innerHTML = `Exchange Rate: ${rate.rate}`;
        // sessionStorage.setItem("currentRate", rate.rate);
      });
    });
}
