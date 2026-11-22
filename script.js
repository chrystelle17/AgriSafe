/* ==========================================================
   AgriSafe – Interactions
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Retour en haut + logo ---------- */
  const toTop = document.getElementById("toTop");

  function onScroll() {
    toTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  // Image manquante : on garde le rond noir / le carré gris
  document.querySelectorAll(".logo img, .footer-logo img, .membre-photo img").forEach(img => {
    const hide = () => { img.style.display = "none"; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Carrousel ---------- */
/* ==========================================================
   CARROUSEL « Comprendre l'exposition »
   ========================================================== */
(function () {
  var AUTOPLAY_MS = 0;   // 0 = pas de défilement automatique ; mets 10000 pour 10 secondes

  var root = document.getElementById("expoCarousel");
  if (!root) return;

  var slides  = root.querySelectorAll(".expo-slide");
  var dotsBox = root.querySelector(".expo-dots");
  var prevBtn = root.querySelector(".expo-prev");
  var nextBtn = root.querySelector(".expo-next");
  var counter = root.querySelector(".expo-counter");
  var current = 0;
  var timer = null;

  // Création des points de navigation
  var dots = [];
  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Aller à la diapositive " + (i + 1));
    dot.addEventListener("click", function () { goTo(i); restart(); });
    dotsBox.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      dots[i].classList.toggle("is-active", active);
    });
    counter.textContent = (current + 1) + " / " + slides.length;
  }

  function start()   { if (AUTOPLAY_MS > 0) timer = setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS); }
  function stop()    { clearInterval(timer); }
  function restart() { stop(); start(); }

  prevBtn.addEventListener("click", function () { goTo(current - 1); restart(); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); restart(); });

  // Clavier (quand le carrousel a le focus)
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft")  { goTo(current - 1); restart(); }
    if (e.key === "ArrowRight") { goTo(current + 1); restart(); }
  });

  // Glissement du doigt sur téléphone
  var startX = 0;
  root.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].screenX; }, { passive: true });
  root.addEventListener("touchend", function (e) {
    var diff = e.changedTouches[0].screenX - startX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current - 1 : current + 1); restart(); }
  }, { passive: true });

  // Pause quand la souris est dessus (utile seulement avec le défilement automatique)
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  goTo(0);
  start();
  })();

  /* ---------- Effets : ouverture au toucher (mobile) ---------- */
  const effects = document.querySelectorAll(".effect");
  effects.forEach(effect => {
    effect.addEventListener("click", () => {
      const wasOpen = effect.classList.contains("open");
      effects.forEach(e => e.classList.remove("open"));
      if (!wasOpen) effect.classList.add("open");
    });
  });

  /* ---------- Apparition des sections au scroll ---------- */
  const revealTargets = document.querySelectorAll(".section .container");
  revealTargets.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---------- Une seule vidéo à la fois ---------- */
  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    video.addEventListener("play", () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
  });
});

/* ==========================================================
   QUIZ INTERACTIF
   ========================================================== */
