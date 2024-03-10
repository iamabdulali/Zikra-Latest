// Stopwatch

let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let resetBtn = document.getElementById("reset");

let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let startTime = "";
let endTime = "";
let totalTime = "";
let hasTimerRan = false;

startBtn.addEventListener("click", function () {
  timer = true;
  stopWatch();
});

stopBtn.addEventListener("click", function () {
  timer = false;
});

resetBtn.addEventListener("click", function () {
  timer = false;
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  document.getElementById("hr").innerHTML = "00";
  document.getElementById("min").innerHTML = "00";
  document.getElementById("sec").innerHTML = "00";
  document.getElementById("count").innerHTML = "00";
});

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
      second = 0;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("hr").innerHTML = hrString;
    document.getElementById("min").innerHTML = minString;
    document.getElementById("sec").innerHTML = secString;
    document.getElementById("count").innerHTML = countString;
    setTimeout(stopWatch, 10);
  }
}

const paraDropdown = document.querySelector("#para-select");
const ayatNumber = document.querySelector(".ayat-number"); // Ayat number element
const suratName = document.querySelector(".surat-name"); // Surat name element
const crossBtn = document.querySelector(".cross-symbol"); // Cross button
const popUp = document.querySelector(".popup"); // Popup element
const overlay = document.querySelector(".overlay"); // Overlay element
const paraNumber = document.querySelector("#dynamic-dropdown-ruba"); // Paragraph number element
const submitBtn = document.querySelector("#btn");
const lesson = document.querySelector(".sabaq-number");
const lessonDiv = document.querySelector(".sabaq-ruku-div");
const rukuLesson = document.querySelector(".rukuh-number");
var paraSelectDropdown = document.getElementById("para-select");
var surahSelectDropdown = document.getElementById("surah-select");
var rubaDropdown = document.getElementById("dynamic-dropdown-ruba");
var nisfDropdown = document.getElementById("dynamic-dropdown-nisf");
var rukuDropdown = document.getElementById("dynamic-dropdown-ruku");
var sabaqRubaDropdown = document.querySelector("#sabaq-ruba");

var requestUrl = "";
let currentActive = 0;
let input;

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    overlay.style.display = "block";
    popUp.style.display = "flex";
  }
});

sabaqRubaDropdown.addEventListener("change", () => {
  switch (sabaqRubaDropdown.value) {
    case "ruba":
      rubaDropdown.style.display = "block";
      paraSelectDropdown.parentElement.style.display = "block";
      nisfDropdown.style.display = "none";
      rukuDropdown.style.display = "none";
      surahSelectDropdown.parentElement.style.display = "none";
      break;
    case "nisf":
      rubaDropdown.style.display = "none";
      rukuDropdown.style.display = "none";
      surahSelectDropdown.parentElement.style.display = "none";
      nisfDropdown.style.display = "block";
      paraSelectDropdown.parentElement.style.display = "block";
      break;
    case "rukuh":
      rubaDropdown.style.display = "none";
      paraSelectDropdown.parentElement.style.display = "none";
      nisfDropdown.style.display = "none";
      rukuDropdown.style.display = "block";
      surahSelectDropdown.parentElement.style.display = "block";
      break;
    default:
      // Handle default case if needed
      break;
  }
});

// Close popup and overlay
function closePopandOverlay() {
  overlay.style.display = "none";
  popUp.style.display = "none";
}

// Event listener for cross button click
crossBtn.addEventListener("click", () => {
  closePopandOverlay();
});

// Event listener when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  overlay.style.display = "block";
  popUp.style.display = "flex";
});

// Event listener for overlay click
overlay.addEventListener("click", () => {
  closePopandOverlay();
});

for (let i = 1; i <= 30; i++) {
  const option = document.createElement("option");

  option.value = i;
  option.textContent = i;

  paraDropdown.append(option);
}

for (let i = 1; i <= 114; i++) {
  const option = document.createElement("option");

  option.value = i;
  option.textContent = i;

  surahSelectDropdown.append(option);
}

function getRukuLength(surahNo) {
  var length;
  fetch(`http://localhost:3000/rukuh?surahNo=${surahNo}`)
    .then((response) => response.json())
    .then((data) => {
      length = data.length;
      rukuDropdown.innerHTML = "";
      for (let i = 1; i <= length; i++) {
        const option = document.createElement("option");

        option.value = i;
        option.textContent = i;

        rukuDropdown.append(option);
      }
    });
}

