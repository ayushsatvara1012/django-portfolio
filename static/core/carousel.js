document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('certCarousel');
  if (!container) return;

  const track = container.querySelector('.carousel-track');
  const slides = Array.from(container.querySelectorAll('.carousel-slide'));
  const prevBtn = container.querySelector('.carousel-nav.prev');
  const nextBtn = container.querySelector('.carousel-nav.next');
  const dotsContainer = container.querySelector('.carousel-dots');

  let index = 0;
  let interval = null;
  let isAnimating = false;
  let scrollAnim = null;

  function visibleCount() {
    const w = window.innerWidth;
    if (w >= 1100) return 3;
    if (w >= 520) return 2;
    return 1;
  }

  function gapSize() {
    const gap = parseFloat(getComputedStyle(track).gap);
    return Number.isFinite(gap) ? gap : 24;
  }

  function slideW() {
    // compute width based on container visible count so slides fit exactly
    const v = visibleCount();
    const gap = gapSize();
    const totalGap = gap * (v - 1);
    const available = track.clientWidth - totalGap;
    // Safari has subtleties with sub-pixel rendering; use integer pixels
    return Math.max(0, Math.floor(available / v));
  }

  function maxIndex() {
    return Math.max(0, slides.length - visibleCount());
  }

  function clampIndex(i) {
    const max = maxIndex();
    if (i < 0) return 0;
    if (i > max) return max;
    return i;
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const v = visibleCount();
    console.log('Creating dots - visibleCount:', v, 'slides:', slides.length);
    
    // Create dots for all slides (for mobile view)
    if (v === 1) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => { moveToIndex(i); resetAuto(); });
        dotsContainer.appendChild(dot);
      });
      updateDots();
      dotsContainer.style.display = 'flex';
      console.log('Dots displayed:', dotsContainer.children.length);
    } else {
      dotsContainer.style.display = 'none';
      console.log('Dots hidden - not in single slide mode');
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      dot.classList.toggle('active', i === index);
    });
  }

  // animate scrollLeft to target using requestAnimationFrame (cancellable)
  function animateTo(target, duration = 420) {
    // cancel any running animation
    if (scrollAnim) {
      cancelAnimationFrame(scrollAnim);
      scrollAnim = null;
    }
    const start = track.scrollLeft;
    const change = target - start;
    if (change === 0) return Promise.resolve();
    const startTime = performance.now();

    isAnimating = true;
    return new Promise((resolve) => {
      function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(t);
        track.scrollLeft = Math.round(start + change * eased);
        if (t < 1) {
          scrollAnim = requestAnimationFrame(step);
        } else {
          scrollAnim = null;
          isAnimating = false;
          resolve();
        }
      }
      scrollAnim = requestAnimationFrame(step);
    });
  }

  function moveToIndex(i, smooth = true) {
    // if an animation is in progress, avoid starting another (unless forced)
    if (isAnimating && smooth) return;
    const clamped = clampIndex(i);
    index = clamped;
    const slideWidth = slideW();
    const gap = gapSize();
    const target = Math.round(index * (slideWidth + gap));

    // temporarily disable native smooth scrolling to prevent conflicts
    const prevBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';

    if (smooth) {
      // animate programmatically for consistent timing across browsers
      animateTo(target).then(() => {
        track.style.scrollBehavior = prevBehavior || '';
      });
    } else {
      track.scrollLeft = target;
      track.style.scrollBehavior = prevBehavior || '';
      isAnimating = false;
    }

    updateDots();
  }

  function next() { 
    if (!isAnimating) moveToIndex(index + 1); 
  }
  function prev() { 
    if (!isAnimating) moveToIndex(index - 1); 
  }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  function startAuto() { stopAuto(); interval = setInterval(() => moveToIndex(index + 1), 3500); }
  function stopAuto() { if (interval) { clearInterval(interval); interval = null; } }
  function resetAuto() { stopAuto(); startAuto(); }

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAuto(); }, {passive:true});
  track.addEventListener('touchend', (e) => {
    const dx = (e.changedTouches[0].clientX - startX);
    if (dx > 40) prev();
    else if (dx < -40) next();
    resetAuto();
  }, {passive:true});

  // Mouse drag support for desktop
  let isDown = false;
  let startScroll = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('dragging');
    stopAuto();
    e.preventDefault();
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    const dx = e.clientX - startX;
    if (dx > 40) prev();
    else if (dx < -40) next();
    resetAuto();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    track.scrollLeft = startScroll - dx;
  });

  // Keyboard
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });
  container.setAttribute('tabindex', '0');

  function updateControlsVisibility() {
    const v = visibleCount();
    if (slides.length <= v) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = '';
      nextBtn.style.display = '';
    }
  }

  function onResize() {
    // keep index within range
    index = clampIndex(index);
    // apply integer widths to slides so snapping lands perfectly (helps Safari)
    const v = visibleCount();
    const w = slideW();
    const gap = gapSize();
    if (v === 1) {
      // clear fixed widths so mobile uses 100%
      slides.forEach(s => { s.style.flex = ''; s.style.maxWidth = ''; });
      // clear any fixed heights on mobile
      slides.forEach(s => { s.style.height = ''; });
    } else {
      slides.forEach(s => { s.style.flex = `0 0 ${w}px`; s.style.maxWidth = `${w}px`; });
      // compute tallest slide height and apply to all slides so they appear equal
      // (helps avoid one tall slide pushing layout and ensures consistent card visibility)
      let maxH = 0;
      slides.forEach(s => {
        // reset height temporarily to measure natural height
        s.style.height = '';
      });
      slides.forEach(s => {
        const h = Math.ceil(s.getBoundingClientRect().height);
        if (h > maxH) maxH = h;
      });
      if (maxH > 0) {
        slides.forEach(s => { s.style.height = `${maxH}px`; });
      }
    }
    // reset scroll behavior and snap to exact positions
    moveToIndex(index, false);
    // ensure starting aligned at zero for fresh loads
    if (index === 0) track.scrollLeft = 0;
    updateControlsVisibility();
    createDots();
  }

  window.addEventListener('resize', onResize);

  // Snap to nearest slide when user scrolls manually
  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    if (isAnimating) return;
    
    if (scrollTimeout) clearTimeout(scrollTimeout);
    // while scrolling, stop autoplay
    stopAuto();
    scrollTimeout = setTimeout(() => {
      // compute nearest index based on current scrollLeft
      const gap = gapSize();
      const w = slideW();
      const current = track.scrollLeft;
      const approxIndex = Math.round(current / (w + gap));
      moveToIndex(approxIndex, true);
      resetAuto();
    }, 150);
  }, {passive:true});

  // Initialize
  onResize();
  createDots();
  startAuto();
});
