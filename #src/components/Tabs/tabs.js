const tabs = document.querySelectorAll(".tabs__btn");
const contents = document.querySelectorAll(".tabs__content");

tabs.forEach((item) => {
  item.addEventListener("click", (event) => {
    tabs.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");
    contents.forEach((item) => {
      if (event.target.dataset.tab == item.dataset.content) {
        contents.forEach((item) => item.classList.remove("active"));
        item.classList.add("active");
      }
    });
  });
});
