(function () {
  const params = new URLSearchParams(window.location.search);
  const diagnosisId = params.get("id") || "baby-lotion";
  const diagnosis = window.DIAGNOSES[diagnosisId] || window.DIAGNOSES["baby-lotion"];
  const state = {
    step: 0,
    scores: {},
    answers: []
  };

  const intro = document.querySelector(".intro");
  const quiz = document.querySelector(".quiz");
  const result = document.querySelector(".result");
  const startButton = document.querySelector("[data-start]");
  const backButton = document.querySelector("[data-back]");
  const resetButtons = document.querySelectorAll("[data-reset], [data-reset-result]");
  const stepLabel = document.querySelector("[data-step-label]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const questionKicker = document.querySelector("[data-question-kicker]");
  const questionTitle = document.querySelector("[data-question-title]");
  const choices = document.querySelector("[data-choices]");
  const resultTitle = document.querySelector("[data-result-title]");
  const resultSummary = document.querySelector("[data-result-summary]");
  const resultPoints = document.querySelector("[data-result-points]");
  const resultChecklist = document.querySelector("[data-result-checklist]");
  const offerIntro = document.querySelector("[data-offer-intro]");
  const offerList = document.querySelector("[data-offer-list]");

  function start() {
    intro.hidden = true;
    quiz.hidden = false;
    result.hidden = true;
    renderQuestion();
  }

  function reset() {
    state.step = 0;
    state.scores = {};
    state.answers = [];
    intro.hidden = false;
    quiz.hidden = true;
    result.hidden = true;
  }

  function renderQuestion() {
    const question = diagnosis.questions[state.step];
    const total = diagnosis.questions.length;
    stepLabel.textContent = `${state.step + 1} / ${total}`;
    progressBar.style.width = `${((state.step + 1) / total) * 100}%`;
    questionKicker.textContent = question.kicker;
    questionTitle.textContent = question.title;
    choices.innerHTML = "";

    question.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = choice.label;
      button.addEventListener("click", () => choose(choice));
      choices.appendChild(button);
    });

    backButton.disabled = state.step === 0;
  }

  function choose(choice) {
    state.answers[state.step] = choice;
    rebuildScores();

    if (state.step < diagnosis.questions.length - 1) {
      state.step += 1;
      renderQuestion();
      return;
    }

    renderResult();
  }

  function rebuildScores() {
    state.scores = {};
    state.answers.forEach((answer) => {
      Object.entries(answer.scores).forEach(([key, value]) => {
        state.scores[key] = (state.scores[key] || 0) + value;
      });
    });
  }

  function goBack() {
    if (state.step === 0) return;
    state.answers.splice(state.step - 1, 1);
    state.step -= 1;
    rebuildScores();
    renderQuestion();
  }

  function getTopResultKey() {
    return Object.entries(state.scores).sort((a, b) => b[1] - a[1])[0][0];
  }

  function renderList(target, items) {
    target.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      target.appendChild(li);
    });
  }

  function getOfferById(offerId) {
    const offersById = Object.fromEntries(diagnosis.offers.map((offer) => [offer.id, offer]));

    return offersById[offerId] || diagnosis.offers[0];
  }

  function createOfferCard(offer) {
    const card = document.createElement("article");
    card.className = "offer-card";

    const image = document.createElement("img");
    image.className = "offer-card__image";
    image.src = offer.image;
    image.alt = `${offer.name}の商品画像`;
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "offer-card__body";

    const badge = document.createElement("p");
    badge.className = "offer-card__badge";
    badge.textContent = offer.badge;

    const name = document.createElement("h4");
    name.textContent = offer.name;

    const price = document.createElement("p");
    price.className = "offer-card__price";
    price.textContent = offer.price;

    const note = document.createElement("p");
    note.className = "offer-card__note";
    note.textContent = offer.note;

    const link = document.createElement("a");
    link.className = "primary-button";
    link.href = offer.url;
    link.target = "_blank";
    link.rel = "nofollow sponsored noopener";
    link.textContent = "楽天で詳細を見る";

    body.append(badge, name, price, note, link);
    card.append(image, body);

    return card;
  }

  function renderOffers(resultData) {
    offerIntro.textContent = resultData.offerIntro;
    offerList.innerHTML = "";
    offerList.appendChild(createOfferCard(getOfferById(resultData.recommendedOffer)));
  }

  function renderResult() {
    const resultKey = getTopResultKey();
    const resultData = diagnosis.results[resultKey];
    quiz.hidden = true;
    result.hidden = false;
    resultTitle.textContent = resultData.title;
    resultSummary.textContent = resultData.summary;
    renderList(resultPoints, resultData.points);
    renderList(resultChecklist, resultData.checklist);
    renderOffers(resultData);
  }

  startButton.addEventListener("click", start);
  backButton.addEventListener("click", goBack);
  resetButtons.forEach((button) => button.addEventListener("click", reset));
})();
