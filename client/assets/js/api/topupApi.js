const createCalendar = async (year, month) => {
  let availableDays = [];
  let total = 0;
  await fetch("https://localhost:44325/api/ScheduledAmount/getAllDates")
    .then((response) => {
      if (!response.ok) {
      }
      if (response.status == 400 || 404) return response.json();
      return response.json();
    })
    .then((data) => {
      data.map((date) => {
        total = total + date.amount;
        const dateObject = new Date(date.date);
        const day = dateObject.getDate();
        availableDays.push({ day: day, amount: date.amount });
      });
    });
  const table = document.getElementById("calendar");
  const headerRow = table.insertRow();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  let dayCount = 1;

  for (let i = 1; i < 9; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 4; j++) {
      if (i === 0 && j < firstDay) {
        const cell = row.insertCell();
      } else if (dayCount > daysInMonth) {
        const cell = row.insertCell();
        if (i === 8 && j === 3) {
          // Check if it's the last cell of the last row
          let label = document.createElement("label");
          label.style.color = "rgb(255, 0, 0)";
          label.innerHTML = "Total: <br />" + total + " LBP";
          cell.appendChild(label);
        }
      } else {
        const cell = row.insertCell();
        cell.style.color = "white";
        cell.style.position = "relative";
        cell.textContent = dayCount;

        if (dayCount === currentDay) {
          cell.classList.add("current-day");
          let input = document.createElement("input");
          input.type = "number";
          input.id = "todayAmount";
          await fetch("https://localhost:44325/api/ScheduledAmount/getByDate")
            .then((response) => {
              if (!response.ok) {
              }
              if (response.status == 400 || response.status == 404)
                return response.text();
              return response.json();
            })
            .then((date) => {
              input.value = parseFloat(date[0].amount);
            });
          input.style.backgroundColor = "transparent";
          cell.appendChild(input);
        }

        // Check if the day is in availableDays
        if (availableDays.some((dayObj) => dayObj.day === dayCount)) {
          let label = document.createElement("input");
          const matchingDay = availableDays.find(
            (dayObj) => dayObj.day === dayCount
          );
          if (matchingDay) {
            label.value = matchingDay.amount + " LBP";
            label.disabled = true;
            label.classList.add("amount");

            if (matchingDay.day === currentDay) {
              label.classList.add("d-none");
            }
            cell.appendChild(label);
          }
        }

        dayCount++;
      }
    }
  }
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

createCalendar(currentYear, currentMonth);

const saveAmount = async () => {
  let amount = document.getElementById("todayAmount").value;

  await fetch("https://localhost:44325/api/ScheduledAmount/getByDate")
    .then((response) => {
      if (!response.ok) {
      }
      if (response.status == 400 || response.status == 404)
        return response.text();
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        updateAmount(amount);
      } else {
        saveNewAmount(amount);
      }
    });
  location.reload();
};

const updateAmount = async (amount) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  let itemData = { date: formattedDate, amount: amount };
  await fetch("https://localhost:44325/api/ScheduledAmount/UpdateItemByDate", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        return;
      }
      return response.text();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("Error adding amount:", error);
    });
};

const saveNewAmount = async (amount) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  let itemData = { date: formattedDate, amount: amount };
  await fetch("https://localhost:44325/api/ScheduledAmount/AddAmount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })
    .then((response) => {
      if (!response.ok) {
        return;
      }
      return response.text();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("Error adding amount:", error);
    });
};

const saveSimAmount = (id) => {
  if (id == 1) {
    let touch = document.getElementById("touch").value;
    localStorage.setItem("touch", touch);
  }
  if (id == 2) {
    let touch = document.getElementById("alfa").value;
    localStorage.setItem("alfa", touch);
  }
};

const fillSimCards = () => {
  if (localStorage.getItem("touch")) {
    document.getElementById("touch").value = localStorage.getItem("touch");
  }
  if (localStorage.getItem("alfa")) {
    document.getElementById("alfa").value = localStorage.getItem("alfa");
  }
};
