document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    const updateBackToTop = () => {
      const isVisible = window.scrollY > 480;
      backToTop.hidden = !isVisible;
      backToTop.classList.toggle("is-visible", isVisible);
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  const projectSection = document.querySelector("#projects");
  const projectGrid = projectSection?.querySelector(":scope > .container > .row");
  const projectColumns = projectGrid ? [...projectGrid.children] : [];

  if (projectGrid && projectColumns.length > 1) {
    const technologies = [...new Set(
      projectColumns.flatMap((column) =>
        [...column.querySelectorAll(".badge")]
          .map((badge) => badge.textContent.trim())
          .filter(Boolean)
      )
    )].sort((first, second) => first.localeCompare(second));

    if (technologies.length > 1) {
      const filter = document.createElement("div");
      filter.className = "project-filter";

      const label = document.createElement("label");
      label.htmlFor = "project-technology-filter";
      label.textContent = "Filtrer par technologie";

      const select = document.createElement("select");
      select.id = "project-technology-filter";
      select.setAttribute("aria-label", label.textContent);

      const allOption = document.createElement("option");
      allOption.value = "";
      allOption.textContent = "Toutes les technologies";
      select.append(allOption);

      technologies.forEach((technology) => {
        const option = document.createElement("option");
        option.value = technology;
        option.textContent = technology;
        select.append(option);
      });

      filter.append(label, select);
      projectGrid.before(filter);

      select.addEventListener("change", () => {
        projectColumns.forEach((column) => {
          const badges = [...column.querySelectorAll(".badge")];
          const matches = !select.value || badges.some(
            (badge) => badge.textContent.trim() === select.value
          );
          column.hidden = !matches;
        });
      });
    }
  }

  const sections = [...document.querySelectorAll("#content > section[id]")];
  const sectionLinks = [...document.querySelectorAll('#navbarContent a[href*="#"]')]
    .map((link) => ({ link, sectionId: new URL(link.href).hash.slice(1) }))
    .filter(({ sectionId }) => sections.some((section) => section.id === sectionId));

  if ("IntersectionObserver" in window) {
    const revealTargets = [
      ...document.querySelectorAll("#content > section:not(#hero)"),
      ...document.querySelectorAll("#projects .card, #education .card, #achievements .card")
    ];

    if (!reduceMotion) {
      revealTargets.forEach((element) => element.classList.add("reveal-on-scroll"));
      document.body.classList.add("has-scroll-reveal");

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      revealTargets.forEach((element) => revealObserver.observe(element));
    }

    if (sectionLinks.length) {
      const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach(({ link, sectionId }) => {
            if (sectionId === entry.target.id) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      }, { rootMargin: "-20% 0px -65% 0px" });

      sections.forEach((section) => activeObserver.observe(section));
    }
  } else {
    document.querySelectorAll("#content > section, #content .card")
      .forEach((element) => element.classList.add("is-visible"));
  }
});
