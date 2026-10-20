"use strict";

/* ==========================================
   SAFRA.PI — CONFIGURAÇÕES
   ========================================== */

const TOTAL_CELLS = 25;
const INITIAL_BALANCE = 100;

let balance = INITIAL_BALANCE;
let diamonds = 0;
let multiplier = 1;
let currentBet = 0;
let currentProfit = 0;

let mines = [];
let revealedCells = [];
let gameStarted = false;
let gameOver = false;
let resultShown = false;
let language = "pt";

let chartValues = [1];
let chartAnimationFrame = null;

/* ==========================================
   ELEMENTOS HTML
   ========================================== */

const $ = (id) => document.getElementById(id);

const board = $("board");
const multiplierText = $("multiplicador");
const diamondsText = $("diamantes");
const balanceText = $("saldo");

const betInput = $("bet");
const betButton = $("betButton");
const cashoutButton = $("cashout");
const mineCount = $("mineCount");

const currentBetDisplay = $("currentBetDisplay");
const potentialPrizeText = $("potentialPrize");
const gameMessage = $("gameMessage");

const languageSelect = $("language");

const leftChartCard = $("leftChartCard");
const rightChartCard = $("rightChartCard");

const leftChartValue = $("leftChartValue");
const rightChartValue = $("rightChartValue");

const leftStatus = $("leftStatus");
const rightStatus = $("rightStatus");

const leftChartCaption = $("leftChartCaption");
const rightChartCaption = $("rightChartCaption");

const leftChart = $("leftChart");
const rightChart = $("rightChart");

const resultOverlay = $("resultOverlay");
const resultBox = $("resultBox");
const resultIcon = $("resultIcon");
const resultTitle = $("resultTitle");
const resultDescription = $("resultDescription");
const resultClose = $("resultClose");

const newGameButton = $("newGameButton");

const depositButton = $("depositButton");
const depositModal = $("depositModal");
const closeDeposit = $("closeDeposit");
const depositAmount = $("depositAmount");
const simulateDeposit = $("simulateDeposit");

/* ==========================================
   TRADUÇÕES
   ========================================== */

