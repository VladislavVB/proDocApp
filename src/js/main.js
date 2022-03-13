let allPhotoData = [];
let userList = [];
let userAlbums = [];
let userPhoto = [];
let userFavorit = [];
let userFavoritCopy = [];

const body = document.querySelector("body");
const photoItemStar = document.querySelectorAll(".photo__item-star");
const catalogPageLink = document.querySelector(".catalog__link");
const favoritPageLink = document.querySelector(".favorit__link");
const catalogPage = document.querySelector(".catalog__page");
const favoritPage = document.querySelector(".favorit__page");
const catalogList = document.querySelector(".catalog__list");
const catalogModalBg = document.querySelector(".catalog__modal-bg");

//переход по "страницам"
catalogPageLink.onclick = () => {
  favoritPage.classList.remove("active");
  favoritPageLink.classList.remove("active");
  catalogPageLink.classList.add("active");
  catalogPage.classList.add("active");
  printFirstStep();
};
favoritPageLink.onclick = () => {
  catalogPage.classList.remove("active");
  catalogPageLink.classList.remove("active");
  favoritPageLink.classList.add("active");
  favoritPage.classList.add("active");
  favortPrint();
};

//отрисовка пользователей
const printFirstStep = () => {
  catalogList.innerHTML = ' <img class="loader" src="img/loader.gif" alt="">';
  fetch("https://json.medrating.org/users/")
    .then((response) => {
      return response.json();
    })
    .then((dataUser) => {
      userList = dataUser;
      catalogList.innerHTML = "";
      for (let i = 0; i < userList.length; i++) {
        catalogList.innerHTML += `
        <li onclick=printSecondStep(${userList[i].id})>
          <div class="catalog__line catalog__line-level-one">
            <button class="catalog__list-btn"></button>
            <h6 class="catalog__line-name">${userList[i].name}</h6>
          </div>
          <ul  class="catalog__line-body catalog__line-level-one-body">
            <img class="loader" src="img/loader.gif" alt="">
          </ul>
        </li>
      `;
      }
    })
    .catch(() => {
      catalogList.innerHTML = ` 
      <div class="error" ><img class="loader" src="img/error.png" alt="">
        <div class="error__descp">
          <h3>Сервер не отвечает </h3>
          <p>Уже работаем над этим</p>
        </div>
      </div>
    `;
    });
};
printFirstStep();

//отрисовка альбомов
const printSecondStep = (index) => {
  const levelOneBody = document.querySelectorAll(
    ".catalog__line-level-one-body"
  );
  stepOne(index);
  fetch(`https://json.medrating.org/albums?userId=${userList[index - 1].id}`)
    .then((response) => {
      levelOneBody[
        index - 1
      ].innerHTML = `<img class="loader loader__absolut" src="img/loader.gif" alt="">`;
      return response.json();
    })
    .then((dataAlbums) => {
      userAlbums = dataAlbums;
      levelOneBody[index - 1].innerHTML = "";
      for (let i = 0; i < userAlbums.length; i++) {
        let f = String(index) + String(i + 1);
        levelOneBody[index - 1].innerHTML += `
        <li onclick='printThirdStep(${index}, ${
          i + 1
        }, event.stopPropagation())'>
          <div id='f${f}' class="catalog__line catalog__line-level-two">
            <button class="catalog__list-btn"></button>
            <h5 class="catalog__line-album">
              ${userAlbums[i].title}
            </h5>
          </div>
          <ul id='ff${f}' class="catalog__line-body catalog__line-level-two-body">
          <img class="loader" src="img/loader.gif" alt="">
          </ul>
        </li>
          `;
      }
    })
    .catch(() => {
      levelOneBody[index - 1].innerHTML = `
        <div class="error error__level"><img class="loader" src="img/error.png" alt="">
          <div class="error__descp">
            <h3>Сервер не отвечает </h3>
            <p>Уже работаем над этим</p>
          </div>
        </div>
        `;
    });
};

