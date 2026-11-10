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
  const QUESTIONS = [
    { part: 1, q: "Quelle pratique permet de réduire l'exposition aux perturbateurs endocriniens en agriculture ?",
      options: ["Augmenter les doses de pesticides", "Réduire l'utilisation des pesticides", "Pulvériser davantage de produits", "Mélanger plusieurs pesticides"], answer: [1] },
    { part: 1, q: "Pourquoi est-il préférable d'utiliser des variétés de plantes résistantes aux ravageurs ?",
      options: ["Pour augmenter les traitements chimiques", "Pour limiter le recours aux pesticides", "Pour supprimer tous les insectes", "Pour accélérer la croissance des mauvaises herbes"], answer: [1] },
    { part: 1, q: "Quel insecte peut être utilisé comme auxiliaire naturel pour lutter contre les pucerons ?",
      options: ["La mouche domestique", "La coccinelle", "Le moustique", "La guêpe commune"], answer: [1] },
    { part: 1, q: "Quels équipements permettent de protéger un agriculteur lors de la manipulation de produits phytosanitaires ?",
      options: ["Des gants, une combinaison, des lunettes et une protection respiratoire adaptée", "Un simple tee-shirt", "Des chaussures ouvertes", "Aucun équipement particulier"], answer: [0] },
    { part: 1, q: "Par quelles voies les produits chimiques peuvent-ils pénétrer dans l'organisme ?",
      options: ["Uniquement par les cheveux", "Par la peau, les yeux et les voies respiratoires", "Uniquement par les oreilles", "Uniquement par les pieds"], answer: [1] },
    { part: 1, q: "Qu'est-ce que le délai de rentrée dans une parcelle traitée ?",
      options: ["Le temps à respecter avant de retourner dans la zone traitée", "Le temps nécessaire pour planter une culture", "Le temps de stockage des récoltes", "Le temps de préparation du produit"], answer: [0] },
    { part: 1, q: "Pourquoi faut-il respecter le délai de rentrée ?",
      options: ["Pour limiter l'exposition aux résidus de produits phytosanitaires", "Pour augmenter la quantité de pesticides", "Pour accélérer la récolte", "Pour favoriser les mauvaises herbes"], answer: [0] },
    { part: 1, q: "Comment faut-il stocker les produits phytosanitaires ?",
      options: ["Dans une cuisine", "Dans un local dédié, fermé et ventilé", "À proximité des aliments", "Dans une bouteille d'eau"], answer: [1] },
    { part: 1, q: "Pourquoi faut-il conserver les produits dans leur emballage d'origine ?",
      options: ["Pour garder les informations de sécurité et d'identification", "Pour gagner de la place", "Pour éviter de lire les consignes", "Pour faciliter leur mélange"], answer: [0] },
    { part: 1, q: "Quel risque existe lorsque les produits phytosanitaires sont mal stockés ?",
      options: ["Une meilleure efficacité des produits", "Des fuites et une contamination de l'environnement", "Une diminution automatique de leur toxicité", "Une disparition des résidus"], answer: [1] },
    { part: 1, q: "Quelles personnes peuvent être particulièrement vulnérables aux perturbateurs endocriniens ?",
      options: ["Les femmes enceintes et les jeunes enfants", "Uniquement les personnes âgées", "Uniquement les sportifs", "Aucune catégorie de population"], answer: [0] },
    { part: 1, q: "Quel geste faut-il effectuer après avoir manipulé des produits phytosanitaires ?",
      options: ["Se laver soigneusement les mains", "Manger directement", "Toucher son visage", "Garder ses gants contaminés"], answer: [0] },
    { part: 1, q: "Comment faut-il laver les vêtements de travail potentiellement contaminés ?",
      options: ["Avec le linge de toute la famille", "Séparément du linge personnel", "Sans les laver", "Uniquement à l'eau froide, sans lessive"], answer: [1] },
    { part: 1, q: "Quelles pratiques permettent de réduire l'utilisation des pesticides ?",
      options: ["Utiliser des auxiliaires naturels", "Diversifier les cultures", "Augmenter systématiquement les doses de pesticides", "Utiliser des pièges pour surveiller les ravageurs"], answer: [0, 1, 3], multi: true },
    { part: 1, q: "Quel est l'objectif de l'agroécologie ?",
      options: ["Développer une agriculture plus respectueuse des écosystèmes", "Augmenter systématiquement les produits chimiques", "Éliminer tous les insectes", "Remplacer toutes les cultures par une seule variété"], answer: [0] },
    { part: 2, q: "Comment les pesticides peuvent-ils atteindre les cours d'eau ?",
      options: ["Par le ruissellement depuis les parcelles agricoles", "Uniquement par les nuages", "Par la lumière du soleil", "Par la photosynthèse"], answer: [0] },
    { part: 2, q: "Quel phénomène peut être observé chez certains poissons exposés à des perturbateurs endocriniens ?",
      options: ["La féminisation de certains mâles", "Une augmentation systématique de leur taille", "La disparition de leurs nageoires", "Une transformation en amphibiens"], answer: [0] },
    { part: 2, q: "Comment les oiseaux peuvent-ils être exposés aux pesticides agricoles ?",
      options: ["En mangeant des graines traitées", "En respirant uniquement l'air marin", "En buvant uniquement de l'eau de pluie", "En dormant dans les arbres"], answer: [0] },
    { part: 2, q: "Quels effets certains perturbateurs endocriniens peuvent-ils avoir sur les oiseaux ?",
      options: ["Des perturbations de l'incubation et du comportement reproducteur", "Une amélioration systématique de la reproduction", "Une disparition immédiate de toutes les espèces", "Une augmentation automatique du nombre d'œufs"], answer: [0] },
    { part: 2, q: "Quels effets une exposition à de faibles doses de certains pesticides peut-elle avoir sur les abeilles ?",
      options: ["Des perturbations de l'orientation, de l'apprentissage et de la ponte de la reine", "Une augmentation systématique de la production de miel", "Une disparition de leur besoin de nourriture", "Une amélioration automatique de leur mémoire"], answer: [0] }
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