const translations = {
    pt: {
        eyebrow: "PI GAMING EXPERIENCE",
        subtitle: "Sua próxima jogada pode mudar tudo.",
        projectMessage: "Faça parte da nova experiência da Pi Network",
        projectSubmessage: "Descubra uma nova forma de jogar com Pi.",
        testNotice: "VERSÃO DE TESTE — O site está em desenvolvimento e pode sofrer alterações.",
        depositButton: "Depositar Pi",

        balance: "Seu saldo",
        bet: "Aposta",
        multiplier: "Multiplicador",
        diamonds: "Moedas encontradas",
        market: "MERCADO",
        performance: "DESEMPENHO",
        leftCaption: "Pronto para começar",
        rightCaption: "Seu progresso aparecerá aqui.",
        gameTitle: "Campo de Moedas",
        gameDescription: "Encontre Pi. Evite as bombas.",
        mines: "Minas",
        betAmount: "Valor da aposta",
        startGame: "Começar jogo",
        cashout: "Resgatar prêmio",
        newGame: "Novo jogo",
        potentialPrize: "Prêmio potencial",
        makeBet: "Faça sua aposta para começar.",
        gameStarted: "Boa sorte! Escolha uma casa.",
        coinFound: "Moeda Pi encontrada!",
        keepPlaying: "Continue ou resgate seu prêmio.",
        betPlaced: "Aposta realizada!",
        invalidBet: "Digite um valor de aposta válido.",
        insufficientBalance: "Saldo insuficiente.",
        chooseBet: "Faça uma aposta primeiro.",
        alreadyPlaying: "Você já tem uma partida em andamento.",
        lossTitle: "LOSS",
        lossDescription: "Você encontrou uma bomba e perdeu sua aposta.",
        winTitle: "VOCÊ GANHOU!",
        winDescription: "Prêmio creditado ao seu saldo simulado.",
        cashedTitle: "PRÊMIO RESGATADO!",
        cashedDescription: "Seu prêmio foi adicionado ao saldo simulado.",
        continue: "Continuar",
        ready: "● PRONTO",
        playing: "● EM JOGO",
        lost: "● LOSS",
        won: "● VITÓRIA",
        leftPlaying: "Acompanhe a evolução da rodada.",
        rightPlaying: "Cada moeda aumenta seu multiplicador.",
        leftLost: "Rodada encerrada. Resultado negativo.",
        rightLost: "A bomba encerrou sua rodada.",
        leftWon: "Prêmio resgatado com sucesso.",
        rightWon: "Rodada encerrada.",
        leftReady: "Pronto para começar",
        rightReady: "Seu progresso aparecerá aqui.",
        depositTitle: "Depositar Pi",
        depositDescription: "A integração com a carteira Pi será implementada em uma próxima etapa.",
        depositAmount: "Quantidade de Pi",
        simulateDeposit: "Simular depósito",
        depositNote: "Demonstração: nenhum Pi real será transferido.",
        depositInvalid: "Digite uma quantidade válida.",
        depositSuccess: "Depósito simulado de {amount} π.",
        disclaimer: "Versão experimental. Saldo e resultados simulados."
    },

    en: {
        eyebrow: "PI GAMING EXPERIENCE",
        subtitle: "Your next move could change everything.",
        projectMessage: "Join the new Pi Network experience",
        projectSubmessage: "Discover a new way to play with Pi.",
        testNotice: "TEST VERSION — This website is under development and may change.",
        depositButton: "Deposit Pi",

        balance: "Your balance",
        bet: "Bet",
        multiplier: "Multiplier",
        diamonds: "Coins found",
        market: "MARKET",
        performance: "PERFORMANCE",
        leftCaption: "Ready to start",
        rightCaption: "Your progress will appear here.",
        gameTitle: "Coin Field",
        gameDescription: "Find Pi. Avoid the bombs.",
        mines: "Mines",
        betAmount: "Bet amount",
        startGame: "Start game",
        cashout: "Cash out",
        newGame: "New game",
        potentialPrize: "Potential prize",
        makeBet: "Place your bet to begin.",
        gameStarted: "Good luck! Choose a tile.",
        coinFound: "Pi coin found!",
        keepPlaying: "Keep playing or cash out.",
        betPlaced: "Bet placed!",
        invalidBet: "Enter a valid bet amount.",
        insufficientBalance: "Insufficient balance.",
        chooseBet: "Place a bet first.",
        alreadyPlaying: "You already have an active game.",
        lossTitle: "LOSS",
        lossDescription: "You hit a bomb and lost your bet.",
        winTitle: "YOU WON!",
        winDescription: "Your prize was added to your simulated balance.",
        cashedTitle: "PRIZE CLAIMED!",
        cashedDescription: "Your prize was added to your simulated balance.",
        continue: "Continue",
        ready: "● READY",
        playing: "● PLAYING",
        lost: "● LOSS",
        won: "● WIN",
        leftPlaying: "Track the progress of this round.",
        rightPlaying: "Each coin increases your multiplier.",
        leftLost: "Round ended. Negative result.",
        rightLost: "The bomb ended your round.",
        leftWon: "Prize claimed successfully.",
        rightWon: "Round completed.",
        leftReady: "Ready to start",
        rightReady: "Your progress will appear here.",
        depositTitle: "Deposit Pi",
        depositDescription: "Pi Wallet integration will be implemented in a later stage.",
        depositAmount: "Amount of Pi",
        simulateDeposit: "Simulate deposit",
        depositNote: "Demo only: no real Pi will be transferred.",
        depositInvalid: "Enter a valid amount.",
        depositSuccess: "Simulated deposit of {amount} π.",
        disclaimer: "Experimental version. Balance and results are simulated."
    },

    es: {
        eyebrow: "EXPERIENCIA DE JUEGO PI",
        subtitle: "Tu próxima jugada puede cambiarlo todo.",
        projectMessage: "Forma parte de la nueva experiencia de Pi Network",
        projectSubmessage: "Descubre una nueva forma de jugar con Pi.",
        testNotice: "VERSIÓN DE PRUEBA — El sitio está en desarrollo y puede cambiar.",
        depositButton: "Depositar Pi",

        balance: "Tu saldo",
        bet: "Apuesta",
        multiplier: "Multiplicador",
        diamonds: "Monedas encontradas",
        market: "MERCADO",
        performance: "RENDIMIENTO",
        leftCaption: "Listo para empezar",
        rightCaption: "Tu progreso aparecerá aquí.",
        gameTitle: "Campo de Monedas",
        gameDescription: "Encuentra Pi. Evita las bombas.",
        mines: "Minas",
        betAmount: "Valor de la apuesta",
        startGame: "Empezar juego",
        cashout: "Cobrar premio",
        newGame: "Nuevo juego",
        potentialPrize: "Premio potencial",
        makeBet: "Haz tu apuesta para comenzar.",
        gameStarted: "¡Buena suerte! Elige una casilla.",
        coinFound: "¡Moneda Pi encontrada!",
        keepPlaying: "Continúa o cobra tu premio.",
        betPlaced: "¡Apuesta realizada!",
        invalidBet: "Introduce una apuesta válida.",
        insufficientBalance: "Saldo insuficiente.",
        chooseBet: "Haz una apuesta primero.",
        alreadyPlaying: "Ya tienes una partida en curso.",
        lossTitle: "DERROTA",
        lossDescription: "Encontraste una bomba y perdiste tu apuesta.",
        winTitle: "¡GANASTE!",
        winDescription: "Premio añadido a tu saldo simulado.",
        cashedTitle: "¡PREMIO COBRADO!",
        cashedDescription: "Tu premio se añadió al saldo simulado.",
        continue: "Continuar",
        ready: "● LISTO",
        playing: "● EN JUEGO",
        lost: "● DERROTA",
        won: "● VICTORIA",
        leftPlaying: "Sigue el progreso de la ronda.",
        rightPlaying: "Cada moneda aumenta tu multiplicador.",
        leftLost: "Ronda finalizada. Resultado negativo.",
        rightLost: "La bomba terminó la ronda.",
        leftWon: "Premio cobrado correctamente.",
        rightWon: "Ronda finalizada.",
        leftReady: "Listo para empezar",
        rightReady: "Tu progreso aparecerá aquí.",
        depositTitle: "Depositar Pi",
        depositDescription: "La integración con Pi Wallet se implementará más adelante.",
        depositAmount: "Cantidad de Pi",
        simulateDeposit: "Simular depósito",
        depositNote: "Demostración: no se transferirá Pi real.",
        depositInvalid: "Introduce una cantidad válida.",
        depositSuccess: "Depósito simulado de {amount} π.",
        disclaimer: "Versión experimental. Saldo y resultados simulados."
    },

    de: {
        eyebrow: "PI GAMING EXPERIENCE",
        subtitle: "Dein nächster Zug kann alles verändern.",
        projectMessage: "Werde Teil der neuen Pi-Network-Erfahrung",
        projectSubmessage: "Entdecke eine neue Art, mit Pi zu spielen.",
        testNotice: "TESTVERSION — Die Website befindet sich in Entwicklung und kann sich ändern.",
        depositButton: "Pi einzahlen",

        balance: "Dein Guthaben",
        bet: "Einsatz",
        multiplier: "Multiplikator",
        diamonds: "Gefundene Münzen",
        market: "MARKT",
        performance: "LEISTUNG",
        leftCaption: "Bereit zum Start",
        rightCaption: "Dein Fortschritt erscheint hier.",
        gameTitle: "Münzfeld",
        gameDescription: "Finde Pi. Vermeide die Bomben.",
        mines: "Minen",
        betAmount: "Einsatzhöhe",
        startGame: "Spiel starten",
        cashout: "Gewinn auszahlen",
        newGame: "Neues Spiel",
        potentialPrize: "Möglicher Gewinn",
        makeBet: "Setze deinen Einsatz, um zu beginnen.",
        gameStarted: "Viel Glück! Wähle ein Feld.",
        coinFound: "Pi-Münze gefunden!",
        keepPlaying: "Spiele weiter oder zahle deinen Gewinn aus.",
        betPlaced: "Einsatz platziert!",
        invalidBet: "Gib einen gültigen Einsatz ein.",
        insufficientBalance: "Nicht genügend Guthaben.",
        chooseBet: "Setze zuerst deinen Einsatz.",
        alreadyPlaying: "Du hast bereits ein laufendes Spiel.",
        lossTitle: "VERLOREN",
        lossDescription: "Du hast eine Bombe gefunden und deinen Einsatz verloren.",
        winTitle: "DU HAST GEWONNEN!",
        winDescription: "Der Gewinn wurde deinem simulierten Guthaben gutgeschrieben.",
        cashedTitle: "GEWINN AUSGEZAHLT!",
        cashedDescription: "Dein Gewinn wurde deinem simulierten Guthaben hinzugefügt.",
        continue: "Weiter",
        ready: "● BEREIT",
        playing: "● IM SPIEL",
        lost: "● VERLOREN",
        won: "● GEWONNEN",
        leftPlaying: "Verfolge den Fortschritt der Runde.",
        rightPlaying: "Jede Münze erhöht deinen Multiplikator.",
        leftLost: "Runde beendet. Negatives Ergebnis.",
        rightLost: "Die Bombe hat die Runde beendet.",
        leftWon: "Gewinn erfolgreich ausgezahlt.",
        rightWon: "Runde beendet.",
        leftReady: "Bereit zum Start",
        rightReady: "Dein Fortschritt erscheint hier.",
        depositTitle: "Pi einzahlen",
        depositDescription: "Die Integration der Pi Wallet wird später implementiert.",
        depositAmount: "Pi-Menge",
        simulateDeposit: "Einzahlung simulieren",
        depositNote: "Demo: Es wird kein echtes Pi übertragen.",
        depositInvalid: "Gib eine gültige Menge ein.",
        depositSuccess: "Simulierte Einzahlung von {amount} π.",
        disclaimer: "Testversion. Guthaben und Ergebnisse sind simuliert."
    }
};