(function () {
  const PARTS = {
    1: "Partie 1 – Prévention des risques agricoles",
    2: "Partie 2 – Impacts sur la biodiversité"
  };

  // answer = indices des bonnes réponses (0 = A, 1 = B, 2 = C, 3 = D)
const PARTS = {
  1: "Partie 1 – Comprendre les perturbateurs endocriniens",
  2: "Partie 2 – Conseils pour réduire l’exposition"
};

// answer = indices des bonnes réponses (0 = A, 1 = B, 2 = C, 3 = D)
const QUESTIONS = [
  // 15 questions scientifiques
  { part: 1, q: "Quel est le rôle principal du système endocrinien ?",
    options: ["Produire et réguler des hormones", "Transporter l'oxygène dans les poumons", "Digérer les aliments", "Protéger uniquement la peau"], answer: [0] },

  { part: 1, q: "Comment les perturbateurs endocriniens peuvent-ils agir ?",
    options: ["Tous de la même manière", "En modifiant différents mécanismes hormonaux", "Uniquement en détruisant les hormones", "Seulement dans le système digestif"], answer: [1] },

  { part: 1, q: "Quel mécanisme est associé à certains perturbateurs endocriniens industriels, comme le BPA ?",
    options: ["Une interaction directe avec certains récepteurs hormonaux", "La transformation des hormones en vitamines", "L'arrêt de toute production hormonale", "La destruction des cellules nerveuses"], answer: [0] },

  { part: 1, q: "Quelle enzyme l'atrazine peut-elle modifier dans certains modèles expérimentaux ?",
    options: ["L'aromatase CYP19A1", "La lactase", "L'hémoglobine", "La pepsine"], answer: [0] },

  { part: 1, q: "Que peut faire le récepteur PXR lorsqu'il est activé par certaines substances ?",
    options: ["Modifier le métabolisme et l'élimination de certaines substances ou hormones", "Produire directement de l'insuline", "Empêcher toute digestion", "Transformer les pesticides en hormones naturelles"], answer: [0] },

  { part: 1, q: "Quelles sont des voies possibles d'exposition aux pesticides ?",
    options: ["Professionnelle, alimentaire, hydrique et résidentielle", "Uniquement par les cheveux", "Uniquement par les oreilles", "Seulement pendant le sommeil"], answer: [0] },

  { part: 1, q: "À quoi a servi le programme Matphyto-DOM à La Réunion ?",
    options: ["À reconstituer l'exposition professionnelle aux pesticides dans la canne à sucre", "À mesurer le nombre de poissons dans les lagons", "À remplacer les recensements agricoles", "À évaluer uniquement la qualité de l'air"], answer: [0] },

  { part: 1, q: "Combien de substances actives différentes l'étude Matphyto-DOM a-t-elle recensées dans les années étudiées pour la canne à sucre ?",
    options: ["5", "25", "100", "250"], answer: [1] },

  { part: 1, q: "Selon les résultats présentés dans le site, quelle part des travailleurs était exposée à au moins une substance CMR ou PE en 2010 ?",
    options: ["Environ 10 %", "Environ 25 %", "Environ 44 %", "Environ 88 %"], answer: [3] },

  { part: 1, q: "Que montrent les suivis de l'eau à La Réunion présentés dans le site ?",
    options: ["Des pesticides ou leurs métabolites ont été détectés dans certaines eaux", "Aucune substance n'a jamais été détectée", "L'eau ne peut pas être contaminée par ruissellement", "Seuls les insecticides peuvent atteindre l'eau"], answer: [0] },

  { part: 1, q: "Pourquoi certaines molécules interdites ou moins utilisées peuvent-elles encore être détectées dans l'environnement ?",
    options: ["Parce que certaines molécules ou leurs métabolites persistent dans les milieux", "Parce qu'elles sont produites par les plantes", "Parce que l'interdiction les rend plus actives", "Parce qu'elles disparaissent puis réapparaissent spontanément"], answer: [0] },

  { part: 1, q: "Que signifie l'effet « cocktail » ?",
    options: ["L'exposition à plusieurs substances pouvant avoir des effets combinés", "L'exposition à une seule substance pure", "Le mélange de pesticides dans un récipient uniquement", "La disparition simultanée de tous les pesticides"], answer: [0] },

  { part: 1, q: "Quelle affirmation correspond au niveau de preuve présenté sur le glyphosate dans le site ?",
    options: ["Tous ses effets endocriniens chez l'humain sont démontrés", "Les données expérimentales existent, mais les preuves endocriniennes humaines restent hétérogènes", "Il n'a jamais été étudié", "Il cause nécessairement une maladie chez toute personne exposée"], answer: [1] },

  { part: 1, q: "Pourquoi une exposition pendant la grossesse ou la petite enfance est-elle particulièrement étudiée ?",
    options: ["Certaines périodes du développement sont sensibles et des effets peuvent apparaître plus tard", "Les hormones ne fonctionnent pas avant l'âge adulte", "Les pesticides ne peuvent agir que chez les enfants", "Elle empêche toujours le développement du système nerveux"], answer: [0] },

  { part: 1, q: "Quelle conclusion est la plus prudente concernant les pesticides et les maladies à La Réunion ?",
    options: ["Un pesticide précis explique à lui seul toutes les maladies", "Les expositions et certains mécanismes sont documentés, mais la causalité locale doit être étudiée avec prudence", "Aucune exposition n'a été mesurée", "Toute personne exposée développera forcément un cancer"], answer: [1] },

  // 5 questions sur les conseils
  { part: 2, q: "Quels équipements de protection faut-il porter lors de la préparation ou de l'épandage d'un produit phytosanitaire ?",
    options: ["Des gants adaptés, une combinaison, des lunettes et une protection respiratoire appropriée", "Un tee-shirt et des sandales", "Des lunettes de soleil uniquement", "Aucun équipement si le traitement est rapide"], answer: [0] },

  { part: 2, q: "Quelle pratique peut aider à réduire le recours aux pesticides ?",
    options: ["Le désherbage mécanique et la lutte intégrée", "Augmenter systématiquement les doses", "Traiter même en l'absence de ravageurs", "Utiliser une seule culture partout"], answer: [0] },

  { part: 2, q: "Que faut-il faire avant et pendant un traitement ?",
    options: ["Respecter les doses indiquées et éviter de traiter par vent fort", "Doubler la dose quand il y a du vent", "Mélanger des produits sans vérifier les consignes", "Pulvériser vers les habitations"], answer: [0] },

  { part: 2, q: "Que faut-il faire après avoir manipulé des produits phytosanitaires ?",
    options: ["Se laver, se changer et laver séparément les vêtements de travail", "Garder les vêtements contaminés toute la journée", "Manger sans se laver les mains", "Laver les vêtements avec le linge de toute la famille"], answer: [0] },

  { part: 2, q: "Comment faut-il stocker les produits phytosanitaires ?",
    options: ["Dans leur emballage d'origine, dans un local fermé et ventilé", "Dans une bouteille alimentaire", "À côté des aliments, dans la cuisine", "Dans un endroit accessible aux enfants"], answer: [0] }
];

  const $ = id => document.getElementById(id);
  const box = $("quizBox");
  if (!box) return;

  const el = {
    start: $("quizStart"), play: $("quizPlay"), end: $("quizEnd"),
    begin: $("quizBegin"), part: $("quizPart"), count: $("quizCount"), bar: $("quizBar"),
    question: $("quizQuestion"), hint: $("quizHint"), options: $("quizOptions"),
    feedback: $("quizFeedback"), validate: $("quizValidate"), next: $("quizNext"),
    score: $("quizScore"), message: $("quizMessage"), review: $("quizReview"), restart: $("quizRestart")
  };
  const LETTERS = ["A", "B", "C", "D"];

  let index = 0, score = 0, locked = false, selected = new Set(), missed = [];

  const letters = arr => arr.map(i => LETTERS[i]).join(", ");

  function showScreen(name) {
    el.start.hidden = name !== "start";
    el.play.hidden = name !== "play";
    el.end.hidden = name !== "end";
  }

  function startQuiz() {
    index = 0; score = 0; missed = [];
    showScreen("play");
    renderQuestion();
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderQuestion() {
    const item = QUESTIONS[index];
    locked = false;
    selected = new Set();

    el.part.textContent = PARTS[item.part];
    el.count.textContent = "Question " + (index + 1) + " / " + QUESTIONS.length + " • Score : " + score;
    el.bar.style.width = (index / QUESTIONS.length * 100) + "%";
    el.question.textContent = (index + 1) + ". " + item.q;
    el.hint.hidden = !item.multi;
    el.feedback.textContent = "";
    el.feedback.className = "quiz-feedback";
    el.next.hidden = true;
    el.validate.hidden = !item.multi;
    el.validate.disabled = true;
    el.next.textContent = index === QUESTIONS.length - 1 ? "Voir mon résultat" : "Question suivante";

    el.options.innerHTML = "";
    item.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.dataset.i = i;
      const letter = document.createElement("span");
      letter.className = "quiz-letter";
      letter.textContent = LETTERS[i];
      const label = document.createElement("span");
      label.textContent = text;
      btn.append(letter, label);
      btn.addEventListener("click", () => onChoose(i, btn));
      el.options.appendChild(btn);
    });
  }

  function onChoose(i, btn) {
    if (locked) return;
    const item = QUESTIONS[index];
    if (item.multi) {
      if (selected.has(i)) { selected.delete(i); btn.classList.remove("selected"); }
      else { selected.add(i); btn.classList.add("selected"); }
      el.validate.disabled = selected.size === 0;
    } else {
      selected = new Set([i]);
      validate();
    }
  }

  function validate() {
    if (locked) return;
    locked = true;
    const item = QUESTIONS[index];
    const good = new Set(item.answer);
    const isCorrect = selected.size === good.size && [...selected].every(i => good.has(i));

    el.options.querySelectorAll(".quiz-option").forEach(btn => {
      const i = Number(btn.dataset.i);
      btn.disabled = true;
      btn.classList.remove("selected");
      if (good.has(i)) btn.classList.add("correct");
      else if (selected.has(i)) btn.classList.add("wrong");
    });

    if (isCorrect) {
      score++;
      el.feedback.textContent = "✅ Bonne réponse !";
      el.feedback.className = "quiz-feedback ok";
    } else {
      missed.push({ item, chosen: [...selected].sort() });
      el.feedback.textContent = "❌ Raté. Bonne" + (item.answer.length > 1 ? "s réponses : " : " réponse : ") + letters(item.answer) + ".";
      el.feedback.className = "quiz-feedback ko";
    }
    el.count.textContent = "Question " + (index + 1) + " / " + QUESTIONS.length + " • Score : " + score;
    el.validate.hidden = true;
    el.next.hidden = false;
    el.next.focus();
  }

  function nextQuestion() {
    index++;
    if (index >= QUESTIONS.length) showResult();
    else renderQuestion();
  }

  function showResult() {
    el.bar.style.width = "100%";
    showScreen("end");
    el.score.textContent = score + " / " + QUESTIONS.length;

    let msg;
    if (score >= 18) msg = "🏆 Excellent ! Vous maîtrisez le sujet.";
    else if (score >= 14) msg = "👏 Très bien ! Vous avez retenu l'essentiel.";
    else if (score >= 10) msg = "🙂 Pas mal ! Relisez quelques parties du site pour progresser.";
    else msg = "📚 Parcourez à nouveau le site, puis retentez le quiz.";
    el.message.textContent = msg;

    el.review.innerHTML = "";
    if (missed.length) {
      const h = document.createElement("h4");
      h.textContent = "Questions à revoir :";
      el.review.appendChild(h);
      missed.forEach(({ item }) => {
        const div = document.createElement("div");
        div.className = "quiz-review-item";
        const q = document.createElement("strong");
        q.textContent = item.q;
        const a = document.createElement("span");
        a.textContent = "Bonne" + (item.answer.length > 1 ? "s réponses : " : " réponse : ") +
          item.answer.map(i => LETTERS[i] + ". " + item.options[i]).join(" • ");
        div.append(q, a);
        el.review.appendChild(div);
      });
    }
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  el.begin.addEventListener("click", startQuiz);
  el.validate.addEventListener("click", validate);
  el.next.addEventListener("click", nextQuestion);
  el.restart.addEventListener("click", startQuiz);
})();
