document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");

  // Fetch existing wishes
  fetch("/api/wishes")
    .then(res => res.json())
    .then(data => {
      wishList.innerHTML = "";
      data.forEach(w => {
        const li = document.createElement("li");

        // Create span for sender name
        const sender = document.createElement("span");
        sender.textContent = `${w.name}: `;
        sender.classList.add("sender-name"); // Add CSS class

        // Create span for message
        const message = document.createElement("span");
        message.textContent = w.message;
        message.classList.add("wish-message"); // Add CSS class

        li.appendChild(sender);
        li.appendChild(message);
        wishList.appendChild(li);
      });
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const messageText = document.getElementById("message").value;

    fetch("/api/wish", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, message: messageText })
    })
      .then(res => res.json())
      .then(data => {
        const li = document.createElement("li");

        const sender = document.createElement("span");
        sender.textContent = `${data.name}: `;
        sender.classList.add("sender-name");

        const message = document.createElement("span");
        message.textContent = data.message;
        message.classList.add("wish-message");

        li.appendChild(sender);
        li.appendChild(message);
        wishList.appendChild(li);

        form.reset();
      });
  });
});
  const video = document.getElementById("myVideo");
  const button = document.getElementById("playButton");

  button.addEventListener("click", () => {
    video.style.display = "block"; // show the video
    video.play(); // play the video
  });