/* ==========================================
   TRADUÇÃO E FORMATAÇÃO
   ========================================== */

function t(key) {
    return translations[language]?.[key] ?? translations.pt[key] ?? key;
}

function formatPi(value) {
    return `${Number(value).toFixed(2)} π`;
}

function changeLanguage() {
    if (languageSelect && translations[languageSelect.value]) {
        language = languageSelect.value;
    }

    const htmlLanguages = {
        pt: "pt-BR",
        en: "en",
        es: "es",
        de: "de"
    };

    document.documentElement.lang = htmlLanguages[language] || "pt-BR";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        const translation = translations[language][key];

        if (translation !== undefined) {
            element.textContent = translation;
        }
    });

    if (!gameStarted && !gameOver) {
        setMessage("makeBet");
    }

    updateInterface();
    updateChartStatus();
}

if (languageSelect) {
    languageSelect.addEventListener("change", changeLanguage);
}

/* ==========================================
   INTERFACE
   ========================================== */

function setMessage(key) {
    if (gameMessage) {
        gameMessage.textContent = t(key);
    }
}

function updateBalance() {
    if (balanceText) {
        balanceText.textContent = formatPi(balance);
    }
}

function updateInterface() {
    updateBalance();

    if (diamondsText) {
        diamondsText.textContent = String(diamonds);
    }

    if (multiplierText) {
        multiplierText.textContent = `${multiplier.toFixed(2)}x`;
    }

    if (currentBetDisplay) {
        currentBetDisplay.textContent = formatPi(currentBet);
    }

    if (potentialPrizeText) {
        const prize = gameStarted && !gameOver
            ? currentBet * multiplier
            : 0;

        potentialPrizeText.textContent = formatPi(prize);
    }

    if (cashoutButton) {
        cashoutButton.disabled =
            !gameStarted || gameOver || diamonds === 0;
    }

    if (betButton) {
        betButton.disabled = gameStarted && !gameOver;
    }

    if (mineCount) {
        mineCount.disabled = gameStarted && !gameOver;
    }

    if (betInput) {
        betInput.disabled = gameStarted && !gameOver;
    }
}

