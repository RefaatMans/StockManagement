const fillCurrencies = async () => {
  await fetch("https://localhost:44325/api/Currency")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const table = document.getElementById("currencyTable");
      data.map((currency) => {
        let tr = document.createElement("tr");
        let idTd = document.createElement("td");
        let currencyTd = document.createElement("td");
        let deleteTd = document.createElement("td");
        idTd.innerHTML = currency.id;
        currencyTd.innerHTML = currency.currencyCode;
        deleteTd.innerHTML = `<i class="bi bi-trash-fill" style="color:red"></i>`;
        deleteTd.onclick = () => {
          deleteCurrency(currency.id);
        };
        tr.appendChild(idTd);
        tr.appendChild(currencyTd);
        tr.appendChild(deleteTd);
        table.appendChild(tr);
      });
    });
};

const addCurrency = (e) => {
  e.preventDefault();
  const currencyName = document.getElementById("currency").value;
  let currencyNameJson = { currencyCode: currencyName };

  fetch("https://localhost:44325/api/Currency", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currencyNameJson),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status == 400) {
          document.getElementById("validation").innerHTML = `Duplicate Item`;
          document.getElementById("validation").classList.remove("d-none");
        }
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.text();
    })
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error adding currency:", error);
    });
};
const deleteCurrency = (id) => {
  fetch(`https://localhost:44325/api/Currency/${id}`, {
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
      console.error("Error deleting currency:", error);
    });
};

const fillCurrencySelect = async () => {
  const select = document.getElementById("currency");
  await fetch("https://localhost:44325/api/Currency")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((currency) => {
        let option = document.createElement("option");
        option.innerHTML = currency.currencyCode;
        option.value = currency.id;
        let hr = document.createElement("hr");
        select.appendChild(option);
        select.appendChild(hr);
      });
    });
};

const addRate = (e) => {
  e.preventDefault();
  let currency = document.getElementById("currency").value;
  let rate = document.getElementById("rate").value;
  let currentDate = new Date();

  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  let formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    currentDate
  );

  console.log(formattedDate);

  let currencyData = {
    rate: rate,
    currencyId: currency,
  };
  if (currency == 1) {
    return;
  }
  fetch("https://localhost:44325/api/ExchangeRate/AddRate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currencyData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      console.log("currency added successfully:", data);
    })
    .catch((error) => {
      console.error("Error adding currency:", error);
    });
};

// fill chooseappCurrency

const fillAppCurrencies = async (e) => {
  let select = document.getElementById("Currency");
  await fetch("https://localhost:44325/api/Currency")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((currency) => {
        let option = document.createElement("option");
        option.innerHTML = currency.currencyCode;
        option.value = currency.id;
        let hr = document.createElement("hr");
        select.appendChild(option);
        select.appendChild(hr);
      });
    });
};
const fillCurrenciesForPrice = async (e) => {
  let select = document.getElementById("Currency");
  await fetch("https://localhost:44325/api/Currency")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.map((currency) => {
        let option = document.createElement("option");
        option.innerHTML = currency.currencyCode;
        option.value = currency.currencyCode;
        let hr = document.createElement("hr");
        select.appendChild(option);
        select.appendChild(hr);
      });
    });
};

const chooseAppCurrency = (e) => {
  e.preventDefault();
  let currency = document.getElementById("Currency").value;
  sessionStorage.setItem("currency", currency);
};
