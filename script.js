/**
 * Our Date — Story Engine
 * Chapters 1–3 orchestration
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Config
     -------------------------------------------------------------------------- */
  var INTRO_STEP_DELAY = 1000;
  var SCENE_FADE_DURATION = 1200;

 const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxBIlvR-OlBw8cbIHz-4VitgzFra287wp8Bf3gsRFCRsu-aX7723yytPNPdQsESwKAp/exec";

  var CHAT_MESSAGES = [
    { text: 'Hey Jaan ❤️', delayAfter: 1500 },
    { text: "I've been thinking about us...", delayAfter: 2000 },
    { text: 'And I have a little surprise for you.', delayAfter: 2000 },
    { text: 'So I wanted to ask you something...', delayAfter: 2000 },
  ];

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     DOM References
     -------------------------------------------------------------------------- */
  var sceneIntro = document.getElementById('scene-intro');
  var sceneChapter2 = document.getElementById('scene-chapter2');
  var sceneChapter3 = document.getElementById('scene-chapter3');
  var sceneChapter4 = document.getElementById("scene-chapter4");
  var sceneChapter5 = document.getElementById("scene-chapter5");
  var sceneChapter6 = document.getElementById("scene-chapter6");
  var sceneChapter7 = document.getElementById("scene-chapter7");
  var sceneChapter8 = document.getElementById("scene-chapter8");
  var beginBtn = document.getElementById('beginBtn');
  var openQuestionBtn = document.getElementById('openQuestionBtn');
  var petalsContainer = document.getElementById('petals');
  var particlesContainer = document.getElementById('particles');
  var parallaxLayers = document.querySelectorAll('.parallax-bg__layer');
  var chatMessages = document.getElementById('chatMessages');
  var chatTyping = document.getElementById('chatTyping');
  var chatStatus = document.getElementById('chatStatus');
  var chatFooter = document.getElementById('chatFooter');

  var introSteps = {
    heading: document.querySelector('[data-step="heading"]'),
    subheading: document.querySelector('[data-step="subheading"]'),
    title: document.querySelector('[data-step="title"]'),
    button: document.querySelector('[data-step="button"]'),
  };

  var chapter2Started = false;

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

  function getTypingDuration(text) {
    if (prefersReducedMotion) return 200;
    var base = 700;
    var perChar = 35;
    return Math.min(base + text.length * perChar, 1800);
  }

  function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    var mins = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + mins + ' ' + ampm;
  }

  function scrollChatToBottom() {
    var chatBody = document.querySelector('.chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  /* --------------------------------------------------------------------------
     Scene Transitions
     -------------------------------------------------------------------------- */
  function transitionScene(fromScene, toScene, onEnter) {
    if (!fromScene || !toScene) return;

    fromScene.classList.add('scene--exit');

    setTimeout(function () {
      fromScene.classList.remove('scene--active', 'scene--exit');
      fromScene.classList.add('scene--hidden');
      fromScene.setAttribute('aria-hidden', 'true');

      toScene.classList.remove('scene--hidden');
      toScene.classList.add('scene--active', 'scene--enter');
      toScene.removeAttribute('aria-hidden');

      if (typeof onEnter === 'function') {
        onEnter();
      }

      setTimeout(function () {
        toScene.classList.remove('scene--enter');
      }, SCENE_FADE_DURATION);
    }, SCENE_FADE_DURATION);
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
     Chapter 1 — Intro Sequence
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

  function transitionToChapter2() {
    if (!sceneIntro || !sceneChapter2) return;

    beginBtn.disabled = true;

    transitionScene(sceneIntro, sceneChapter2, function () {
      startChapter2();
    });
  }

  /* --------------------------------------------------------------------------
     Chapter 2 — WhatsApp Conversation
     -------------------------------------------------------------------------- */
  function showTyping() {
    if (!chatTyping || !chatStatus) return;

    chatTyping.classList.remove('chat-typing--hidden');
    chatTyping.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(function () {
      chatTyping.classList.add('chat-typing--visible');
    });

    chatStatus.textContent = 'typing...';
    chatStatus.classList.add('chat-header__status--typing');
    scrollChatToBottom();
  }

  function hideTyping() {
    if (!chatTyping || !chatStatus) return;

    chatTyping.classList.remove('chat-typing--visible');
    chatStatus.textContent = 'online';
    chatStatus.classList.remove('chat-header__status--typing');

    setTimeout(function () {
      chatTyping.classList.add('chat-typing--hidden');
      chatTyping.setAttribute('aria-hidden', 'true');
    }, 350);
  }

  function appendMessage(text, showSender) {
    if (!chatMessages) return;

    var message = document.createElement('div');
    message.className = 'chat-message';

    if (showSender) {
      var sender = document.createElement('span');
      sender.className = 'chat-message__sender';
      sender.textContent = 'Bilal';
      message.appendChild(sender);
    }

    var bubble = document.createElement('div');
    bubble.className = 'chat-message__bubble';

    var messageText = document.createElement('p');
    messageText.className = 'chat-message__text';
    messageText.textContent = text;

    var time = document.createElement('span');
    time.className = 'chat-message__time';
    time.textContent = formatTime(new Date());

    bubble.appendChild(messageText);
    bubble.appendChild(time);
    message.appendChild(bubble);
    chatMessages.appendChild(message);

    scrollChatToBottom();
  }

  function showQuestionButton() {
    if (!chatFooter) return;

    chatFooter.classList.remove('chat-footer--hidden');

    requestAnimationFrame(function () {
      chatFooter.classList.add('chat-footer--visible');
    });

    scrollChatToBottom();
  }

  async function runChatSequence() {
    var isFirst = true;

    for (var i = 0; i < CHAT_MESSAGES.length; i++) {
      var entry = CHAT_MESSAGES[i];
      var delayAfter = prefersReducedMotion ? 400 : entry.delayAfter;

      showTyping();
      await wait(getTypingDuration(entry.text));
      hideTyping();
      await wait(prefersReducedMotion ? 0 : 300);

      appendMessage(entry.text, isFirst);
      isFirst = false;

      await wait(delayAfter);
    }

    showQuestionButton();
  }

  function startChapter2() {
    if (chapter2Started) return;
    chapter2Started = true;

    wait(prefersReducedMotion ? 100 : 600).then(function () {
      runChatSequence();
    });
  }

  function transitionToChapter3() {
    if (!sceneChapter2 || !sceneChapter3) return;

    openQuestionBtn.disabled = true;

    transitionScene(sceneChapter2, sceneChapter3,function(){

    typeProposalText();

});
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

    if (openQuestionBtn) {
      openQuestionBtn.addEventListener('click', transitionToChapter3);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
/* =====================================================
   CHAPTER 3
===================================================== */

var yesButton = document.getElementById("yesButton");
var noButton = document.getElementById("noButton");
var funnyMessage = document.getElementById("funnyMessage");
var proposalTyping = document.getElementById("proposalTyping");

var noCount = 0;

var funnyTexts = [
    "Nice try 😜",
    "Nope 😂",
    "Still no 😆",
    "You know the answer ❤️",
    "Just press YES 😁"
];

function typeProposalText() {

    if (!proposalTyping) return;

    var text = "I have something to ask you...";
    proposalTyping.textContent = "";

    var i = 0;

    var timer = setInterval(function(){

        proposalTyping.textContent += text[i];

        i++;

        if(i >= text.length){

            clearInterval(timer);

        }

    },55);

}

function moveNoButton(){

    if(!noButton) return;

    noCount++;

    var x = Math.random()*220-110;
    var y = Math.random()*180-90;

    noButton.style.transform =
        "translate("+x+"px,"+y+"px)";

    funnyMessage.textContent =
        funnyTexts[(noCount-1)%funnyTexts.length];

    if(noCount>=5){

        noButton.style.transform +=
            " scale(.7)";

    }

    if(noCount>=10){

        noButton.style.display="none";

    }

}

if(noButton){

    noButton.addEventListener("mouseenter",moveNoButton);

    noButton.addEventListener("click",moveNoButton);

}

if(yesButton){

    yesButton.addEventListener("click",function(){

        transitionScene(
    sceneChapter3,
    sceneChapter4
);

        // Chapter 4 starts here

    });

}
//* ==================================   CHAPTER 4===================================================== */

var restaurantCards =
document.querySelectorAll(".restaurant-card");

var restaurantContinue =
document.getElementById("restaurantContinue");

var selectedRestaurant = "";

if (restaurantCards.length) {

    restaurantCards.forEach(function(card){

        card.addEventListener("click", function(){

            restaurantCards.forEach(function(c){
                c.classList.remove("selected");
            });

            card.classList.add("selected");

            selectedRestaurant = card.dataset.value;

            if (restaurantContinue) {
                restaurantContinue.style.display = "inline-block";
            }

        });

    });

}

if (restaurantContinue) {

    restaurantContinue.addEventListener("click", function(){

        transitionScene(
            sceneChapter4,
            sceneChapter5
        );

    });

}

/* =====================================================
   CHAPTER 5
===================================================== */

var dayCards =
document.querySelectorAll(".day-card");

var dayContinue =
document.getElementById("dayContinue");

var selectedDay = "";

if(dayCards.length){

    dayCards.forEach(function(card){

        card.addEventListener("click",function(){

            dayCards.forEach(function(c){

                c.classList.remove("selected");

            });

            card.classList.add("selected");

            selectedDay =
            card.dataset.day;

            if(dayContinue){

                dayContinue.style.display="inline-block";

            }

        });

    });

}

if(dayContinue){

    dayContinue.addEventListener("click",function(){

        transitionScene(
    sceneChapter5,
    sceneChapter6
);

    });

}

/* =====================================================
   CHAPTER 6
===================================================== */

var timeCards =
document.querySelectorAll(".time-card");

var timeContinue =
document.getElementById("timeContinue");

var selectedTime = "";

if(timeCards.length){

    timeCards.forEach(function(card){

        card.addEventListener("click",function(){

            timeCards.forEach(function(c){

                c.classList.remove("selected");

            });

            card.classList.add("selected");

            selectedTime =
            card.dataset.time;

            if(timeContinue){

                timeContinue.style.display="inline-block";

            }

        });

    });

}

if (timeContinue) {

    timeContinue.addEventListener("click", function () {

        document.getElementById("summaryRestaurant").textContent =
selectedRestaurant;

document.getElementById("summaryDay").textContent =
selectedDay;

document.getElementById("summaryTime").textContent =
selectedTime;

transitionScene(
    sceneChapter6,
    sceneChapter7
);

    });

}

/* =====================================================
   CHAPTER 7
===================================================== */

var finalContinue =
document.getElementById("finalContinue");

if (finalContinue) {

    finalContinue.addEventListener("click", function () {

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                restaurant: selectedRestaurant,
                day: selectedDay,
                time: selectedTime
            })
        })
        .then(function () {

            transitionScene(
                sceneChapter7,
                sceneChapter8
            );

        })
        .catch(function (err) {

            console.error(err);

            transitionScene(
                sceneChapter7,
                sceneChapter8
            );

        });

    });

}

/* =====================================================
   CHAPTER 8
===================================================== */

var restartStory =
document.getElementById("restartStory");

if(restartStory){

    restartStory.addEventListener("click",function(){

        window.location.reload();

    });

}

})();
