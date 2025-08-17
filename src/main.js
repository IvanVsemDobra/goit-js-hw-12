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

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
const per_page = 15;
let totalHits = 0;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  query = event.target.query.value.trim();
  if (!query) {
    iziToast.error({ message: "Введіть пошуковий запит" });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, per_page);
    totalHits = data.totalHits;

    if (totalHits === 0) {
      iziToast.error({ message: "Нічого не знайдено" });
      return;
    }

    createGallery(data.hits);

    if (totalHits > per_page) {
      showLoadMoreButton();
    } else {
      iziToast.info({ message: "Ви досягли кінця результатів пошуку" });
    }
  } catch (error) {
    iziToast.error({ message: "Сталася помилка. Спробуйте ще раз." });
  } finally {
    hideLoader();
    form.reset();
  }
}

async function onLoadMore() {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, per_page);
    createGallery(data.hits);
    smoothScroll();

    const alreadyLoaded = page * per_page;
    if (alreadyLoaded < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({ message: "Ви досягли кінця результатів пошуку" });
    }
  } catch (error) {
    iziToast.error({ message: "Сталася помилка. Спробуйте ще раз." });
  } finally {
    hideLoader();
  }
}
