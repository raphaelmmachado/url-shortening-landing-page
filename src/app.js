const hamburgerButton = document.querySelector("[data-hamburger]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const input = document.querySelector("[data-input]");
const button_send = document.querySelector("[data-button]");
const alertParagraph = document.querySelector("[data-alert-paragraph]");
const linkWrapper = document.querySelector("[data-link-wrapper]");
const log = (element) => console.log(element);

const parse = JSON.parse(localStorage.getItem("links"));
log(parse);
let arrayOfHtmlElements = [];

const openMobileMenu = () => {
  mobileMenu.classList.toggle("hidden");
};

const hideMobileMenuOnResize = () => {
  const width = window.innerWidth;
  if (width > 768) {
    hamburgerButton.classList.add("hidden");
    mobileMenu.classList.add("hidden");
  } else {
    hamburgerButton.classList.remove("hidden");
  }
};

const checkIfInputIsEmpty = () => {
  const outline = "outline";
  const outlineRed = "outline-sec-red";
  const outlineDark = "outline-pri-dk_viol";
  let isEmpty = false;
  if (!input.value) {
    addInputOutline(outline, outlineRed);
    isEmpty = true;
  } else {
    resetInputOutline(outline, outlineRed);
    addInputOutline(outline, outlineDark);
    isEmpty = false;
  }
  return isEmpty;
};
const addInputOutline = (outline, outlineColor) => {
  input.classList.add(outline, outlineColor);
};
const resetInputOutline = (outline, outlineColor) => {
  input.classList.remove(outline, outlineColor);
  hideAlert(alertParagraph);
};
const showAlert = (el) => el.classList.remove("hidden");
const hideAlert = (el) => el.classList.add("hidden");

const shortenLink = () => {
  let link = input.value;

  if (checkIfInputIsEmpty()) {
    showAlert(alertParagraph);
    return;
  }
  if (!link.includes(".")) {
    resetInputOutline("outline", "outline-pri-dk_viol");
    addInputOutline("outline", "outline-sec-red");
    showAlert(alertParagraph);
    return;
  }
  request(link)
    .then((shortLink) => {
      append(link, shortLink);
    })
    .catch((e) => console.error(e));
  input.value = "";
};
const request = async (link) => {
  const url = `https://api.shrtco.de/v2/shorten?url=${link}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.result.short_link;
  } catch (e) {
    console.log(e);
  }
};
const append = (text, short) => {
  if (arrayOfHtmlElements.length < 3) {
    arrayOfHtmlElements.unshift({ text: text, short: short });
  } else {
    arrayOfHtmlElements.pop();
    arrayOfHtmlElements.unshift({ text: text, short: short });
  }

  const template = arrayOfHtmlElements
    .map((i) => {
      return `<div class="flex flex-col justify-evenly md:flex-row
  items-stretch md:items-center md:justify-between p-5 m-4
   md:mx-14 rounded-md bg-neutral-gray
    bg-opacity-30 gap-4">
         <p class="truncate text-center md:text-end" data-link>${i.text}</p>
         <div class="flex md:flex-row flex-col md:items-center gap-4">
             <p class="text-pri-cyan text-center md:text-end ">${i.short}</p>
             <button class="bg-pri-cyan px-6 py-2 text-slate-50 font-semibold
              rounded-md hover:opacity-90" data-clicked="false" data-copy-button>Copy</button>
         </div>
     </div>`;
    })
    .join("");

  saveToStorage(template);
  linkWrapper.innerHTML = template;
  const button_copy = document.querySelectorAll("[data-copy-button]");
  button_copy.forEach((button) => {
    button.addEventListener("click", copyLink);
  });
};
const saveToStorage = (array) => {
  localStorage.setItem("links", JSON.stringify(array));
};
const copyLink = (e) => {
  const button_copy = document.querySelectorAll("[data-copy-button]");
  resetButtonStyle(button_copy);
  const button = e.target;
  if (() => buttonIsClicked(button)) {
    changeButtonStyle(button);
  } else {
    return;
  }
  copyShortenedLink(button);
};

const changeButtonStyle = (button) => {
  const backGroundViolet = "bg-pri-dk_viol";
  const backGroundCyan = "bg-pri-cyan";
  button.textContent = "Copied!";
  button.classList.add(backGroundViolet);
  button.classList.remove(backGroundCyan);
};

const buttonIsClicked = (button) => {
  let clicked = (button.dataset.clicked = "true");
  return Boolean(clicked);
};
const resetButtonStyle = (buttons) => {
  buttons.forEach((button) => {
    if (Boolean(button.dataset.clicked)) {
      button.dataset.clicked = "false";
      const backGroundViolet = "bg-pri-dk_viol";
      const backGroundCyan = "bg-pri-cyan";
      button.textContent = "Copy";
      button.classList.add(backGroundCyan);
      button.classList.remove(backGroundViolet);
    }
  });
};
const copyShortenedLink = (button) => {
  const shortLink = button.parentElement.children[0].innerText;
  navigator.clipboard.writeText(shortLink);
};

window.addEventListener("resize", hideMobileMenuOnResize);
hamburgerButton.addEventListener("click", openMobileMenu);
input.addEventListener("keypress", () =>
  resetInputOutline("outline", "outline-sec-red")
);
button_send.addEventListener("click", shortenLink);
