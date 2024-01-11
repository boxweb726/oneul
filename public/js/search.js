import USER from './config.js'



/*   TMDB Render   */ 
const TMDB = {
    // 검색결과 랜더링
    searchRender : function(data, category){
        const searchIntroTitle = document.querySelector(".search_intro .title");
        const searchListWrap = document.querySelector(".search_list_wrap");
        const movieSwiper = document.querySelector(`[data-category=movie]`)
        const tvSwiper = document.querySelector(`[data-category=tv]`);
        const movieSwiperWrap = movieSwiper.querySelector(`.swiper-wrapper`)
        const tvSwiperWrap = tvSwiper.querySelector(`.swiper-wrapper`);
        const rankWrap = document.querySelector(".search_rank_wrap");


        // 이미지가 없을시 예외처리
        let filterData = data.results.filter((item) => item.poster_path != null)

        // 인기순 sort
        filterData = filterData.sort(function(a, b){
            let dataA = a.popularity;
            let dataB = b.popularity;

            if(dataA > dataB) return -1;
            if(dataA === dataB) return 0;
            if(dataA < dataB) return 1;
        })

        // 검색결과 예외처리
        if(filterData.length >= 1){
            // 결과 있을 시
            searchListWrap.style.display = "block";
            searchIntroTitle.style.display = "none";
            movieSwiperWrap.innerHTML = "";
            tvSwiperWrap.innerHTML = "";

            // 랜더링
            filterData.forEach(item => {
                let html = `
                    <li class="swiper-slide item" data-id="${item.id}" data-genre-id=${item.genre_ids} data-type=${item.media_type}>
                        <a href="/detail.html?id=${item.id}&type=${item.media_type}" name="${item.media_type == "movie" ? item.title : item.name}" class="btn_link" title="${item.media_type == "movie" ? item.title : item.name} 상세 페이지로 이동">
                            <div class="img_box">
                                <img src="https://www.themoviedb.org/t/p/w220_and_h330_face/${item.poster_path}" alt="${item.media_type == "movie" ? item.title : item.name} 포스터">
                            </div>
                            <div class="text_box">
                                <p class="title">${item.media_type == "movie" ? item.title : item.name} </p>
                                <p class="date">${item.media_type == "movie" ? item.release_date : item.first_air_date}</p>
                            </div>
                        <a>
                    </li>
                `;
                // type에 따라 카테고리 분류
                let curSwiper = item.media_type == "movie" ? movieSwiperWrap : tvSwiperWrap;
                curSwiper.insertAdjacentHTML("beforeend", html);
            });

            // 스와이퍼 업데이트
            searchJS.searchSwiper.forEach((item, idx)=> {
                searchJS.searchSwiper[idx].update();

                // 카테고리에 검색결과 없을시 예외처리
                movieSwiperWrap.childNodes.length != 0 ? movieSwiper.style.display = 'block' : movieSwiper.style.display = 'none';
                tvSwiperWrap.childNodes.length != 0 ? tvSwiper.style.display = 'block' : tvSwiper.style.display = 'none';
            });

            searchJS.setWordEvt();
            rankWrap.style.display = "none";
        }else{
            // 결과 없을 시
            searchListWrap.style.display = "none";
            searchIntroTitle.style.display = "block";
            searchIntroTitle.innerHTML = "검색결과가 없습니다."
            rankWrap.style.display = "none";
        }
    },
    // 오늘의 트렌드 랜더링
    trendRender : function(data){
        const rankWrap = document.querySelector(".search_rank_wrap");

        data.results.forEach((item, idx) => {
            // 10위까지만 랜더링
            if(idx < 10){
                let html = `
                    <li class="item">
                        <a href="/detail.html?id=${item.id}&type=${item.media_type}" name="${item.media_type == "movie" ? item.title : item.name}" class="btn_link" title="${item.media_type == "movie" ? item.title : item.name} 상세 페이지로 이동">
                            <span class="num">${idx + 1}</span>
                            <span class="name">${item.media_type == "movie" ? item.title : item.name}</span>
                        </a>
                    </li>
                `
                rankWrap.insertAdjacentHTML("beforeend", html);
            }
        })
        searchJS.setWordEvt();

    }
}

