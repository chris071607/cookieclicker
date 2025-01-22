let cookieCount = 0;
let autoClickerPrice = 50;
let multiplierPrice = 100;
let multiplier = 1;
let prestigePoints = 0;
let goldenCookies = 0;
let achievements = [];
const achievementThresholds = [100, 500, 1000, 5000, 10000];
let autoClickerActive = false;
const cookieTooltip = document.getElementById("cookie-tooltip");

const cookie = document.getElementById("cookie");
const counter = document.getElementById("counter");
const prestigeCounter = document.getElementById("prestige");
const goldenCookieCounter = document.getElementById("golden-cookie");
const autoClickerButton = document.getElementById("auto-clicker");
const multiplierButton = document.getElementById("multiplier");
const prestigeButton = document.getElementById("prestige-button");
const progressBar = document.getElementById("progress-bar");
const achievementsList = document.getElementById("achievement-list");

// Theme switching
const normalThemeButton = document.getElementById("normal-theme");
const winterThemeButton = document.getElementById("winter-theme");

// Switch to normal theme
normalThemeButton.addEventListener("click", () => {
    document.body.classList.remove("winter-theme");
    document.body.classList.add("normal-theme");
});

// Switch to winter theme
winterThemeButton.addEventListener("click", () => {
    document.body.classList.remove("normal-theme");
    document.body.classList.add("winter-theme");
});

function updateCounter() {
  counter.textContent = `Cookies: ${cookieCount}`;
  prestigeCounter.textContent = `Prestige Points: ${prestigePoints}`;
  goldenCookieCounter.textContent = `Golden Cookies: ${goldenCookies}`;
  autoClickerButton.disabled = cookieCount < autoClickerPrice;
  multiplierButton.disabled = cookieCount < multiplierPrice;
  prestigeButton.disabled = cookieCount < 5000;

  const progress = Math.min(
    (cookieCount / Math.max(autoClickerPrice, multiplierPrice)) * 100,
    100
  );
  progressBar.style.width = `${progress}%`;
  checkAchievements();
}

function checkAchievements() {
  achievementThresholds.forEach((threshold) => {
    if (cookieCount >= threshold && !achievements.includes(threshold)) {
      achievements.push(threshold);
      const li = document.createElement("li");
      li.textContent = `Earned ${threshold} Cookies!`;
      achievementsList.appendChild(li);
    }
  });
}


function showTooltip(amount, x, y) {
  cookieTooltip.textContent = `+${amount} Cookies`;
  cookieTooltip.style.left = `${x}px`;
  cookieTooltip.style.top = `${y}px`;
  cookieTooltip.style.display = "block";

  setTimeout(() => {
    cookieTooltip.style.display = "none";
  }, 500);
}

function spawnGoldenCookie() {
    const goldenCookie = document.createElement("img");
    goldenCookie.src = "assets/img/golden_cookie.png";
    goldenCookie.style.position = "absolute";
    goldenCookie.style.top = `${Math.random() * window.innerHeight}px`;
    goldenCookie.style.left = `${Math.random() * window.innerWidth}px`;
    goldenCookie.style.cursor = "pointer";
    goldenCookie.style.width = "50px";
    goldenCookie.setAttribute("draggable", "false"); // Prevent dragging
    goldenCookie.addEventListener("click", () => {
      goldenCookies++;
      cookieCount += 50 * multiplier;
      updateCounter();
      goldenCookie.remove();
    });
    document.body.appendChild(goldenCookie);
    setTimeout(() => goldenCookie.remove(), 5000);
  }
  

function spawnSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.style.left = `${Math.random() * window.innerWidth}px`;
  snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
  document.body.appendChild(snowflake);
  
  setTimeout(() => snowflake.remove(), 5000);
}

function startSnowstorm() {
  if (cookieCount >= 10000 && !snowstormActive) {
    snowstormActive = true;
    document.body.style.filter = 'blur(5px)';
    snowstormTimeout = setTimeout(() => {
      snowstormActive = false;
      document.body.style.filter = 'none';
    }, 3000);
  }
}

function moveCookie() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const cookieSize = cookie.offsetWidth;

  const targetX = Math.random() * (screenWidth - cookieSize);
  const targetY = Math.random() * (screenHeight - cookieSize);

  let currentX = cookie.offsetLeft;
  let currentY = cookie.offsetTop;

  const step = 5;

  const moveInterval = setInterval(() => {
    if (
      Math.abs(currentX - targetX) <= step &&
      Math.abs(currentY - targetY) <= step
    ) {
      clearInterval(moveInterval);
    } else {
      if (currentX < targetX) currentX += step;
      if (currentX > targetX) currentX -= step;
      if (currentY < targetY) currentY += step;
      if (currentY > targetY) currentY -= step;

      cookie.style.left = `${currentX}px`;
      cookie.style.top = `${currentY}px`;
    }
  }, 10);
}

cookie.addEventListener("click", (e) => {
  cookieCount += multiplier;
  updateCounter();
  showTooltip(multiplier, e.pageX, e.pageY);
  moveCookie();
});

autoClickerButton.addEventListener("click", () => {
  if (cookieCount >= autoClickerPrice) {
    cookieCount -= autoClickerPrice;
    autoClickerPrice = Math.floor(autoClickerPrice * 1.5);
    autoClickerButton.textContent = `Buy Auto-Clicker (${autoClickerPrice} Cookies)`;

    if (!autoClickerActive) {
      autoClickerActive = true;
      setInterval(() => {
        cookieCount += multiplier;
        updateCounter();
        showTooltip(multiplier, cookie.offsetLeft, cookie.offsetTop);
      }, 1500);
    }

    updateCounter();
  }
});

multiplierButton.addEventListener("click", () => {
  if (cookieCount >= multiplierPrice) {
    cookieCount -= multiplierPrice;
    multiplier += 1;
    multiplierPrice = Math.floor(multiplierPrice * 1.5);
    multiplierButton.textContent = `Buy Multiplier (${multiplierPrice} Cookies)`;
    updateCounter();
  }
});

prestigeButton.addEventListener("click", () => {
  if (cookieCount >= 5000) {
    prestigePoints += 1;
    cookieCount = 0;
    autoClickerPrice = 50;
    multiplierPrice = 100;
    multiplier = 1;
    achievements = [];
    achievementsList.innerHTML = "";
    autoClickerButton.textContent = `Buy Auto-Clicker (50 Cookies)`;
    multiplierButton.textContent = `Buy Multiplier (100 Cookies)`;
    updateCounter();
  }
});

setInterval(spawnGoldenCookie, 10000);
setInterval(spawnSnowflake, 300);
setInterval(startSnowstorm, 500);

updateCounter();
