const projects = [
  { name: "Resume Builder", category: "web" },
  { name: "Portfolio Website", category: "web" },
  { name: "Contact Management System", category: "fullstack" }
];

const list = document.getElementById("projectList");
const filter = document.getElementById("filter");

function render(category) {
  list.innerHTML = "";
  projects
    .filter(p => category === "all" || p.category === category)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerText = p.name + " (" + p.category + ")";
      list.appendChild(div);
    });
}

filter.addEventListener("change", () => {
  render(filter.value);
});

render("all");
