// Simple search function
document.getElementById("search").addEventListener("keyup", function() {
  let filter = this.value.toLowerCase();
  let list = document.querySelectorAll("#blog-list li");
  list.forEach(li => {
    let text = li.innerText.toLowerCase();
    li.style.display = text.includes(filter) ? "" : "none";
  });
});
