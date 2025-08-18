import { getImagesByQuery } from "./js/pixabay-api";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  smoothScroll,
} from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
const perPage = 15;
let totalHits = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: "Увага",
      message: "Введіть пошуковий запит!",
      position: "topRight",
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: "Немає результатів",
        message: "Спробуйте інший запит.",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);

    if (page * perPage < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: "Кінець результатів",
        message: "Більше зображень немає.",
        position: "topRight",
      });
    }
  } catch (error) {
    iziToast.error({
      title: "Помилка",
      message: "Не вдалося завантажити зображення.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, perPage);
    createGallery(data.hits);
    smoothScroll();

    if (page * perPage < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: "Кінець результатів",
        message: "Всі зображення вже завантажені.",
        position: "topRight",
      });
    }
  } catch (error) {
    iziToast.error({
      title: "Помилка",
      message: "Не вдалося завантажити додаткові зображення.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});