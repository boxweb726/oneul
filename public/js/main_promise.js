import USER from './config.js'

document.addEventListener("DOMContentLoaded", function(){
  // 각 섹션에 맞는 API URL 정의
  const allApiUrl = `${USER.BASEURL}/trending/all/day?${USER.APIKEY}&${USER.LANGUAGE}`;
  const movieApiUrl = `${USER.BASEURL}/trending/movie/day?${USER.APIKEY}&${USER.LANGUAGE}&page=1`;
  const tvApiUrl = `${USER.BASEURL}/trending/tv/day?${USER.APIKEY}&${USER.LANGUAGE}&page=1`;
  const comingApiUrl = `${USER.BASEURL}/movie/upcoming?${USER.APIKEY}&${USER.LANGUAGE}&page=1`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  // 데이터를 가져와 화면에 표시하는 함수
  async function fetchData(apiUrl, containerSelector, isTopData) {
    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      
      // 상위 데이터만 추출하거나 전체 데이터 사용
      const topData = isTopData ? data.results.slice(0, 9) : data.results;
      const container = document.querySelector(containerSelector);
      
      // 각 데이터에 대해 카드 생성 후 컨테이너에 추가
      topData.forEach((data, index) => {
        const card = isTopData ? createCard(data, index + 1) : createCard(data);
        container.appendChild(card);
      });
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  }

  // 배너 데이터를 가져와 화면에 표시하는 함수
  async function fetchDataBanner(apiUrl, containerSelector) {
    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      
      // 첫 번째 데이터만 추출
      const bannerData = data.results.slice(0, 1);
      const container = document.querySelector(containerSelector);
        
      // 배너 카드 생성 후 컨테이너에 추가
      bannerData.forEach((data) => {
        const card = createBanner(data);
        container.appendChild(card);
      });
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  }

  // 각 섹션별 데이터를 가져와서 화면에 표시
  fetchData(allApiUrl, ".all-wrapper", true); // 인기작 TOP 10
  fetchData(movieApiUrl, ".movie-wrapper", false); // 영화 랭킹
  fetchData(tvApiUrl, ".tv-wrapper", false); // TV 랭킹
  fetchDataBanner(comingApiUrl, ".coming_movie"); // 배너

  // 카드 HTML을 생성하는 함수
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

  // 배너 HTML을 생성하는 함수
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
  
  // 랭킹 Swiper 설정
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
    
  // 영화 Swiper 설정
  const movieSwiper = new Swiper(".ranking_movie .swiper", {
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
  });
    
  // 티비 Swiper 설정
  const tvSwiper = new Swiper(".ranking_tv .swiper", {
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
  });  
});