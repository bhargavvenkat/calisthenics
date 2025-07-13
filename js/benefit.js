document.addEventListener("DOMContentLoaded", () => {
  console.log("Calisthenics benefits page loaded.");

  const headerIntroText = document.getElementById("header-intro-text");
  const mainIntroText = document.getElementById("main-intro-text");
  const benefitsListContainer = document.getElementById("benefits-list-container");
  const summaryText = document.getElementById("summary-text");
  const summarySection = document.getElementById("summary");

  const backToTopButton = document.getElementById("back-to-top");
  const sections = document.querySelectorAll('.fade-in');
  const progressBar = document.getElementById("progress-bar");

  // Function to load content from JSON
  async function loadContent() {
    try {
      const response = await fetch("../json/benefit.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Populate header and main intro
      if (headerIntroText) headerIntroText.textContent = data.intro_header || "Explore how calisthenics enhances your body and mind.";
      if (mainIntroText) mainIntroText.textContent = data.intro;

      // Populate benefits list with expandable items
      if (benefitsListContainer && data.benefits) {
        data.benefits.forEach(benefit => {
          const benefitItem = document.createElement("div");
          benefitItem.classList.add("benefit-item");
          benefitItem.setAttribute("data-id", benefit.id);

          const headerDiv = document.createElement("div");
          headerDiv.classList.add("benefit-item-header");
          headerDiv.innerHTML = `<span>${benefit.title}</span><span class="toggle-icon">+</span>`;
          benefitItem.appendChild(headerDiv);

          const descriptionDiv = document.createElement("div");
          descriptionDiv.classList.add("benefit-description");

          let descriptionHtml = `<p>${benefit.long_description}</p>`;
          if (benefit.subPoints && benefit.subPoints.length > 0) {
            descriptionHtml += `<ul>`;
            benefit.subPoints.forEach(subPoint => {
              descriptionHtml += `<li>${subPoint}</li>`;
            });
            descriptionHtml += `</ul>`;
          }
          descriptionDiv.innerHTML = descriptionHtml;
          benefitItem.appendChild(descriptionDiv);

          // Click event to toggle expansion
          headerDiv.addEventListener("click", () => {
            benefitItem.classList.toggle("expanded");
            const icon = headerDiv.querySelector(".toggle-icon");
            icon.textContent = benefitItem.classList.contains("expanded") ? "x" : "+"; // 'x' for close
          });

          benefitsListContainer.appendChild(benefitItem);
        });
      }

      // Populate summary
      if (summaryText) summaryText.textContent = data.summary;

    } catch (error) {
      console.error("Could not load content from JSON:", error);
      // Fallback to default content or show an error message
      if (mainIntroText && mainIntroText.textContent === "") { // Only if still empty
        mainIntroText.textContent = "Calisthenics offers a wide range of benefits for physical health and overall well-being. These benefits span from improving physical capabilities and body composition to enhancing mental well-being and reducing injury risk.";
      }
      if (summaryText && summaryText.textContent === "") { // Only if still empty
        summaryText.textContent = "Calisthenics is a comprehensive exercise method that builds strength, improves fitness, enhances psychomotor skills, supports fat loss, and boosts mental health—all with minimal equipment and reduced injury risk.";
      }
    }
  }

  loadContent();

  // Unified Scroll Event Listener
  window.addEventListener("scroll", () => {
    // Back to Top button logic
    if (window.scrollY > 300) {
      backToTopButton.style.display = "flex"; // Use flex to keep icon centered
    } else {
      backToTopButton.style.display = "none";
    }

    // Summary section highlight on scroll
    if (summarySection) {
      const rect = summarySection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      // Highlight when summary section is at least 30% visible in the viewport
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        summarySection.classList.add("highlighted");
      } else {
        summarySection.classList.remove("highlighted");
      }
    }

    // Scroll Progress Bar logic
    if (progressBar) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }
  });

  // Back to Top button click handler
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Intersection Observer for scroll-triggered section animations
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the item is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  };

  const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
});