/* ==========================================
   MINAS E TABULEIRO
   ========================================== */

function generateMines() {
    mines = [];

    const quantity = mineCount
        ? Number(mineCount.value)
        : 5;

    while (mines.length < quantity) {
        const position = Math.floor(Math.random() * TOTAL_CELLS);

        if (!mines.includes(position)) {
            mines.push(position);
        }
    }
}

function createBoard() {
    if (!board) return;

    board.innerHTML = "";
    revealedCells = [];

    for (let i = 0; i < TOTAL_CELLS; i++) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "cell";
        button.textContent = "?";

        button.setAttribute(
            "aria-label",
            `${language === "pt" ? "Casa" : language === "es" ? "Casilla" : language === "de" ? "Feld" : "Tile"} ${i + 1}`
        );

        button.addEventListener("click", () => {
            revealCell(i, button);
        });

        board.appendChild(button);
    }
}

function getMultiplierIncrement() {
    const quantity = mineCount ? Number(mineCount.value) : 5;

    const increments = {
        3: 0.12,
        5: 0.20,
        7: 0.30,
        10: 0.45
    };

    return increments[quantity] ?? 0.20;
}

/* ==========================================
   GRÁFICOS
   ========================================== */

function setupCanvas(canvas) {
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const context = canvas.getContext("2d");

    if (!context) return null;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    return { context, width, height };
}