//отрисовка фоток
const printThirdStep = (index, j) => {
  let str = String(index) + String(j);
  const levelTwoBody = document.querySelector(`#ff${str}`);
  stepTwo(index, j);
  fetch(`https://json.medrating.org/photos?albumId=${(index - 1) * 10 + j}`)
    .then((response) => {
      levelTwoBody.innerHTML = `<img class="loader loader__absolut" src="img/loader.gif" alt="">`;
      return response.json();
    })
    .then((dataPhoto) => {
      userPhoto = dataPhoto;
      levelTwoBody.innerHTML = "";
      for (let i = 0; i < userPhoto.length; i++) {
        allPhotoData.push(userPhoto[i]);
        levelTwoBody.innerHTML += `
          <li onclick="event.stopPropagation()" class="photo__item">
            <div 
              onclick="myFavotit(${userPhoto[i].id}, image${userPhoto[i].id})"
              class="photo__item-star"
              >
              <img
                src="img/star_active.png"
                alt=""
              />
              <img
                src="img/star_empty.png"
                alt=""
              />
            </div>
            <img
              id="image${userPhoto[i].id}"
              onclick="openModal('${userPhoto[i].url}')"
              title="${userPhoto[i].title}"
              class="photo__item-img"
              src="${userPhoto[i].thumbnailUrl}"
              alt=""
            />
          </li>
        `;
      }
      const favoritPhoto = JSON.parse(localStorage.getItem("favorit"));
      if (favoritPhoto) {
        for (let i = 0; i < favoritPhoto.length; i++) {
          const imageStar = document.querySelector(
            `#image${favoritPhoto[i].id}`
          );

          if (imageStar) {
            imageStar.parentNode.firstElementChild.classList.add("active");
          }
        }
      }
    })
    .catch(() => {
      console.log("Ошибка");
      levelTwoBody.innerHTML = `
          <div class="error error__level"><img class="loader" src="img/error.png" alt="">
            <div class="error__descp">
              <h3>Сервер не отвечает </h3>
              <p>Уже работаем над этим</p>
            </div>
          </div>
        `;
    });
};

//разворачивание первого уровня
const stepOne = (index) => {
  const catalogLineFirst = document.querySelectorAll(
    ".catalog__line-level-one"
  );
  const catalogLineBodyFirst = document.querySelectorAll(
    ".catalog__line-level-one-body"
  );
  catalogLineFirst[index - 1].classList.toggle("active");
  catalogLineBodyFirst[index - 1].classList.toggle("active");
};

//разворачивание второго уровня
const stepTwo = (index, j) => {
  let f = String(index) + String(j);
  const catalogLineSecond = document.querySelector(`#f${f}`);
  const catalogLineBodySecond = document.querySelector(`#ff${f}`);
  catalogLineSecond.classList.toggle("active");
  catalogLineBodySecond.classList.toggle("active");
};

//модалка
const openModal = (url) => {
  console.log(url);
  catalogModalBg.innerHTML = `
      <div onclick="closeModal()" class="catalog__modal-bg-close"><img src="img/close.png" alt=""></div>
      <div onclick="event.stopPropagation()" class="catalog__modal-img"><img src="${url}" alt=""></div>
      `;
  body.classList.add("active");
  catalogModalBg.classList.add("active");
};

const closeModal = () => {
  catalogModalBg.innerHTML = "";
  body.classList.remove("active");
  catalogModalBg.classList.remove("active");
};

//добавление & удаление из избранного
const myFavotit = (index, elem) => {
  let i;
  const itemPhoto = elem.parentNode.firstElementChild;

  allPhotoData.flat().forEach((el, j) => {
    if (el.id === index) {
      i = j;
    }
  });

  if (itemPhoto.classList.contains("active")) {
    itemPhoto.classList.toggle("active");
    userFavorit.forEach((el, i) => {
      if (el.id === index) {
        userFavorit.splice(i, 1);
      }
    });
  } else {
    itemPhoto.classList.toggle("active");
    userFavorit.push(allPhotoData[i]);
  }

  userFavoritCopy = JSON.stringify(userFavorit);
  localStorage.setItem("favorit", userFavoritCopy);
};

//отрисовка избраного
const favortPrint = () => {
  const favoritList = document.querySelector(".favorit__list");
  userFavorit = JSON.parse(localStorage.getItem("favorit"));
  if (userFavorit != null && userFavorit.length > 0) {
    favoritList.innerHTML = "";
    favoritList.classList.add("active");
    for (let i = 0; i < userFavorit.length; i++) {
      favoritList.innerHTML += `
        <div class="favorit__item">
          <img onclick="removeFavorit(${i})" class="favorit__item-star" src="img/star_active.png" alt="" />
          <img  onclick="openModal('${userFavorit[i].url}')" title="${userFavorit[i].title}" class="favorit__item-img" src="${userFavorit[i].thumbnailUrl}" alt="" />
          <div class="favorit__item-descp">
            <h3 class="favorit__item-title">
            ${userFavorit[i].title}
            </h3>
          </div>
        </div>
      `;
    }
  } else {
    userFavorit = [];
    favoritList.classList.remove("active");
    favoritList.innerHTML = `
    <div class="favorit__list-zero">
        <img src="img/empty.png" alt="">
        <h4>Список избранного пуст</h4>
        <p>Добавляйте изображения, нажимая на звездочки</p>
      </div>
    `;
  }
};

//удаление в избраном
const removeFavorit = (i) => {
  userFavorit.splice(i, 1);
  userFavoritCopy = JSON.stringify(userFavorit);
  localStorage.setItem("favorit", userFavoritCopy);
  favortPrint();
};