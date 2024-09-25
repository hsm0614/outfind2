$(document).ready(function () {
    // 페이지가 로드될 때 실행될 코드 작성
    if (sessionStorage.getItem('token')) {
        // 토큰이 있는 경우: 로그인 상태
        $('#login-link').hide(); // 로그인 링크 숨기기
        $('#signup-link').hide(); // 회원가입 링크 숨기기
        $('#mypage-link').show(); // 마이페이지 링크 표시
    } else {
        // 토큰이 없는 경우: 비로그인 상태
        $('#login-link').show(); // 로그인 링크 표시
        $('#signup-link').show(); // 회원가입 링크 표시
        $('#mypage-link').hide(); // 마이페이지 링크 숨기기
        $('#logout-link').hide(); // 마이페이지 링크 숨기기
    }

    // 로그아웃 버튼 클릭 시 처리
    $('#logout-link').click(function (event) {
        event.preventDefault(); // 기본 클릭 동작 막기
        sessionStorage.removeItem('token'); // localStorage에서 토큰 삭제
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('email'); // 로그인 이메일 삭제
        sessionStorage.removeItem('contractor-email')
        // 로그인 및 회원가입 링크 표시, 마이페이지 링크 숨기기
        $('#login-link').show();
        $('#signup-link').show();
        $('#mypage-link').hide();
        $('#logout-link').hide();
        // 페이지 새로고침
        window.location.href = '/';
    });
});
$(document).ready(function () {
    $('#category-dropdown').change(function () {
        var selectedCategory = $(this).val();
        // 선택된 카테고리에 맞는 질문 표시 로직 추가
        $('.faq-questions li').hide(); // 모든 질문 숨김
        $('.faq-questions li[data-category="' + selectedCategory + '"]').show(); // 선택된 카테고리 질문만 표시
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const categoryList = document.querySelectorAll("#category-list li");
    const questions = document.querySelectorAll("#question-list li");
    const searchBox = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");
    const dropdown = document.getElementById("category-dropdown");

    // 카테고리별로 질문의 개수를 세고 표시
    categoryList.forEach(category => {
        const categoryType = category.getAttribute("data-category");
        const count = Array.from(questions).filter(q => q.getAttribute("data-category") === categoryType).length;
        category.querySelector(".count").textContent = `(${count})`;
    });

    // 카테고리 클릭 이벤트 처리
    categoryList.forEach(item => {
        item.addEventListener("click", function() {
            categoryList.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            const category = this.getAttribute("data-category");
            questions.forEach(q => {
                if (q.getAttribute("data-category") === category) {
                    q.style.display = "block";
                } else {
                    q.style.display = "none";
                }
            });
            dropdown.value = category; // 드롭다운 값 업데이트
        });
    });

    // 드롭다운 선택 이벤트 처리
    dropdown.addEventListener("change", function() {
        const selectedCategory = this.value;
        categoryList.forEach(i => i.classList.remove("active"));
        categoryList.forEach(item => {
            if (item.getAttribute("data-category") === selectedCategory) {
                item.classList.add("active");
            }
        });
        questions.forEach(q => {
            if (q.getAttribute("data-category") === selectedCategory) {
                q.style.display = "block";
            } else {
                q.style.display = "none";
            }
        });
    });

    // 질문 클릭 시 답변 표시/숨기기
    const questionItems = document.querySelectorAll(".question");
    questionItems.forEach(question => {
        question.addEventListener("click", function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains("active");
            questionItems.forEach(q => q.classList.remove("active"));
            document.querySelectorAll(".answer").forEach(a => a.style.display = "none");

            if (!isActive) {
                this.classList.add("active");
                answer.style.display = "block";
            }
        });
    });

    // 페이지 로드 시 첫 번째 카테고리의 질문만 표시
    const firstCategory = document.querySelector("#category-list li.active").getAttribute("data-category");
    questions.forEach(q => {
        if (q.getAttribute("data-category") === firstCategory) {
            q.style.display = "block";
        } else {
            q.style.display = "none";
        }
    });

    // 검색 기능 - 검색 버튼 클릭 또는 Enter 키 누를 때만 실행
    function executeSearch() {
        const searchText = searchBox.value.toLowerCase();

        questions.forEach(q => {
            const questionTitle = q.querySelector(".question").textContent.toLowerCase();

            if (questionTitle.includes(searchText)) {
                q.style.display = "block";
            } else {
                q.style.display = "none";
            }
        });
    }

    // 검색 버튼 클릭 시 검색 실행
    searchButton.addEventListener("click", executeSearch);

    // Enter 키 눌렀을 때 검색 실행
    searchBox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            executeSearch();
        }
    });
});