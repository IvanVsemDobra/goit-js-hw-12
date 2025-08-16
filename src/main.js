import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

const form = document.querySelector("#search-form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.target.elements["query"].value.trim();

  if (!query) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search term!",
      position: "topRight",
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.error({
        title: "Error",
        message: "Sorry, no images found. Try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);

    if (page * 15 < totalHits) {
      showLoadMoreButton();
    }
  } catch {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const totalLoaded = document.querySelectorAll(".gallery-item").length;
    if (totalLoaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: "Info",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    }

    // плавний скрол
    const { height: cardHeight } =
      document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  } catch {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});