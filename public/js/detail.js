import USER from './config.js'

/*   TMDB Render   */ 
const TMDB = {
    // 영화정보 랜더링
    infoRender : function(data, type){
        const documentTitle = document.querySelector('#document_title');
        const textBox = document.querySelector(".sec_info .text_box");
        const title = document.querySelector(".sec_info .title");
        const date = document.querySelector(".sec_info .date");
        const tagList = document.querySelector(".sec_info .tag_list");
        const bg = document.querySelector(".bg_box .bg");
        const poster = document.querySelector(".poster_box img");
        const summary = document.querySelector(".summary_box .summary");
        
        // 정보 setting
        documentTitle.innerHTML = `${type == "movie" ? data.title : data.name} 상세페이지`;
        textBox.insertAdjacentHTML("afterbegin", `<span class="type">${type}</span>`);
        title.innerHTML = type == "movie" ? data.title : data.name;
        date.innerHTML = type == "movie" ? `개봉일 : ${data.release_date}` : `방영일 : ${data.first_air_date} ~ ${data.last_air_date}`;
        bg.style.background = `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data.backdrop_path}) no-repeat center / cover`;
        poster.setAttribute("src", `https://image.tmdb.org/t/p/w220_and_h330_face/${data.poster_path}`);
        poster.setAttribute("alt", `${data.name}`);
        summary.innerHTML = data.overview;
        data.genres.forEach(el => {
            let tag = `<li class="tag">#${el.name}</li>`
            tagList.insertAdjacentHTML("beforeend", tag);
        });
    },
    // 예고편 랜더링
    videoRender : function(data){
        const videoBox = document.querySelector(".video_box")
        const iframe = document.querySelector(".video_box iframe")

        //예고편 없으면 삭제 
        if(data.results.length == 0) videoBox.style.display = "none";

        // 예고편이 메인예고편이 없을때 예외처리
        if(data.results.length >= 1) iframe.setAttribute("src", `https://www.youtube.com/embed/${data.results[0].key}`);

        // 메인 예고편
        let mainVideo = data.results.forEach((el) => {
            if(el.name.indexOf("메인") != -1){
                iframe.setAttribute("src", `https://www.youtube.com/embed/${el.key}`);
            }
        })
    },
    // 배우 랜더링
    actorRender : function(data){
        let actor = data.cast;
        const actorSwiper = document.querySelector(".actor_swiper .swiper-wrapper")

        // 프로필사진 없으면 삭제
        actor = actor.filter((item) => item.profile_path != null)
        actor.forEach((el) => {
            let html = `
                    <li class="swiper-slide item">
                        <div class="img_box">
                            <img src="https://www.themoviedb.org/t/p/w138_and_h175_face${el.profile_path}" alt="${el.name}">
                        </div>
                        <div class="text_box">
                            <p class="name">${el.name}</p>
                            <p class="character">${el.character}</p>
                        </div>
                    </li>
            `;
            actorSwiper.insertAdjacentHTML("beforeend", html);
        })
        
        detailJS.actorSwiper.update();
    },
    // 추천작 랜더링
    similarRender : function(data){
        let similar = data.results;
        const similarSwiper = document.querySelector(".similar_swiper .swiper-wrapper")

        similar = similar.filter((item) => item.poster_path != null)

        // 인기순 sort
        similar = similar.sort(function(a, b){
            let dataA = a.popularity;
            let dataB = b.popularity;

            if(dataA > dataB) return -1;
            if(dataA === dataB) return 0;
            if(dataA < dataB) return 1;
        })
        similar.forEach(item => {
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
                
                similarSwiper.insertAdjacentHTML("beforeend", html);
            });
        //스와이퍼 업데이트 
        detailJS.similarSwiper.update();
        detailJS.setWordEvt();
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
    // 영화정보 조회
    infoApi : function(id, type){
        fetch(`${USER.BASEURL}/${type}/${id}?${USER.LANGUAGE}`, callAPI.options)
        .then(data => data.json())
        .then(data => {
            TMDB.infoRender(data, type);
        })
        .catch(err => {
            console.error(err)
            alert("잘못된 접근입니다.")
            window.location.href = "/search.html"

        });
    },
    // 예고편 조회
    videoApi : function(id, type){
        fetch(`${USER.BASEURL}/${type}/${id}/videos?${USER.LANGUAGE}`, callAPI.options)
        .then(data => data.json())
        .then(data => {
            TMDB.videoRender(data, type);
        })
        .catch(err => console.error(err));
    },
    // 배우 조회
    actorApi : function(id, type){
        fetch(`${USER.BASEURL}/${type}/${id}/credits?${USER.LANGUAGE}`, callAPI.options)
        .then(data => data.json())
        .then(data => {
            TMDB.actorRender(data, type);
        })
        .catch(err => console.error(err));
    },
    // 트렌드 조회
    similarApi : function(id, type){
        fetch(`${USER.BASEURL}/trending/${type}/week?${USER.LANGUAGE}`, callAPI.options)
        .then(data => data.json())
        .then(data => {
            TMDB.similarRender(data, type);
        })
        .catch(err => console.error(err));
    }
}

/*   JS   */ 
const detailJS = {
    actorSwiper : undefined,
    similarSwiper : undefined,
    
    // URL 처리
    getParameter: function() {
        // 정규식 추출
        let idRegexp = /[^0-9]/g;
        let typeRegexp = /.*.type=/g;

        let id = location.search.replace(idRegexp, "");
        let type = location.search.replace(typeRegexp, "");

        // API call
        callAPI.infoApi(id, type);
        callAPI.videoApi(id, type);
        callAPI.actorApi(id, type);
        callAPI.similarApi(id, type);
    },
    // 탭 이벤트
    tabEvt : function(){
        const btn = document.querySelectorAll(".tab_btn_wrap .btn_tab");
        const contents = document.querySelectorAll(".contents_wrap .contents");

        btn.forEach((el, idx) => {
            btn[idx].addEventListener('click', function(){
                let id = this.getAttribute("data-tab-id");

                btn.forEach(el => el.classList.remove("active"));
                contents.forEach(el => el.classList.remove("active"));

                document.querySelector(`#${id}`).classList.add("active");
                this.classList.add("active");
            });
        })
    },
    // 스와이퍼 이벤트
    swiperEvt : function(){
        detailJS.actorSwiper = new Swiper(".swiper-container.actor_swiper", {
            slidesPerView: "auto",
        });

        detailJS.similarSwiper = new Swiper(".swiper-container.similar_swiper", {
            slidesPerView: "auto",
        });
    },
    // 최근 본 영화 저장
    setWordEvt : function(){
        const btnLink = document.querySelectorAll('.btn_link');
        let storage = window.localStorage.getItem("movie");
        storage = storage != null ? JSON.parse(storage) : [];

        btnLink.forEach((el, idx) => {
            btnLink[idx].addEventListener('click', function(e){
                storage.unshift(this.getAttribute('name'));
                let nameArr = [...new Set(storage)];
                nameArr = JSON.stringify(nameArr);
                window.localStorage.setItem("movie", nameArr);
            });
        });
    },
    init : function(){
        this.getParameter();
        this.tabEvt();
        this.swiperEvt();
    },
}
detailJS.init();
