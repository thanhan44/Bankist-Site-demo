"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnScollTo = $(".btn-scoll-to");
const allLinks = $$("a:link");

const modal = $(".modal");
const overlay = $(".overlay");
const btnCloseModal = $(".btn--close-modal");
const btnsOpenModal = $$(".btn--show-modal");
const sectionFeature = $("#features");

const tabs = $$(".operations__tab");
const tabsContainer = $(".operations__content-button");
const tabsContent = $$(".operations__content-decription");

const nav = $(".header__nav");

//////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////////////////
// Smooth scrolling animations
allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // const href = link.getAttribute("href");
    // if (href === "#") {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //   });
    // }

    // if (href !== "#" && href.startsWith("#")) {
    //   const sectionElement = document.querySelector(href);
    //   sectionElement.scrollIntoView({ behavior: "smooth" });
    // }

    if (e.target.classList.contains("header__nav-link")) {
      const idSections = e.target.getAttribute("href");
      document.querySelector(idSections).scrollIntoView({ behavior: "smooth" });
    }
  });
});

///////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);
  // Guard class
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((tab) => {
    if (tab.classList.contains("operations__tab--active")) {
      tab.classList.remove("operations__tab--active");
    }
  });

  tabsContent.forEach((tC) => tC.classList.remove("operations--active"));

  // Active tab
  clicked.classList.add("operations__tab--active");

  // console.log(clicked.dataset.tab);
  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations--active");
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("header__nav-link")) {
    const link = e.target;
    const siblings = link
      .closest(".header__nav")
      .querySelectorAll(".header__nav-link");
    const logo = link
      .closest(".header__nav")
      .querySelector(".header__logo-img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

// const initialCoords = sectionFeature.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY >= initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// const obsCallback = function (entries, observer) {};

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new InteractionObserver(obsCallback, obsOptions);
// observer.observer(sectionFeature);
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal section
const allSections = document.querySelectorAll(".js-section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = $$("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src wwith data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "-300px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
// Slider

const slides = $$(".silde__content");
const btnLeft = $(".slider__btn--left");
const btnRight = $(".slider__btn--right");
const dotContainer = $(".slide__dots-list");

let curSilde = 0;
const maxSilde = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="silde__dot-item" data-silde='${i}'></button>`
    );
  });
};
createDots();

const activeDot = function (silde) {
  $$(".silde__dot-item").forEach((dot) =>
    dot.classList.remove("silde__dot-item--active")
  );
  $(`.silde__dot-item[data-silde='${silde}']`).classList.add(
    "silde__dot-item--active"
  );
};
activeDot(0);

const goToSlide = function (silde) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - silde)}%)`;
  });
};
goToSlide(0);

// Next silde
const nextSilde = function () {
  if (curSilde === maxSilde - 1) {
    curSilde = 0;
  } else {
    curSilde++;
  }
  goToSlide(curSilde);
  activeDot(curSilde);
};

const prevSilde = function () {
  if (curSilde === 0) {
    curSilde = maxSilde - 1;
  } else {
    curSilde--;
  }
  goToSlide(curSilde);
  activeDot(curSilde);
};

btnRight.addEventListener("click", nextSilde);
btnLeft.addEventListener("click", prevSilde);

// Event handlers
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSilde();
  e.key === "ArrowRight" && nextSilde();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("silde__dot-item")) {
    const { silde } = e.target.dataset;
    goToSlide(silde);
    activeDot(silde);
  }
});
