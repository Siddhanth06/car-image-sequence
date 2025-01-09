document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Observer);

  CustomEase.create("hop", "M0,0 C0.355,0.022 0.488,0.079 0.5,0.5 0.542,0.846 0.615,1,1,1");

  CustomEase.create("hop2", "M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1,1,1");

  const splitH2 = new SplitType(".site-info h2", {
    types: "lines",
  });

  splitH2.lines.forEach((line) => {
    const text = line.textContent;
    const wrapper = document.createElement("div");
    wrapper.className = "line";
    const span = document.createElement("span");
    span.textContent = text;
    wrapper.appendChild(span);
    line.parentNode.replaceChild(wrapper, line);
  });

  const mainTl = gsap.timeline();
  const revealerTl = gsap.timeline();
  const scaleTl = gsap.timeline();

  revealerTl
    .to(".r-1", {
      clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%)",
      duration: 1.5,
      ease: "hop",
    })
    .to(
      ".r-2",
      {
        clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)",
        duration: 1.5,
        ease: "hop",
      },
      "<"
    );

  scaleTl.to(".img:first-child", {
    scale: 1,
    duration: 2,
    ease: "power.inOut",
  });

  const images = document.querySelectorAll(".img:not(:first-child)");

  images.forEach((img, index) => {
    scaleTl.to(
      img,
      {
        opacity: 1,
        scale: 1,
        duration: 1.25,
        ease: "power3.out",
      },
      ">-0.7"
    );
  });

  mainTl
    .add(revealerTl)
    .add(scaleTl, "-=1.25")
    .add(() => {
      document.querySelectorAll(".img:not(.main)").forEach((img) => img.remove());
      const state = Flip.getState(".main");
      const imagesContainer = document.querySelector(".images");
      imagesContainer.classList.add("stacked-container");

      document.querySelectorAll(".main").forEach((img, i) => {
        img.classList.add("stacked");
        img.style.order = i;
        gsap.set(".img.stacked", {
          clearProps: "transform,top,left",
        });
      });

      return Flip.from(state, {
        duration: 2,
        ease: "hop",
        absolute: true,
        stagger: {
          amount: -0.3,
        },
      });
    })
    .to(".word h1,.nav-item p,.line p,.site-info h2 .line span", {
      y: 0,
      duration: 3,
      ease: "hop2",
      stagger: 0.1,
      delay: 1.25,
    })
    .to(".cover-img", {
      clipPath: "polygon(0% 100%,100% 100%,100% 0%,0% 0%)",
      duration: 2,
      ease: "hop",
      delay: -2,
    })
    .eventCallback("onStart", () => {
      // Disable scrolling when the timeline starts
      document.body.style.overflow = "hidden";
    })
    .eventCallback("onComplete", () => {
      // Enable scrolling when the timeline completes
      document.body.style.overflow = "";
    });

  // document.querySelectorAll(".section").forEach((sectionElement, index) => {
  //   if (index === sections.length - 1) {
  //     return; // Skip the last section
  //   }
  //   const containerElement = sectionElement.querySelector(".container");
  //   const nextSectionElement = sectionElement.parentNode.querySelector(
  //     `section:nth-child(${index + 2})`
  //   );

  //   gsap
  //     .timeline({
  //       scrollTrigger: {
  //         trigger: sectionElement,
  //         start: `center (nextSectionElement.offsetTop - (window.innerHeight * 0.5))`,
  //         end: `bottom 20%`,
  //         scrub: 1,
  //         pin: true,
  //         pinSpacing: false,
  //         markers: true,
  //       },
  //     })
  //     .to(containerElement, {
  //       opacity: 0,
  //       scale: 0.8,
  //       yPercent: 30,
  //       duration: 3,
  //       ease: "power1.out",
  //     });
  // });

  //Move page to top on refresh

  document.querySelectorAll(".section").forEach((sectionElement, index, sections) => {
    // Check if it's the last section
    if (index === sections.length - 1) {
      return; // Skip the last section
    }

    const containerElement = sectionElement.querySelector(".container");
    const nextSectionElement = sectionElement.parentNode.querySelector(
      `section:nth-child(${index + 2})`
    );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: sectionElement,
          start: `center (nextSectionElement.offsetTop - (window.innerHeight * 0.5))`,
          end: `bottom 20%`,
          scrub: 1,
          pin: true,
          pinSpacing: false,
          markers: true,
        },
      })
      .to(containerElement, {
        opacity: 0,
        scale: 0.8,
        yPercent: 30,
        duration: 3,
        ease: "power1.out",
      });
  });

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  //Lenis scroll
  // Initialize Lenis
  const lenis = new Lenis({
    duration: 2, // Set the smooth scrolling duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default linear easing function
    smooth: true, // Enable smooth scrolling
    direction: "vertical", // Scroll direction ('vertical' or 'horizontal')
  });

  // Update Lenis on every animation frame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Sync Lenis with GSAP ScrollTrigger
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  //Greensock horizontal scroll
  gsap.to(
    ".scroll-section",
    {
      position: "fixed",
      top: 0,
      // visibility: "hidden",
      scrollTrigger: {
        trigger: ".first",
        start: "top top",
        bottom: "bottom bottom",
        scrub: true,
        markers: true,
      },
    },
    "abc"
  );

  gsap.to(".bg", { top: 0 }, "abc");

  gsap.registerPlugin(Observer);

  let sections = document.querySelectorAll(".scroll-section"),
    images2 = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  function gotoSection(index, direction) {
    index = wrap(index); // make sure it's valid
    animating = true;
    let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => (animating = false),
      });
    if (currentIndex >= 0) {
      // The first time this function runs, current is -1
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images2[currentIndex], { yPercent: -15 * dFactor }).set(sections[currentIndex], {
        autoAlpha: 0,
      });
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      {
        yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
      },
      {
        yPercent: 0,
      },
      0
    ).fromTo(images2[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

    currentIndex = index;
  }

  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true,
  });

  gotoSection(0, 1);

  // original: https://codepen.io/BrianCross/pen/PoWapLP
  // horizontal version: https://codepen.io/GreenSock/pen/xxWdeMK
});