surahSelectDropdown.addEventListener("change", () => {
  var length;
  const surahNo = document.querySelector("#surah-select").value;
  fetch(`http://localhost:3000/rukuh?surahNo=${surahNo}`)
    .then((response) => response.json())
    .then((data) => {
      length = data.length;
      rukuDropdown.innerHTML = "";
      for (let i = 1; i <= length; i++) {
        const option = document.createElement("option");

        option.value = i;
        option.textContent = i;

        rukuDropdown.append(option);
      }
    });
});

let activeIndex = 0;
let divisionType = "";

submitBtn.addEventListener("click", (event) => {
  const filteredDataDiv = document.querySelector(".content-div");

  currentActive = 0;
  let wordsArray = [];
  let surahNames = [];
  let ayahNumber = [];
  let resultArray = [];
  let rukuhNoArray = [];
  filteredDataDiv.innerHTML = "";
  suratName.textContent = ``;
  ayatNumber.textContent = ``;
  let parahNo = document.querySelector("#para-select").value;
  let rubaNo = document.querySelector("#dynamic-dropdown-ruba").value;
  let nisfNo = document.querySelector("#dynamic-dropdown-nisf").value;
  let rukuhNo = document.querySelector("#dynamic-dropdown-ruku").value;
  let surahNo = document.querySelector("#surah-select").value;

  if (sabaqRubaDropdown.value === "ruba") {
    divisionType = "ruba";
    requestUrl = `http://localhost:3000/ruba?parahNo=${parahNo}&rubaNo=${rubaNo}`;
    lesson.textContent = `ربع  :  ${rubaNo} `;
  } else if (sabaqRubaDropdown.value === "nisf") {
    divisionType = "nisf";
    requestUrl = `http://localhost:3000/nisf?parahNo=${parahNo}&nisfNo=${nisfNo}`;
    lesson.textContent = `نصف : ${nisfNo}`;
  } else if (sabaqRubaDropdown.value === "rukuh") {
    divisionType = "rukuh";
    requestUrl = `http://localhost:3000/rukuh?surahNo=${surahNo}&rukuNo=${rukuhNo}`;
    lesson.textContent = `رکوع : ${rukuhNo}`;
    rukuLesson.style.display = "none";
    lessonDiv.style.left = "-20em";
    suratName.style.top = "38%";
  }

  function makeRequest(requestUrl) {
    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === "object" && Array.isArray(data)) {
          // Handle response as an array of objects
          data.map((item) => {
            input = item.ayahNo;
          });
          // Further processing specific to array of objects
        } else if (typeof data === "object") {
          // Handle response as plain text
          input = data.ayahNo;
          // Further processing specific to plain text
        } else {
          // Handle unexpected response type
          console.log("Unexpected response type:", typeof data);
        }

        // Extract the input value from the response data
        fetch(`http://localhost:3000/data?input=${input}`)
          .then((response) => response.json())
          .then((data) => {
            data.map((item) => {
              const surahName = item.surahName;
              const ayahNo = item.ayahNo;
              const ayahText = item.ayahText;
              const rukuhNo = item.rukuhNo;
              wordsArray = ayahText.split(/\s(?![ًٌٍَُِّْٰۖۗۘۙۚۛۜ۩])/);
              ayahNumber.push(ayahNo);
              surahNames.push(surahName);
              rukuhNoArray.push(rukuhNo);
              appendAyah(wordsArray, ayahNo, filteredDataDiv);
              closePopandOverlay();
            });

            const ayahResult = getRanges(ayahNumber);

            for (const item of ayahResult) {
              const { start, end } = item;
              for (let i = start; i <= end; i++) {
                resultArray.push(`${start}-${end}`);
              }
            }

            if (surahNames.length > 0) {
              suratName.textContent = `${surahNames[0]} :`;
              ayatNumber.textContent = `(${resultArray[0]})`;
              rukuLesson.textContent = `(رکوع : ${rukuhNoArray[0]})`;
            }

            var chunks = document.querySelectorAll(".chunk");
            // chunks[0].classList.add("active");
            moveIndex(chunks, surahNames, resultArray, rukuhNoArray);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }

  makeRequest(requestUrl);

  document.addEventListener("keyup", (e) => {
    if (e.keyCode == 78) {
      currentActive = 1;
      wordsArray = [];
      surahNames = [];
      ayahNumber = [];
      resultArray = [];
      rukuhNoArray = [];
      parahNo = parseInt(parahNo);
      surahNo = parseInt(surahNo);
      rubaNo = parseInt(rubaNo);
      nisfNo = parseInt(nisfNo);
      rukuhNo = parseInt(rukuhNo);

      filteredDataDiv.innerHTML = "";

      if (divisionType == "ruba") {
        if (rubaNo < 4) {
          // Increment rubaNo by 1
          rubaNo = rubaNo + 1;
        } else if (parahNo < 30) {
          parahNo = parahNo + 1;
          rubaNo = 1;
        }
        lesson.textContent = `ربع : ${rubaNo}`;
        requestUrl = `http://localhost:3000/ruba?parahNo=${parahNo}&rubaNo=${rubaNo}`;
        console.log(requestUrl);
      } else if (divisionType == "nisf" && nisfNo <= 2) {
        if (nisfNo < 2) {
          nisfNo = nisfNo + 1;
        } else if (parahNo < 30) {
          parahNo = parahNo + 1;
          nisfNo = 1;
        }
        lesson.textContent = `نصف : ${nisfNo}`;
        requestUrl = `http://localhost:3000/nisf?parahNo=${parahNo}&nisfNo=${nisfNo}`;
        console.log(requestUrl);
      } else if (divisionType == "rukuh") {
        const length = document.querySelector("#dynamic-dropdown-ruku").length;

        if (rukuhNo < length) {
          rukuhNo = rukuhNo + 1;
        } else if (surahNo < 114) {
          surahNo = surahNo + 1;
          getRukuLength(surahNo);
          rukuhNo = 1;
        }
        lesson.textContent = `رکوع : ${rukuhNo}`;
        requestUrl = `http://localhost:3000/rukuh?surahNo=${surahNo}&rukuNo=${rukuhNo}`;
        console.log(requestUrl);
      }

      makeRequest(requestUrl);
    } else if (e.keyCode == 80) {
      currentActive = 1;
      wordsArray = [];
      surahNames = [];
      ayahNumber = [];
      resultArray = [];
      rukuhNoArray = [];
      rubaNo = parseInt(rubaNo);
      nisfNo = parseInt(nisfNo);
      rukuhNo = parseInt(rukuhNo);

      filteredDataDiv.innerHTML = "";

      if (divisionType == "ruba") {
        if (rubaNo > 1) {
          rubaNo = rubaNo - 1;
        } else if (parahNo > 1) {
          parahNo = parahNo - 1;
          rubaNo = 4;
        }
        lesson.textContent = `ربع : ${rubaNo}`;
        requestUrl = `http://localhost:3000/ruba?parahNo=${parahNo}&rubaNo=${rubaNo}`;
        console.log(requestUrl);
      } else if (divisionType == "nisf") {
        if (nisfNo > 1) {
          nisfNo = nisfNo - 1;
        } else if (parahNo > 1) {
          parahNo = parahNo - 1;
          nisfNo = 2;
        }
        lesson.textContent = `نصف : ${nisfNo}`;
        requestUrl = `http://localhost:3000/nisf?parahNo=${parahNo}&nisfNo=${nisfNo}`;
        console.log(requestUrl);
      } else if (divisionType == "rukuh") {
        if (rukuhNo > 1) {
          rukuhNo = parseInt(rukuhNo) - 1;
        } else if (surahNo > 1) {
          surahNo = surahNo - 1;
          getRukuLength(surahNo);
          setTimeout(() => {
            const length = document.querySelector(
              "#dynamic-dropdown-ruku"
            ).length;
            console.log(length);
            rukuhNo = length;
          }, 2000);
        }
        lesson.textContent = `رکوع : ${rukuhNo}`;
        requestUrl = `http://localhost:3000/rukuh?surahNo=${surahNo}&rukuNo=${rukuhNo}`;
        console.log(requestUrl);
      }
      makeRequest(requestUrl);
    } else if (e.keyCode == 35) {
      var allChunks = document.querySelectorAll(".chunk");
      allChunks.forEach((chunk) => {
        chunk.classList.add("active");
        currentActive = allChunks.length;
        allChunks[allChunks.length - 1].scrollIntoView();
      });
    } else if (e.keyCode == 36) {
      var allChunks = document.querySelectorAll(".chunk");
      allChunks.forEach((chunk) => {
        chunk.classList.remove("active");
        currentActive = 1;
        allChunks[0].scrollIntoView();
        allChunks[0].classList.add("active");
      });
    }
  });
});

function appendAyah(words, ayahNumber, contentDiv) {
  words.forEach(function (word) {
    const newElem = document.createElement("span");
    newElem.innerText = word + " "; // Append each word with a space
    newElem.className = "chunk";
    contentDiv.append(newElem);
  });

  contentDiv.insertAdjacentHTML(
    "beforeend",
    `<span class = 'chunk ayahStop'> ${convertToArabicNumber(
      ayahNumber
    )}</span>`
  );
}

function convertToArabicNumber(number) {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  const numberString = number.toString();
  let arabicNumber = "";

  for (let i = 0; i < numberString.length; i++) {
    const digit = parseInt(numberString[i]);
    if (isNaN(digit)) {
      // If the character is not a valid digit, keep it as is
      arabicNumber += numberString[i];
    } else {
      // Convert the digit to Arabic numeral
      arabicNumber += arabicNumerals[digit];
    }
  }

  return arabicNumber;
}

const countSpan = document.getElementById("count");
const secSpan = document.getElementById("sec");
const minSpan = document.getElementById("min");
const hrSpan = document.getElementById("hr");

let keydownHandler;
let isFirstKeypress = true; // Flag to track the first keypress
let previousEndTime = "00:00:00:00";
function moveIndex(chunks, surahNames, ayahNumbers, rukuhNo) {
  if (keydownHandler) {
    document.body.removeEventListener("keydown", keydownHandler);
  }

  keydownHandler = (event) => {
    if (event.keyCode === 37 || event.keyCode === 32) {
      // Get the text content of each span
      const countText = countSpan.textContent.trim();
      const secText = secSpan.textContent.trim();
      const minText = minSpan.textContent.trim();
      const hrText = hrSpan.textContent.trim();
      let formattedTime = `${hrText}:${minText}:${secText}:${countText}`;
      formattedTime = formattedTime.trim();
      if (currentActive < chunks.length) {
        ayahText = currentActive++;

        // Create a data object with the variables
        const data = {
          ayahText:
            document.querySelectorAll(".chunk")[currentActive - 1].textContent,
          startTime: isFirstKeypress ? "00:00:00:00" : previousEndTime,
          endTime: formattedTime,
        };

        // Make the POST request with options
        fetch("http://localhost:3000/data-collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Response:", data);
            previousEndTime = formattedTime;
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        isFirstKeypress = false;

        update(chunks);
        updateSurahName(surahNames, ayahNumbers, rukuhNo);
      }
    }
    if (event.keyCode === 39 || event.keyCode === 80) {
      if (currentActive > 0) {
        currentActive--;
      } else {
        currentActive = 0;
      }
      update(chunks);
      updateSurahName(surahNames, ayahNumbers, rukuhNo);
    }
  };

  document.body.addEventListener("keydown", keydownHandler);
}

function update(chunks) {
  if (!hasTimerRan) {
    timer = true;
    stopWatch();
    hasTimerRan = true;
  }
  startTime = document.querySelector("#sec").textContent;
  endTime = document.querySelector("#min").textContent;
  totalTime = `${endTime} : ${startTime}`;

  chunks.forEach((circle, idx) => {
    if (idx < currentActive) {
      circle.classList.add("active");
      if (!isElementInViewport(circle)) circle.scrollIntoView(true);
    } else {
      circle.classList.remove("active");
    }
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top > 0 &&
    rect.left >= 0 &&
    rect.bottom <
      (window.innerHeight || document.documentElement.clientHeight) -
        (window.innerHeight || document.documentElement.clientHeight) * 0.18 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getRanges(arr) {
  const ranges = [];
  let startIndex = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      ranges.push({
        start: arr[startIndex],
        end: arr[i],
      });
      startIndex = i + 1;
    }
  }

  // Handle the last range
  ranges.push({
    start: arr[startIndex],
    end: arr[arr.length - 1],
  });
  return ranges;
}

function updateSurahName(array, ayahArray, rukuArray) {
  const activeAyahStops = document.querySelectorAll(".ayahStop.active");
  const numActiveAyahStops = activeAyahStops.length;

  if (numActiveAyahStops > 0) {
    suratName.textContent = `${array[numActiveAyahStops]} :`;
    ayatNumber.textContent = `(${ayahArray[numActiveAyahStops]})`;
    rukuLesson.textContent = `(رکوع : ${rukuArray[numActiveAyahStops]})`;

    if (array[numActiveAyahStops] == undefined) {
      suratName.textContent = `${array[array.length - 1]} `;
      ayatNumber.textContent = `${ayahArray[ayahArray.length - 1]}`;
      rukuLesson.textContent = `(رکوع : ${rukuArray[rukuArray.length - 1]})`;
    }
  }
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 187) {
    var el = document.querySelectorAll(".chunk");
    el.forEach((el) => {
      var style = window
        .getComputedStyle(el, null)
        .getPropertyValue("font-size");
      var fontSize = parseFloat(style);
      el.style.fontSize = fontSize + 5 + "px";
    });
  }
  // now you have a proper float for the font size (yes, it can be a float, not just an integer)
});

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 189) {
    var el = document.querySelectorAll(".chunk");
    el.forEach((el) => {
      var style = window
        .getComputedStyle(el, null)
        .getPropertyValue("font-size");
      var fontSize = parseFloat(style);
      el.style.fontSize = fontSize - 5 + "px";
    });
  }
});