/*   API   */ 
const callAPI = {
    // 옵션
    options : {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: USER.Authorization
        }
    },
    //  검색 조회
    searchApi : function(value){
        fetch(`${USER.BASEURL}/search/multi?query=${value}&adult=false&${USER.LANGUAGE}&page=1`,callAPI.options)
        .then(data => data.json())
        .then(data => {
            TMDB.searchRender(data);
        })
        .catch(err => console.error(err));
    },
    //  검색 조회
    trendApi : function(){
        fetch(`${USER.BASEURL}/trending/all/day?${USER.LANGUAGE}`,callAPI.options)
        .then(data => data.json())
        .then(data => {
            TMDB.trendRender(data);
        })
        .catch(err => console.error(err));
    },
}
callAPI.trendApi();

 /*   JS   */ 
const searchJS = {
    searchSwiper : "",
    // 스와이퍼 이벤트 
    swiperEvt : function(){
        searchJS.searchSwiper = new Swiper(".swiper-container.searchSwiper", {
            slidesPerView: "auto",
        });
    },
    //  검색이벤트
    searchEvt : function(){
        const input = document.querySelector("#search_input");

        input.addEventListener("keydown", function(e){
            let value = this.value;

            // 엔터키 조건부 실헹
            if(e.keyCode === 13) {
                if(value != undefined && value != "") callAPI.searchApi(value);
            }
        });
    },
    //  검색 타이핑 이벤트
    searchTypingEvt : function(value){
        const input = document.querySelector("#search_input");
        const btnReset = document.querySelector(".btn_reset");
        // 타이핑 시 리셋버튼 활성화
        input.addEventListener("input", function(){
            let value = this.value;

            if(value?.length >= 1){
                btnReset.style.display = "block";
            }else{
                btnReset.style.display = "none";
            }  
        })
    },
    //  검색인풋 리셋 이벤트
    searchResetEvt : function(){
        const saerchInput = document.querySelector("#search_input");
        const btnReset = document.querySelector(".btn_reset");
        const searchIntroTitle = document.querySelector(".search_intro .title");
        const searchListWrap = document.querySelector(".search_list_wrap");

        btnReset?.addEventListener("click", () => {
            saerchInput.value = "";
            btnReset.style.display = "none";
            searchListWrap.style.display = "none";
            searchIntroTitle.style.display = "block";
            searchIntroTitle.innerHTML = "어떤 작품을 찾으세요?";
        })
    },
     //  최근 본 영화 저장
    setWordEvt : function(){
        const btnLink = document.querySelectorAll('.btn_link');
        let storage = window.localStorage.getItem("movie");
        // 스토리지 빈값일때 예외처리
        storage = storage != null ? JSON.parse(storage) : [];
        btnLink.forEach((el, idx) => {
            btnLink[idx].addEventListener('click', function(e){
                // 언쉬프트로 최신순으로 데이터 저장
                storage.unshift(this.getAttribute('name'));
                // new Set 으로 중복제거 후 객체반환 => 레스트파라미터로 배열처리
                let nameArr = [...new Set(storage)];
                nameArr = JSON.stringify(nameArr);
                window.localStorage.setItem("movie", nameArr);
            });
        });
    },
    //  최근 본 영화 랜더링
    getWordEvt : function(){
        const wordWarp = document.querySelector(".search_word");
        const wordList = document.querySelector(".word_list");

        let storage = window.localStorage.getItem("movie");
        storage = JSON.parse(storage);
        let nameArr = [...new Set(storage)];

        wordList.innerHTML = "";
        // 최근 본 컨텐츠 랜더링
        nameArr.forEach((el, idx) => {
            let html = `
                <li class="word">
                    <span>${el}</span>
                    <button class="btn_delete" data-name="${el}" title="${el} 삭제하기"></button>
                </li>
            `;
            wordList.insertAdjacentHTML("beforeend", html);
        });

        const btnDelete = document.querySelectorAll('.btn_delete');

        // 최근 본 컨텐츠 삭제버튼
        btnDelete.forEach((el, idx) => {
            btnDelete[idx].addEventListener('click', function(){
                let curName = this.getAttribute('data-name');
                this.parentNode.style.display = "none"; 

                nameArr = nameArr.filter((el) => el != curName);
                let arrString = JSON.stringify(nameArr);
                window.localStorage.setItem("movie", arrString);

                if(nameArr == "") wordWarp.style.display = 'none';
            });
        });

        if(btnDelete.length == 0) wordWarp.style.display = 'none';
    },
    init : function(){
        this.swiperEvt();
        this.searchEvt();
        this.searchTypingEvt();
        this.searchResetEvt();
        this.getWordEvt();
    }
}
searchJS.init();

// bfcache이슈, 최근본 검색어 예외처리
window.addEventListener('pagehide', (event) => {
    if (event.persisted === true) searchJS.getWordEvt();
  });