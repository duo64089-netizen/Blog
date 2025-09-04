// Simple search filter
document.getElementById("search").addEventListener("keyup", function() {
  let filter = this.value.toLowerCase();
  let blogs = document.querySelectorAll(".blog-card");
  blogs.forEach(blog => {
    let text = blog.innerText.toLowerCase();
    blog.style.display = text.includes(filter) ? "block" : "none";
  });
});