function drawChart(canvas, values, color, animated = true) {
    const dimensions = setupCanvas(canvas);

    if (!dimensions) return;

    const { context: ctx, width, height } = dimensions;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;

    for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    for (let x = 20; x < width; x += 35) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    if (!values || values.length < 2) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(width * 0.08, height * 0.75, 4, 0, Math.PI * 2);
        ctx.fill();
        return;
    }

    const maxValue = Math.max(...values, 1.5) * 1.15;
    const minValue = 0.7;

    const points = values.map((value, index) => {
        const x = 8 +
            (index / Math.max(1, values.length - 1)) *
            (width - 16);

        const normalized =
            (value - minValue) / (maxValue - minValue);

        const y = height - 12 - normalized * (height - 24);

        return {
            x,
            y: Math.max(8, Math.min(height - 8, y))
        };
    });

    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, color + "44");
    gradient.addColorStop(1, color + "00");

    ctx.beginPath();
    ctx.moveTo(points[0].x, height);

    points.forEach((point) => {
        ctx.lineTo(point.x, point.y);
    });

    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();

    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    if (animated) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

    const last = points[points.length - 1];

    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function resetCharts() {
    if (chartAnimationFrame !== null) {
        cancelAnimationFrame(chartAnimationFrame);
        chartAnimationFrame = null;
    }

    if (leftChartCard) {
        leftChartCard.classList.remove("loss", "win");
    }

    if (rightChartCard) {
        rightChartCard.classList.remove("loss", "win");
    }

    drawChart(leftChart, [1], "#31e88a", false);
    drawChart(rightChart, [1], "#31e88a", false);

    if (leftChartValue) leftChartValue.textContent = "1.00x";
    if (rightChartValue) rightChartValue.textContent = "1.00x";

    if (leftChartCaption) leftChartCaption.textContent = t("leftReady");
    if (rightChartCaption) rightChartCaption.textContent = t("rightReady");
}

function updateCharts() {
    if (chartAnimationFrame !== null) {
        cancelAnimationFrame(chartAnimationFrame);
    }

    const targetValues = [...chartValues];
    const duration = 450;
    const start = performance.now();

    function animate(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);

        const partialValues = targetValues.map((value, index) => {
            if (index === targetValues.length - 1 && targetValues.length > 1) {
                const previous = targetValues[index - 1];
                return previous + (value - previous) * eased;
            }

            return value;
        });

        const color = gameOver && currentProfit < 0
            ? "#ff4d68"
            : "#31e88a";

        drawChart(leftChart, partialValues, color);
        drawChart(rightChart, partialValues, color);

        const lastValue = partialValues[partialValues.length - 1];

        if (leftChartValue) {
            leftChartValue.textContent = `${lastValue.toFixed(2)}x`;
        }

        if (rightChartValue) {
            rightChartValue.textContent = `${lastValue.toFixed(2)}x`;
        }

        if (progress < 1) {
            chartAnimationFrame = requestAnimationFrame(animate);
        } else {
            chartAnimationFrame = null;
        }
    }

    chartAnimationFrame = requestAnimationFrame(animate);
}

