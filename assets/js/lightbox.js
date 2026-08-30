(() => {
  "use strict";

  const IMAGE_SELECTOR = "img";
  const VIDEO_SELECTOR = "video";

  const isEnabled = (element) => {
    const explicit = element.dataset.lightbox;

    if (explicit === "false") return false;
    if (explicit === "true") return true;

    if (element.closest("a, button, .site-header, .site-footer, nav")) {
      return false;
    }

    if (
      element.tagName === "IMG" &&
      element.src.includes("/assets/icons/")
    ) {
      return false;
    }

    return true;
  };

  const createLightbox = () => {
    const root = document.createElement("div");
    root.className = "lightbox";
    root.id = "site-lightbox";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("aria-label", "Media viewer");

    root.innerHTML = `
      <div class="lightbox__backdrop" data-lightbox-close></div>

      <div class="lightbox__content">
        <button
          class="lightbox__close"
          type="button"
          aria-label="Close media viewer"
          title="Close (Esc)"
          data-lightbox-close
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <img
          class="lightbox__image"
          alt=""
          draggable="false"
          hidden
        >

        <video
          class="lightbox__video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          controlslist="nodownload nofullscreen noremoteplayback"
          disablepictureinpicture
          disableremoteplayback
          hidden
        ></video>

        <p class="lightbox__caption" aria-live="polite"></p>
      </div>
    `;

    document.body.appendChild(root);
    return root;
  };

  let lightbox = null;
  let lightboxImage = null;
  let lightboxVideo = null;
  let caption = null;
  let closeButton = null;
  let previousFocus = null;
  let scrollbarCompensation = 0;

  const stopVideo = () => {
    if (!lightboxVideo) return;

    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  };

  const init = () => {
    lightbox = createLightbox();

    lightboxImage = lightbox.querySelector(".lightbox__image");
    lightboxVideo = lightbox.querySelector(".lightbox__video");
    caption = lightbox.querySelector(".lightbox__caption");
    closeButton = lightbox.querySelector(".lightbox__close");

    document.addEventListener("click", (event) => {
      const media = event.target.closest(
        `${IMAGE_SELECTOR}, ${VIDEO_SELECTOR}`
      );

      if (!media || !document.contains(media) || !isEnabled(media)) {
        return;
      }

      open(media);
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.focus();
      }
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target.closest("[data-lightbox-close]")) {
        close();
      }
    });

    lightboxImage.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Keep the inspected video GIF-like: clicking it must not pause it.
    lightboxVideo.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (lightboxVideo.paused) {
        lightboxVideo.play().catch(() => {});
      }
    });

    // Some browsers may briefly pause media when focus/visibility changes.
    // Resume automatically while the lightbox is open.
    lightboxVideo.addEventListener("pause", () => {
      if (lightbox.classList.contains("is-open")) {
        lightboxVideo.play().catch(() => {});
      }
    });
  };

  const open = (sourceMedia) => {
    previousFocus = document.activeElement;

    const isVideo = sourceMedia.tagName === "VIDEO";
    const alt = isVideo
      ? (
          sourceMedia.dataset.caption ||
          sourceMedia.getAttribute("aria-label") ||
          ""
        ).trim()
      : (sourceMedia.alt || "").trim();

    // Reset both display types.
    lightboxImage.hidden = true;
    lightboxVideo.hidden = true;
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    stopVideo();

    if (isVideo) {
      const source =
        sourceMedia.currentSrc ||
        sourceMedia.querySelector("source")?.src ||
        sourceMedia.src;

      if (!source) return;

      lightboxVideo.src = source;
      lightboxVideo.currentTime = 0;
      lightboxVideo.muted = true;
      lightboxVideo.defaultMuted = true;
      lightboxVideo.autoplay = true;
      lightboxVideo.loop = true;
      lightboxVideo.controls = false;
      lightboxVideo.playsInline = true;
      lightboxVideo.hidden = false;

      // Autoplay is reliable here because the inspected video is muted.
      lightboxVideo.play().catch(() => {});
    } else {
      const source = sourceMedia.currentSrc || sourceMedia.src;

      lightboxImage.src = source;
      lightboxImage.alt = alt;
      lightboxImage.hidden = false;
    }

    caption.textContent = alt;
    caption.hidden = !alt;

    scrollbarCompensation =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarCompensation > 0) {
      document.body.style.paddingRight = `${scrollbarCompensation}px`;
    }

    document.body.classList.add("lightbox-open");

    lightbox.setAttribute("aria-hidden", "false");
    lightbox.classList.add("is-open");

    closeButton.focus();
  };

  const close = () => {
    if (!lightbox.classList.contains("is-open")) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    document.body.style.paddingRight = "";

    window.setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) {
        lightboxImage.removeAttribute("src");
        lightboxImage.alt = "";
        lightboxImage.hidden = true;
        stopVideo();
        lightboxVideo.hidden = true;
        caption.textContent = "";
      }
    }, 220);

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }

    previousFocus = null;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
