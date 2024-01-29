const menu = () => {
  document.getElementById(
    "header"
  ).innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark d-flex">
  <div class="container-fluid me-5 ms-5">
    <a href="home.html"><img src="./assets/img/logo.png" alt="" /> Home</a>
    <!-- <a href="home.html" class="nav-item nav-link active">Home</a> -->
    <button
      type="button"
      class="navbar-toggler"
      data-bs-toggle="collapse"
      data-bs-target="#navbarCollapse"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <div class="navbar-nav"></div>
      <div class="navbar-nav ms-auto">
        <div class="nav-item dropdown">
          <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown"
            ><i class="bi bi-stack"></i> SetUp</a
          >
          <div class="dropdown-menu">
          <a href="addClient.html" class="dropdown-item">Add Client</a>
            <a href="addCategory.html" class="dropdown-item">Add Category</a>
            <a href="addItem.html" class="dropdown-item">Add Item</a>
            <a href="allItems.html" class="dropdown-item">All Items</a>
            <a href="changePrices.html" class="dropdown-item">Change Price</a>
            </div>
            </div>
            <div class="nav-item dropdown">
            <a href="" class="nav-link dropdown-toggle" data-bs-toggle="dropdown"
            ><i class="bi bi-cash-stack"></i> Inventory</a
            >
            <div class="dropdown-menu">
            <a href="allClients.html" class="dropdown-item">POS</a>
            <a href="searchInvoice.html" class="dropdown-item">Search Invoice</a>
            <a href="report.html" class="dropdown-item">Report</a>
            <a href="topup.html" class="dropdown-item">TopUp History</a>
          </div>
        </div>
        <div class="nav-item dropdown">
          <a href="" class="nav-link dropdown-toggle" data-bs-toggle="dropdown"
            ><i class="bi bi-gear-fill"></i> Settings</a
          >
          <div class="dropdown-menu">
            <a href="profile.html" class="dropdown-item">Profile</a>
            <a href="chooseAppCurrency.html" class="dropdown-item">App Currency</a>
            <a href="addCurrency.html" class="dropdown-item">Currencies</a>
            <a href="addRate.html" class="dropdown-item">Exchange Rate</a>
          </div>
        </div>
        <a onclick="logOut()" class="nav-item nav-link active">
          <i class="bi bi-box-arrow-left"></i> Logout
        </a>
      </div>
    </div>
  </div>
</nav>`;
};
const logOut = () => {
  sessionStorage.removeItem("loggedIn");
  window.location.reload();
};
const details = (id) => {
  const details = document.getElementById("detailsDiv");
  details.classList.remove("d-none");
  if (id == 1) {
    details.innerHTML = `
          <ul>
            <li>
            <a href="addClient.html"><i class="bi bi-caret-right-fill"></i> Add Client</a>
            </li>
            <hr >
            <li>
            <a href="addCategory.html"><i class="bi bi-caret-right-fill"></i> Add Category</a>
            </li>
            <hr >
            <li>
            <a href="addItem.html"><i class="bi bi-caret-right-fill"></i> Add Item</a>
            </li>
            <hr >
            <li>
            <a href="allItems.html"><i class="bi bi-caret-right-fill"></i> All Items</a>
          </li>
          <hr >
          <li>
            <a href="changePrices.html"><i class="bi bi-caret-right-fill"></i> Change Price</a>
          </li>
          
          </ul>
          `;
  }
  if (id == 2) {
    details.innerHTML = `
    <ul>
    <li>
    <a href="allClients.html"><i class="bi bi-caret-right-fill"></i> POS</a>
    </li>
    <hr>
    <li>
    <a href="Installment.html"><i class="bi bi-caret-right-fill"></i> Installement</a>
    </li>
    <hr>
    <li>
      <a href="searchInvoice.html"><i class="bi bi-caret-right-fill"></i> Search Invoices</a>
    </li>
    <hr >
    <li>
      <a href="reports.html"><i class="bi bi-caret-right-fill"></i> Reports</a>
    </li>
    <hr >
    <li>
      <a href="topup.html"><i class="bi bi-caret-right-fill"></i> TopUp History</a>
    </li>
    </ul>
    `;
  }
  if (id == 3) {
    details.innerHTML = `
    <ul>
    <li>
    <a href="Profile.html"><i class="bi bi-caret-right-fill"></i> Profile</a>
  </li>
  <hr>
    <li>
    <a href="chooseAppCurrency.html"><i class="bi bi-caret-right-fill"></i>App Currency</a>
  </li>
  <hr >
  <li>
  <a href="addCurrency.html"><i class="bi bi-caret-right-fill"></i> Currencies</a>
  </li>
  <hr >
  <li>
  <a href="addRate.html"><i class="bi bi-caret-right-fill"></i> Exchange Rate</a>
  </li>
          </ul>
    `;
  }
};
