document.addEventListener("DOMContentLoaded", function(){
  const apiKey = "4440ab34848ee6aa6bd8890d39ed2b25";
  const allApiUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=ko-KR`;
  const moiveApiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=ko-KR&page=1`;
  const tvApiUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=ko-KR&page=1`;
  const comingApiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=ko-KR&page=1`;
  const options = { method: "GET", headers: { accept: "application/json" } };

    // 모든 랭킹 호출 함수
    fetch(allApiUrl, options)
    .then(response => response.json())
    .then((data) => {
      const topData = data.results;
      const allContainer = document.querySelector(".all-wrapper");
      topData.slice(0, 9).forEach((data, index) => {
        const allCard = createPopCard(data, index + 1);
        allContainer.appendChild(allCard);
      });
    })
    .catch((err) => console.error(err));

    // 영화 개봉 예정작 호출 함수
    fetch(comingApiUrl, options)
    .then(response => response.json())
    .then((data) => {
      const topData = data.results;
        const comingContainer = document.querySelector(".coming_movie");
        topData.slice(0, 2).forEach((data) => {
          const comingCard = createCommingCard(data);
          comingContainer.appendChild(comingCard);
        });
        
      console.log(topData)
    })
    .catch((err) => console.error(err));
  
    // 영화 랭킹 호출 함수
    fetch(moiveApiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        const topData = data.results;
        const movieContainer = document.querySelector(".movie-wrapper");
        topData.forEach((data) => {
          const movieCard = createCard(data);
          movieContainer.appendChild(movieCard);
        });
      })
      .catch((err) => console.error(err));
  
    // TV 랭킹 호출 함수
    fetch(tvApiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        const topData = data.results;
        const tvContainer = document.querySelector(".tv-wrapper");
        topData.forEach((data) => {
          const tvCard = createCard(data);
          tvContainer.appendChild(tvCard);
        });
      })
      .catch((err) => console.error(err));
  
    // 카드 HTML
    function createCard(data) {
      const card = document.createElement("li");
      card.classList.add("swiper-slide");
  
      card.innerHTML = `<a href="./detail.html?id=${data.id}&type=${data.media_type}" class="card_wrap">
        <div class="img">
          <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title ? data.title : data.name}">
        </div>
        <p class="title2">${data.title ? data.title : data.name}</p>
        <p class="desc">${data.overview}</p>
        <p class="average">평점 ${data.vote_average.toFixed(1)}</p>
      </a>`;
  
      return card;
    }
  
    // 인기 카드 HTML
    function createPopCard(data, ranking) {
      const card = document.createElement("li");
      card.classList.add("swiper-slide");

      card.innerHTML = `<a href="./detail.html?id=${data.id}&type=${data.media_type}" class="card_wrap">
        <p class="ranking">${ranking}</p>
        <div class="img">
          <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title ? data.title : data.name}">
        </div>
        <div class="title_wrap">
          <p class="title">${data.title ? data.title : data.name}</p>
          <p class="rating">평점 ${data.vote_average.toFixed(1)}</p>
        </div>
      </a>`;
  
      return card;
    }

    // 최신 개봉 영화 카드 HTML
    function createCommingCard(data) {
      const card = document.createElement("div");
      card.classList.add("main_banner");

      card.innerHTML = `<div class="banner">
        <div class="img">
          <img src="https://image.tmdb.org/t/p/original${data.backdrop_path}" alt="${data.title}">
        </div>
        <div class="title_wrap">
          <p class="title">${data.title}</p>
          <p class="title">${data.overview}</p>
          <p class="title">${data.release_date}</p>
        </div>
      </div>`;
  
      return card;
    }
  
      // RANKING Swiper
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
    
      // MOIVE Swiper
      const movieSwiper = new Swiper(".ranking_movie .swiper", {
        slidesPerView: 3,
        spaceBetween: 16,
        loop: true,
      });
    
      // TV Swiper
      const tvSwiper = new Swiper(".ranking_tv .swiper", {
        slidesPerView: 3,
        spaceBetween: 16,
        loop: true,
      });
  
  });