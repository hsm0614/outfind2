$(document).ready(function () {
    $('#modal, #modal2, #modal-backdrop').hide();
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

document.addEventListener('DOMContentLoaded', function() {
    const highlights = document.querySelectorAll('.highlight');
    const subtextWrapper = document.querySelector('.subtext-wrapper');
    const headlineHighlight = document.querySelector('.headline .highlight');

    // 하이라이트 애니메이션이 끝난 후 서브텍스트와퍼 애니메이션 시작
    if (headlineHighlight && subtextWrapper) {
        headlineHighlight.addEventListener('animationend', function() {
            subtextWrapper.classList.add('animate');
        });
    }

    // 서브텍스트와퍼 애니메이션이 끝난 후 하이라이트 색상 변경
    if (subtextWrapper) {
        subtextWrapper.addEventListener('animationend', function() {
            highlights.forEach(highlight => {
                highlight.style.color = '#00d8ff'; // 애니메이션이 끝난 후 색상 변경
            });
        });
    }

    // 모바일 화면에서 서브텍스트 내용 변경
    const subtext = document.querySelector('.subtext');
    if (window.innerWidth <= 768 && subtext) {
        subtext.innerHTML = 
            "인력도급업체의 영업의 어려움은 아웃파인드가 정확히 알고 있습니다.<br><br>" +
            "클라이언트를 상대하는 것, 그 과정에서의 비용, 시간, 등<br> 여러 어려움이 있는 것을 알고 있습니다.<br><br>" +
            "아웃파인드는 이 영업을 단순화하는 것을 넘어,<br> 인력도급업체의 편의 제공을 목표하고 있습니다.";
    }
});
