document.addEventListener("DOMContentLoaded", function(){
  const apiKey = "4440ab34848ee6aa6bd8890d39ed2b25";
  const allApiUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=ko-KR`;
  const movieApiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=ko-KR&page=1`;
  const tvApiUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=ko-KR&page=1`;
  const comingApiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=ko-KR&page=1`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  async function fetchData(apiUrl, containerSelector, isTopData) {
    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
        
      const topData = isTopData ? data.results.slice(0, 9) : data.results;
      const container = document.querySelector(containerSelector);
        
      topData.forEach((data, index) => {
        const card = isTopData ? createCard(data, index + 1) : createCard(data);
        container.appendChild(card);
      });
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  }

  async function fetchDataBanner(apiUrl, containerSelector) {
    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
        
      const bannerData = data.results.slice(0, 1);
      const container = document.querySelector(containerSelector);
        
      bannerData.forEach((data) => {
        const card = createBanner(data);
        container.appendChild(card);
      });
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  }

  fetchData(movieApiUrl, ".movie-wrapper", false); // 영화 랭킹
  fetchData(tvApiUrl, ".tv-wrapper", false); // TV 랭킹
  fetchData(allApiUrl, ".all-wrapper", true); // 인기작 TOP 10
  fetchDataBanner(comingApiUrl, ".coming_movie"); // 인기작 TOP 10

  // 카드 HTML
  function createCard(data, ranking) {
    const card = document.createElement("li");
    card.classList.add("swiper-slide");

    const cardContent = `<a href="./detail.html?id=${data.id}&type=${data.media_type}" class="card_wrap">
        ${ranking ? `<p class="ranking">${ranking}</p>` : ''}
        <div class="img">
          <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title ? data.title : data.name}">
        </div>
        <div class="title_wrap">
          <p class="title">${data.title ? data.title : data.name}</p>
          ${ranking ? '' : `<p class="desc">${data.overview}</p>`}
          <p class="rating">평점 ${data.vote_average.toFixed(1)}</p>
        </div>
      </a>`;
  
    card.innerHTML = cardContent;
  
    return card;
  }

  function createBanner(data) {
    const card = document.createElement("div");
    card.classList.add("banner");

    const cardContent = `<a href="./detail.html?id=${data.id}&type=movie" class="banner_wrap">
        <div class="img">
          <img src="./images/home_banner.jpg" alt="${data.title ? data.title : data.name}">
        </div>
      </a>`;
  
    card.innerHTML = cardContent;
  
    return card;
  }
  
  // 랭킹 Swiper
  const allSwiper = new Swiper(".ranking_all .swiper", {
    direction: "vertical",
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
    autoHeight: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
    
  // 영화 Swiper
  const movieSwiper = new Swiper(".ranking_movie .swiper", {
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
  });
    
  // 티비 Swiper
  const tvSwiper = new Swiper(".ranking_tv .swiper", {
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
  });  
});