function drawLossCharts() {
    if (chartAnimationFrame !== null) {
        cancelAnimationFrame(chartAnimationFrame);
        chartAnimationFrame = null;
    }

    const lossValues = [
        ...chartValues,
        Math.max(0.7, multiplier * 0.5),
        0.7
    ];

    drawChart(leftChart, lossValues, "#ff4d68");
    drawChart(rightChart, lossValues, "#ff4d68");

    if (leftChartValue) leftChartValue.textContent = "LOSS";
    if (rightChartValue) rightChartValue.textContent = "LOSS";

    if (leftChartCaption) leftChartCaption.textContent = t("leftLost");
    if (rightChartCaption) rightChartCaption.textContent = t("rightLost");
}

function updateChartStatus() {
    let status;

    if (gameOver && currentProfit < 0) {
        status = t("lost");
    } else if (gameOver) {
        status = t("won");
    } else if (gameStarted) {
        status = t("playing");
    } else {
        status = t("ready");
    }

    if (leftStatus) leftStatus.textContent = status;
    if (rightStatus) rightStatus.textContent = status;

    if (gameStarted) {
        if (leftChartCaption) leftChartCaption.textContent = t("leftPlaying");
        if (rightChartCaption) rightChartCaption.textContent = t("rightPlaying");
    }
}

/* ==========================================
   NOVA PARTIDA
   ========================================== */

function newGame() {
    if (gameStarted && !gameOver) {
        alert(t("alreadyPlaying"));
        return;
    }

    gameStarted = false;
    gameOver = false;
    resultShown = false;

    currentBet = 0;
    currentProfit = 0;
    diamonds = 0;
    multiplier = 1;

    chartValues = [1];

    generateMines();
    createBoard();
    resetCharts();

    if (resultOverlay) {
        resultOverlay.hidden = true;
    }

    setMessage("makeBet");
    updateInterface();
    updateChartStatus();
}

if (newGameButton) {
    newGameButton.addEventListener("click", newGame);
}

/* ==========================================
   INICIAR APOSTA
   ========================================== */

if (betButton) {
    betButton.addEventListener("click", () => {
        if (gameStarted && !gameOver) {
            alert(t("alreadyPlaying"));
            return;
        }

        const bet = Number(betInput?.value);

        if (!Number.isFinite(bet) || bet <= 0) {
            alert(t("invalidBet"));
            return;
        }

        if (bet > balance) {
            alert(t("insufficientBalance"));
            return;
        }

        balance = Number((balance - bet).toFixed(2));

        currentBet = bet;
        diamonds = 0;
        multiplier = 1;
        currentProfit = 0;

        gameStarted = true;
        gameOver = false;
        resultShown = false;

        chartValues = [1];

        generateMines();
        createBoard();
        resetCharts();

        setMessage("gameStarted");
        updateInterface();
        updateChartStatus();
    });
}

/* ==========================================
   REVELAR CASA
   ========================================== */

function revealCell(index, button) {
    if (!gameStarted || gameOver) return;
    if (revealedCells.includes(index)) return;

    revealedCells.push(index);
    button.disabled = true;

    if (mines.includes(index)) {
        button.classList.add("mine");
        button.textContent = "💣";

        endGameLoss();
        return;
    }

    button.classList.add("revealed");

    const coin = document.createElement("span");

    coin.className = "pi-coin";
    coin.textContent = "π";
    coin.setAttribute("aria-label", "Pi");

    button.textContent = "";
    button.appendChild(coin);

    diamonds++;

    multiplier += getMultiplierIncrement();
    multiplier = Number(multiplier.toFixed(2));

    currentProfit = currentBet * multiplier - currentBet;

    chartValues.push(multiplier);

    setMessage("keepPlaying");
    updateInterface();
    updateCharts();
    updateChartStatus();

    const safeCells = TOTAL_CELLS - mines.length;

    if (diamonds >= safeCells) {
        endGameWin();
    }
}

/* ==========================================
   REVELAR MINAS
   ========================================== */

function revealAllMines() {
    if (!board) return;

    const cells = board.querySelectorAll(".cell");

    mines.forEach((index) => {
        const button = cells[index];

        if (!button) return;

        button.classList.add("mine");
        button.disabled = true;
        button.textContent = "💣";
    });

    cells.forEach((button) => {
        button.disabled = true;
    });
}

/* ==========================================
   RESULTADO DA PARTIDA
   ========================================== */

