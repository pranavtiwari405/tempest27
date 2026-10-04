window.addEventListener("load", () => {
  setTimeout(() => document.body.classList.add("loaded"), 650);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [{opacity:0, transform:"translateY(24px)"}, {opacity:1, transform:"translateY(0)"}],
        {duration:900, easing:"cubic-bezier(.2,.7,.2,1)", fill:"forwards"}
      );
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.14});

document.querySelectorAll(".section > *, .final-content").forEach(el => {
  el.style.opacity = "0";
  observer.observe(el);
});
