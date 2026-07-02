/**
 * Our Date — Story Engine
 * Chapter 1: Cinematic Introduction
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Config
     -------------------------------------------------------------------------- */
  const INTRO_STEP_DELAY = 1000;
  const SCENE_FADE_DURATION = 1200;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     DOM References
     -------------------------------------------------------------------------- */
  const sceneIntro = document.getElementById('scene-intro');
  const sceneChapter2 = document.getElementById('scene-chapter2');
  const beginBtn = document.getElementById('beginBtn');
  const petalsContainer = document.getElementById('petals');
  const particlesContainer = document.getElementById('particles');
  const parallaxLayers = document.querySelectorAll('.parallax-bg__layer');

  const introSteps = {
    heading: document.querySelector('[data-step="heading"]'),
    subheading: document.querySelector('[data-step="subheading"]'),
    title: document.querySelector('[data-step="title"]'),
    button: document.querySelector('[data-step="button"]'),
  };

  /* --------------------------------------------------------------------------
     Utilities
     -------------------------------------------------------------------------- */
  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function revealStep(element, extraClass) {
    if (!element) return;
    element.classList.add('intro-step--visible');
    if (extraClass) {
      element.classList.add(extraClass);
    }
  }

  /* --------------------------------------------------------------------------
     Rose Petals
     -------------------------------------------------------------------------- */
  function createPetals() {
    if (!petalsContainer || prefersReducedMotion) return;

    var count = window.innerWidth < 480 ? 14 : 22;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = 8 + Math.random() * 10 + 's';
      petal.style.animationDelay = Math.random() * 12 + 's';
      petal.style.setProperty('--petal-size', 10 + Math.random() * 14 + 'px');
      petal.style.setProperty('--petal-drift', -40 + Math.random() * 80 + 'px');
      petal.style.setProperty('--petal-rotate', Math.random() * 360 + 'deg');
      petal.style.opacity = 0.25 + Math.random() * 0.45;
      fragment.appendChild(petal);
    }

    petalsContainer.appendChild(fragment);
  }

  /* --------------------------------------------------------------------------
     Ambient Particles
     -------------------------------------------------------------------------- */
  function createParticles() {
    if (!particlesContainer || prefersReducedMotion) return;

    var count = window.innerWidth < 480 ? 20 : 36;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDuration = 4 + Math.random() * 6 + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.setProperty('--particle-size', 2 + Math.random() * 3 + 'px');
      particle.style.opacity = 0.15 + Math.random() * 0.5;
      fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
  }

  /* --------------------------------------------------------------------------
     Parallax
     -------------------------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion || !parallaxLayers.length) return;

    var pointer = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var autoOffset = 0;

    function onPointerMove(event) {
      var x = event.clientX / window.innerWidth - 0.5;
      var y = event.clientY / window.innerHeight - 0.5;
      pointer.x = x;
      pointer.y = y;
    }

    function tick() {
      autoOffset += 0.002;

      current.x += (pointer.x - current.x) * 0.04;
      current.y += (pointer.y - current.y) * 0.04;

      var driftX = Math.sin(autoOffset) * 0.015;
      var driftY = Math.cos(autoOffset * 0.7) * 0.012;

      parallaxLayers.forEach(function (layer) {
        var depth = parseFloat(layer.dataset.depth) || 0.05;
        var moveX = (current.x + driftX) * depth * 120;
        var moveY = (current.y + driftY) * depth * 120;
        layer.style.transform = 'translate3d(' + moveX + 'px, ' + moveY + 'px, 0)';
      });

      requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------------------------------------
     Intro Sequence
     -------------------------------------------------------------------------- */
  async function runIntroSequence() {
    if (prefersReducedMotion) {
      revealStep(introSteps.heading);
      revealStep(introSteps.subheading);
      revealStep(introSteps.title, 'hero-title--reveal');
      revealStep(introSteps.button, 'intro-step--glow');
      return;
    }

    await wait(INTRO_STEP_DELAY);
    revealStep(introSteps.heading);

    await wait(INTRO_STEP_DELAY);
    revealStep(introSteps.subheading);

    await wait(INTRO_STEP_DELAY);
    revealStep(introSteps.title, 'hero-title--reveal');

    await wait(INTRO_STEP_DELAY);
    revealStep(introSteps.button, 'intro-step--glow');
  }

  /* --------------------------------------------------------------------------
     Scene Transition
     -------------------------------------------------------------------------- */
  function transitionToChapter2() {
    if (!sceneIntro || !sceneChapter2) return;

    beginBtn.disabled = true;
    sceneIntro.classList.add('scene--exit');

    setTimeout(function () {
      sceneIntro.classList.remove('scene--active');
      sceneIntro.classList.add('scene--hidden');
      sceneIntro.setAttribute('aria-hidden', 'true');

      sceneChapter2.classList.remove('scene--hidden');
      sceneChapter2.classList.add('scene--active', 'scene--enter');
      sceneChapter2.removeAttribute('aria-hidden');

      setTimeout(function () {
        sceneChapter2.classList.remove('scene--enter');
      }, SCENE_FADE_DURATION);
    }, SCENE_FADE_DURATION);
  }

  /* --------------------------------------------------------------------------
     Init
     -------------------------------------------------------------------------- */
  function init() {
    createPetals();
    createParticles();
    initParallax();
    runIntroSequence();

    if (beginBtn) {
      beginBtn.addEventListener('click', transitionToChapter2);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
