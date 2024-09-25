document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    const headerText = document.querySelector('.header-text');
    const matchButton = document.querySelector('.match-button');
    const imageContainers = document.querySelectorAll('.image-container');

    // 사이드바 열기/닫기 토글
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // 사이드바 닫기 버튼 클릭 시 사이드바 닫기
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // 이미지 리사이즈 함수
    function resizeImage() {
        const image = document.getElementById('main-image');
        const windowHeight = window.innerHeight;
        const imageHeight = windowHeight / 2; // 화면의 반 정도의 높이
        if (image) {
            image.style.height = imageHeight + 'px';
        }
    }

    // 초기 이미지 사이즈 설정
    resizeImage();

    // 윈도우 리사이즈 시 이미지 크기 조정
    window.addEventListener('resize', resizeImage);

    // 애니메이션 효과 추가 함수
    const addAnimationClass = () => {
        if (headerText.getBoundingClientRect().top < window.innerHeight) {
            headerText.classList.add('show');
        }

        if (matchButton.getBoundingClientRect().top < window.innerHeight) {
            matchButton.classList.add('show');
        }

        imageContainers.forEach((container, index) => {
            if (container.getBoundingClientRect().top < window.innerHeight) {
                setTimeout(() => {
                    container.classList.add('show');
                }, index * 300); // 각 이미지 컨테이너에 300ms의 지연 시간 적용
            }
        });
    };

    // 초기 애니메이션 설정
    addAnimationClass();

    // 스크롤 시 애니메이션 효과 적용
    window.addEventListener('scroll', addAnimationClass);
});
$(document).ready(function () {
    $('#modal, #modal2, #modal-backdrop').hide();
    // 페이지가 로드될 때 실행될 코드 작성
    if (sessionStorage.getItem('token')) {
        // 토큰이 있는 경우: 로그인 상태
        $('#login-link').hide(); // 로그인 링크 숨기기
        $('#signup-link').hide(); // 회원가입 링크 숨기기
        $('#mypage-link').show(); // 마이페이지 링크 표시
        $('#sidebar-login-link').hide();
        $('#sidebar-signup-link').hide();
        $('#sidebar-mypage-link').show();
        $('#sidebar-logout-link').show();
    } else {
        // 토큰이 없는 경우: 비로그인 상태
        $('#login-link').show(); // 로그인 링크 표시
        $('#signup-link').show(); // 회원가입 링크 표시
        $('#mypage-link').hide(); // 마이페이지 링크 숨기기
        $('#logout-link').hide(); // 마이페이지 링크 숨기기
        $('#sidebar-login-link').show();
        $('#sidebar-signup-link').show();
        $('#sidebar-mypage-link').hide();
        $('#sidebar-logout-link').hide();
    }

    // 로그아웃 버튼 클릭 시 처리
    $('#logout-link, #sidebar-logout-link').click(function (event) {
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
        $('#sidebar-login-link').show();
        $('#sidebar-signup-link').show();
        $('#sidebar-mypage-link').hide();
        $('#sidebar-logout-link').hide();
        // 페이지 새로고침
        window.location.href = '/';
    });
});