function showResult(titleKey, descriptionKey, icon, won) {
    if (resultShown) return;

    resultShown = true;

    if (resultTitle) resultTitle.textContent = t(titleKey);
    if (resultDescription) resultDescription.textContent = t(descriptionKey);
    if (resultIcon) resultIcon.textContent = icon;

    if (resultBox) {
        resultBox.classList.toggle("win", won);
    }

    if (resultOverlay) {
        resultOverlay.hidden = false;
    }
}

function endGameLoss() {
    gameOver = true;
    gameStarted = false;

    currentProfit = -currentBet;

    revealAllMines();

    if (leftChartCard) {
        leftChartCard.classList.add("loss");
        leftChartCard.classList.remove("win");
    }

    if (rightChartCard) {
        rightChartCard.classList.add("loss");
        rightChartCard.classList.remove("win");
    }

    drawLossCharts();

    setMessage("lossDescription");
    updateInterface();
    updateChartStatus();

    showResult("lossTitle", "lossDescription", "💣", false);
}

function endGameWin() {
    if (gameOver) return;

    gameOver = true;
    gameStarted = false;

    const prize = currentBet * multiplier;

    balance = Number((balance + prize).toFixed(2));
    currentProfit = prize - currentBet;

    if (leftChartCard) {
        leftChartCard.classList.remove("loss");
        leftChartCard.classList.add("win");
    }

    if (rightChartCard) {
        rightChartCard.classList.remove("loss");
        rightChartCard.classList.add("win");
    }

    updateCharts();

    setMessage("winDescription");
    updateInterface();
    updateChartStatus();

    showResult("winTitle", "winDescription", "🪙", true);
}

/* ==========================================
   RESGATAR PRÊMIO
   ========================================== */

if (cashoutButton) {
    cashoutButton.addEventListener("click", () => {
        if (!gameStarted || gameOver || diamonds === 0) return;

        const prize = currentBet * multiplier;

        balance = Number((balance + prize).toFixed(2));
        currentProfit = prize - currentBet;

        gameOver = true;
        gameStarted = false;

        if (leftChartCard) {
            leftChartCard.classList.remove("loss");
            leftChartCard.classList.add("win");
        }

        if (rightChartCard) {
            rightChartCard.classList.remove("loss");
            rightChartCard.classList.add("win");
        }

        updateCharts();

        setMessage("cashedDescription");
        updateInterface();
        updateChartStatus();

        showResult("cashedTitle", "cashedDescription", "🪙", true);
    });
}

/* ==========================================
   FECHAR RESULTADO
   ========================================== */

if (resultClose) {
    resultClose.addEventListener("click", () => {
        if (resultOverlay) {
            resultOverlay.hidden = true;
        }
    });
}

/* ==========================================
   DEPÓSITO SIMULADO
   ========================================== */

if (depositButton && depositModal) {
    depositButton.addEventListener("click", () => {
        depositModal.hidden = false;
    });
}

if (closeDeposit && depositModal) {
    closeDeposit.addEventListener("click", () => {
        depositModal.hidden = true;
    });
}

if (depositModal) {
    depositModal.addEventListener("click", (event) => {
        if (event.target === depositModal) {
            depositModal.hidden = true;
        }
    });
}

if (simulateDeposit) {
    simulateDeposit.addEventListener("click", () => {
        const amount = Number(depositAmount?.value);

        if (!Number.isFinite(amount) || amount <= 0) {
            alert(t("depositInvalid"));
            return;
        }

        balance = Number((balance + amount).toFixed(2));

        updateBalance();

        const message = t("depositSuccess")
            .replace("{amount}", amount.toFixed(2));

        alert(message);

        if (depositModal) {
            depositModal.hidden = true;
        }

        if (depositAmount) {
            depositAmount.value = "";
        }
    });
}

/* ==========================================
   REDIMENSIONAMENTO DOS GRÁFICOS
   ========================================== */

window.addEventListener("resize", () => {
    if (gameOver && currentProfit < 0) {
        drawLossCharts();
    } else {
        const color = gameOver ? "#31e88a" : "#31e88a";

        drawChart(leftChart, chartValues, color, false);
        drawChart(rightChart, chartValues, color, false);
    }
});

/* ==========================================
   INICIALIZAÇÃO
   ========================================== */

changeLanguage();
newGame();