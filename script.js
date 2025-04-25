
document.addEventListener("click", () => {
    const audio = document.getElementById("memory-music");
    if (audio.paused) {
      audio.play().catch(() => {});
    }
  });
  
  // Text animation
  const lines = [
    "Hey Nene,",
    "Life has a funny way of making time fly",
    "when we're around people we cherish.",
    "Your laughter, your energy, and your heart",
    "made this place feel like home.",
    "Before you go, we wanted to pause",
    "and remind you how deeply you'll be missed.",
  ];
  
  const animatedText = document.getElementById("animated-text");
  const firstArrow = document.getElementById("first-arrow");
  
  function launchConfetti() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 80 * (timeLeft / duration);
      launchConfetti();
    }, 250);
  }
  
  function animateLine(line, index) {
    const lineContainer = document.createElement("div");
    lineContainer.style.display = "block";
    animatedText.appendChild(lineContainer);
  
    line.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = char === " " ? "\u00A0" : char;
      lineContainer.appendChild(span);
    });
  
    anime({
      targets: lineContainer.querySelectorAll(".letter"),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: (el, i) => i * 40,
      easing: "easeOutExpo",
      complete: () => {
        if (index < lines.length - 1) {
          setTimeout(() => animateLine(lines[index + 1], index + 1), 500);
        } else {
          setTimeout(() => {
            anime({
              targets: firstArrow,
              opacity: [0, 1],
              duration: 800,
              easing: "easeOutExpo",
            });
  
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.5 },
            });
          }, 600);
        }
      },
    });
  }
  
  animateLine(lines[0], 0);
  
  // Gallery logic
  const photoGallery = {
    init() {
      this.images = document.querySelectorAll(".gallery-img");
      this.galleryArrow = document.getElementById("gallery-arrow");
      this.currentIndex = 0;
      this.imagesShown = 0;
      this.totalImages = this.images.length;
      this.interval = null;
  
      const gallerySection = document.getElementById("photo-memory");
      const memoryMusic = document.getElementById("memory-music");
  
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.startSlideshow();
  
              memoryMusic.play().catch((e) => {
                console.warn("Autoplay blocked. Waiting for user interaction.", e);
              });
  
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
  
      observer.observe(gallerySection);
  
      document.querySelectorAll(".scroll-down-arrow").forEach((arrow) => {
        arrow.addEventListener("click", () => {
          const currentSection =
            arrow.closest(".section") || arrow.closest(".gallery-wrapper");
          const nextSection = currentSection.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    },
  
    startSlideshow() {
      this.showImage(this.currentIndex);
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages;
        this.showImage(this.currentIndex);
      }, 3000);
    },
  
    showImage(index) {
      this.images.forEach((img) => (img.style.opacity = 0));
      this.images[index].style.opacity = 1;
      this.imagesShown++;
  
      if (this.imagesShown >= this.totalImages && !this.arrowShown) {
        clearInterval(this.interval);
        setTimeout(() => {
          anime({
            targets: this.galleryArrow,
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutExpo",
          });
          this.arrowShown = true;
        }, 3000);
      }
    },
  };
  
  photoGallery.init();
  
  // Sakura animation
  function createSakuraPetal() {
    const petal = document.createElement("div");
    const types = ["petal-type1", "petal-type2", "petal-type3"];
    petal.className = `petal ${types[Math.floor(Math.random() * types.length)]}`;
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.opacity = (0.5 + Math.random() * 0.5).toString();
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
  
    document.querySelector(".sakura").appendChild(petal);
  
    const animationProps = {
      targets: petal,
      translateY: window.innerHeight + 100,
      translateX: () => anime.random(-100, 100),
      rotate: () => anime.random(0, 360),
      duration: () => anime.random(8000, 15000),
      delay: () => anime.random(0, 5000),
      easing: "linear",
      complete: () => {
        petal.remove();
        if (sakuraActive) createSakuraPetal();
      },
    };
  
    anime({
      ...animationProps,
      translateX: [0, () => anime.random(-50, 50)],
      duration: 1000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
  
    anime(animationProps);
  }
  
  const sakuraSection = document.querySelector(".sakura");
  let sakuraActive = false;
  
  const sakuraObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !sakuraActive) {
          sakuraActive = true;
          for (let i = 0; i < 50; i++) {
            setTimeout(createSakuraPetal, i * 300);
          }
        } else {
          sakuraActive = false;
        }
      });
    },
    { threshold: 0.1 }
  );
  
  sakuraObserver.observe(sakuraSection);
  
  // Farewell fade-in
  const farewellMessage = document.getElementById("farewell-message");
  
  const farewellObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: farewellMessage,
            opacity: [0, 1],
            duration: 2000,
            easing: "easeOutQuad",
          });
          farewellObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  
  farewellObserver.observe(farewellMessage);
  