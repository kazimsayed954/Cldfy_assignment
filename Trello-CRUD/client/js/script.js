document
.getElementById("trello-form")
.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data
  const formData = new FormData(event.target);
  const name = formData.get("name");
  const description = formData.get("description");
  const dueDate = formData.get("due");
  const startDate = formData.get("start");

  // Validate start date is before due date
  if (new Date(startDate) >= new Date(dueDate)) {
    alert("Start date must be before due date");
    return;
  }

  // Construct API URL
  const apiUrl = `http://localhost:4000/add`;

  // Make API call
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      desc: description,
      name,
      due: dueDate,
      start: startDate,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Trello card created successfully!");
      // Reset form fields
      event.target.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to create Trello card. Please try again later.");
    });
});