window.addEventListener('load', function () {
    // 이미지 크기 조정
    resizeImage();
    // 윈도우 크기 변경시 이미지 크기 조정
    window.addEventListener('resize', resizeImage);
});

function resizeImage() {
    var image = document.getElementById('main-image');
    var windowHeight = window.innerHeight;
    var imageHeight = windowHeight / 2; // 화면의 반 정도의 높이
    image.style.height = imageHeight + 'px';
}

document.addEventListener('DOMContentLoaded', function () {
    const headerText = document.querySelector('.header-text');
    const matchButton = document.querySelector('.match-button');
    const imageContainers = document.querySelectorAll('.image-container');

    const addAnimationClass = () => {
        if (headerText.getBoundingClientRect().top < window.innerHeight) {
            headerText
                .classList
                .add('show');
        }

        if (matchButton.getBoundingClientRect().top < window.innerHeight) {
            matchButton
                .classList
                .add('show');
        }

        imageContainers.forEach((container, index) => {
            if (container.getBoundingClientRect().top < window.innerHeight) {
                setTimeout(() => {
                    container
                        .classList
                        .add('show');
                }, index * 300); // 각 이미지 컨테이너에 300ms의 지연 시간 적용
            }
        });
    };

    addAnimationClass();
    window.addEventListener('scroll', addAnimationClass);
});
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card3');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry
                        .target
                        .classList
                        .add('show');
                }, index * 100); // 순차적으로 애니메이션을 적용
                observer.unobserve(entry.target); // 한번 애니메이션이 적용되면 다시 관찰하지 않음
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
});

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


// 페이지 로드 시 유저 타입 확인하여 매칭된 정보 표시 여부 결정
var userType = sessionStorage.getItem('userType');
if (userType === 'company') {
$('#matching-companies-container').show(); // 기업인 경우 매칭된 정보 표시
} else {
$('#matching-companies-container').hide(); // 기업이 아닌 경우 매칭된 정보 숨김
}

    // 매칭하기 버튼 클릭 시 처리
    $('.match-button,.price-match-button').click(function() {
    // 모달이 열리면 페이지를 모달 위치로 스크롤
    $('html, body').animate({
        
    scrollTop: $('#modal').offset().top
    }, 500); // 스크롤 속도 설정
    var userType = sessionStorage.getItem('userType');
    if (userType === 'company') {
    showMatchingModal();
    } else if (userType === 'contractor') {
    alert('기업 전용 기능입니다.');
} else {
alert('로그인이 필요합니다.');
window.location.href = 'loginpage/loginpage.html';
}
});

// 닫기 버튼 클릭 시 처리
$('.close-button, .close-button2').click(function() {
closeModal();
});

// 다음 버튼 클릭 시 처리
$('.next-button').click(function() {
var isValid = validateForm('#form1');
if (isValid) {
switchModal('#modal', '#modal2');
}
});

// 이전 버튼 클릭 시 처리
$('.previous-button').click(function() {
switchModal('#modal2', '#modal'); // 모달 전환
});

// 모달 백드롭 클릭 시 처리 (모달 닫기)
$('#modal-backdrop').click(function() {
closeModal();
});

// 두 번째 모달에서 제출 버튼 클릭 시 처리
$('#modal2 form').submit(function(event) {
event.preventDefault();
var isValid = validateForm('#form2');
if (isValid) {
submitCompanyInfo();
}
});


// 매칭하기 모달을 보여주는 함수
function showMatchingModal() {
$('body').css('overflow', 'hidden');
$('#modal, #modal-backdrop').fadeIn();
}

// 모달을 닫는 함수
function closeModal() {
$('body').css('overflow', '');
$('#modal, #modal2, #modal-backdrop').fadeOut();
}

// 모달을 전환하는 함수
function switchModal(currentModal, nextModal) {
$(currentModal).fadeOut();
$(nextModal).fadeIn();
}
// 폼 유효성 검사 함수
function validateForm(formSelector) {
    var isValid = true;
    $(formSelector + ' input[type="text"]').each(function () {
        var fieldValue = $.trim($(this).val());
        if (fieldValue === '') { // 입력 값에서 공백을 제거하고 빈 문자열인지 확인
            isValid = false;
            return false; // 반복문 탈출
        }
    });

    if (!isValid) {
        alert('모든 필드를 입력하세요.');
    }

    return isValid;
}

// 기업 정보를 서버에 제출하는 함수
function submitCompanyInfo() {
    var projectName = $('#project-name').val();
    var industry = $('#job-type').val(); // subIndustry를 보내지 않음
    var location = $('#location').val();
    var numberOfPeople = $('#number-of-people').val();
    var projectstructure = $('#projectstructure').val();

    $.ajax({
        url: '/submit-company-info',
        method: 'POST',
        data: {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            project_name: projectName,
            industry: industry, // 클라이언트에서 subIndustry를 보내지 않음
            location: location,
            number_of_people: numberOfPeople,
            projectstructure: projectstructure
        },
        success: function (response) {
            $('.match-apply-button').show();
            $('#matching-companies-container').show();
            var modalId = response.modalId;
            localStorage.setItem('lastSubmittedModalId', modalId);
            // 매칭된 업체 요청
            requestMatchingCompanies(industry, location); // subIndustry는 전달하지 않음
            // 매칭된 업체 정보 요청
            fetchMatchingInfo();
        },
        error: function (xhr, status, error) {
            console.error('Error submitting data:', error);
            alert('모든 빈칸을 입력해주세요!.');
        }
    });
}

// 서버로부터 매칭된 인력도급 업체를 요청하는 함수
function requestMatchingCompanies(industry, location) {
    var nowEmail = sessionStorage.getItem('email');
    $.ajax({
        url: '/matching-companies',
        type: 'POST',
        data: {
            industry: industry,
            location: location
        },
        success: function (response) {
            var contractorEmails = response
                .matchingCompanies
                .map(contractor => contractor.email);
            submitContractorEmails(contractorEmails, nowEmail);
            closeModal(); // 모달 닫기
            // 매칭이 완료되면 페이지를 새로고침
            window.location.reload();
        },
        error: function (xhr, status, error) {
            console.error('Error requesting matching companies:', error);
            alert('인력도급 업체를 가져오는 중 오류가 발생했습니다.');
        }
    });
}

// 매칭된 업체의 이메일을 서버로 전송하는 함수
function submitContractorEmails(contractorEmails, nowEmail) {
    if (!Array.isArray(contractorEmails)) {
        console.error('Contractor email is not an array:', contractorEmails);
        contractorEmails = [contractorEmails]; // 배열로 변환
    }

    $.ajax({
        url: '/submit-contractor-emails', method: 'POST', contentType: 'application/json', // 이 줄을 추가하세요
        data: JSON.stringify({contractorEmails: contractorEmails, nowEmail: nowEmail}),
        success: function (response) {},
        error: function (xhr, status, error) {
            console.error('Error submitting contractor emails:', error);
            alert('인력도급 업체 이메일을 제출하는 중 오류가 발생했습니다.');
        }
    });
}
// 페이지 로드 시 매칭된 업체 정보 가져오기
fetchMatchingInfo();

// 매칭된 업체 정보를 가져오는 함수
function fetchMatchingInfo() {
    // 세션 스토리지에서 현재 로그인된 사용자의 이메일 가져오기
    var nowEmail = sessionStorage.getItem('email');

    // 이메일이 없는 경우 처리
    if (!nowEmail) {
        console.error('No email found in session storage.');
        return;
    }

    $.ajax({
        url: '/matching-info',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({nowEmail: nowEmail}),
        success: function (response) {
            $('#matching-contractor-list').empty(); // 기존 카드 목록을 지우기
            displayContractors(response.matchingInfo);
            requestMatchingStatusForAll(); // 매칭 정보를 가져온 후 매칭 상태를 요청하여 처리하는 함수 호출
        },
        error: function (xhr, status, error) {}
    });
}

// 매칭된 업체 정보를 화면에 표시하는 함수
function displayContractors(matchingInfo) {
    console.log(matchingInfo)
    // 매칭된 업체 정보를 받아와서 화면에 표시하는 코드를 작성
    matchingInfo.forEach(function (contractor, index) {
        var companyCard = $('<div class="card"></div>'); // 카드 스타일 적용
        companyCard.attr('data-contractor-email', contractor.email);
        // 업체 정보를 텍스트로 설정하여 요소에 추가
        companyCard.append(
            '<div class="contractor_name"> <div class="contractor_name-content">' +
            contractor.contractor_name + '</div></div>'
        ); // 기업 소개
        companyCard.append(
            '<div class="company-info introduction"> <div class="introduction-content"' +
            '>' + contractor.introduction + '</div></div>'
        ); // 기업 소개
        companyCard.append('<div class="divider"></div>'); // 구분선
        companyCard.append(
            '<div class="company-info industry">직종: ' + contractor.industry + '</div>'
        ); // 직종
        companyCard.append(
            '<div class="company-info sub-industry">2차 직종: ' + contractor.sub_industry + '</div>'
        ); // 서브 직종
        companyCard.append(
            '<div class="company-info location">지역: ' + contractor.location + '</div>'
        ); // 지역

        // 매칭하기 버튼 추가
        var matchButton = $('<button class="match-apply-button">매칭하기</button>');

        // 매칭하기 버튼 클릭 이벤트 핸들러
        matchButton.click(function () {
            var contractorEmail = $(this)
                .closest('.card')
                .attr('data-contractor-email'); // 해당 업체의 이메일 가져오기
            var companyEmail = sessionStorage.getItem('email');
            requestMatchingStatus(contractorEmail, companyEmail);

            // 서버로 매칭 상태 업데이트 요청과 함께 인력도급업체의 이메일 정보 전송
            $.ajax({
                url: '/submit-matching-request',
                method: 'POST',
                data: {
                    contractorEmail: contractorEmail, // 인력도급업체의 이메일 정보 전송
                    status: 'matching', // 매칭 중 상태 전송
                    companyEmail: sessionStorage.getItem('email'), // 기업 이메일

                },
                success: function (response) {
                    // 매칭 상태가 업데이트되면 버튼을 매칭 중으로 변경할 수 있습니다.
                    matchButton
                        .text('매칭 중')
                        .prop('disabled', true)
                        .addClass('matching');
                    // 클릭한 카드 요소에서만 이메일을 가져와서 콘솔에 출력합니다.
                },
                error: function (xhr, status, error) {
                    console.error('매칭 상태 업데이트 중 오류:', error);
                    alert('매칭 상태를 업데이트하는 중 오류가 발생했습니다.');
                }
            });
        });

        // 생성된 카드에 매칭하기 버튼 추가
        companyCard.append(matchButton);

        $('#matching-contractor-list').append(companyCard);
        // 클로저를 사용하여 index 값을 보존
        (function (card, i) {
            setTimeout(function () {
                card.addClass('show');
            }, i * 100); // 순차적으로 보여주기 위한 지연 시간 설정
        })(companyCard, index);
    });
}

// 매칭 상태를 서버에 요청하는 함수
function requestMatchingStatus(contractorEmail, companyEmail) {
    $.ajax({
        url: '/get-matching-status',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(
            {contractorEmail: contractorEmail, companyEmail: companyEmail}
        ),
        success: function (response) {
            handleMatchingStatus(response.status, contractorEmail);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching matching status:', error);
            alert('Error fetching matching status');
        }
    });
}

// 매칭 상태를 처리하는 함수
function handleMatchingStatus(status, contractorEmail) {
    // 매칭 상태에 따라 버튼 업데이트
    var matchButton = $(
        '.card[data-contractor-email="' + contractorEmail + '"]'
    ).find('.match-apply-button');
    if (status === 'matching') {
        matchButton
            .text('매칭 중')
            .prop('disabled', true)
            .addClass('matching');
    } else {
        matchButton
            .text('매칭하기')
            .prop('disabled', false)
            .removeClass('matching');
    }
}

// 모든 업체에 대한 매칭 상태를 요청하여 처리하는 함수
function requestMatchingStatusForAll() {
    $('.card').each(function () {
        var contractorEmail = $(this).attr('data-contractor-email');
        var companyEmail = sessionStorage.getItem('email');
        requestMatchingStatus(contractorEmail, companyEmail);
    });
}

// 사용자가 기업인지 확인하는 함수
function isCompanyUser() {
    // 세션에서 userType 값을 확인하여 기업 사용자인지 여부를 반환합니다. 만약 userType이 'company'라면 true를
    // 반환하고, 그렇지 않으면 false를 반환합니다. 이 예시에서는 임의로 'userType'이라는 세션 변수를 확인합니다.
    return sessionStorage.getItem('userType') === 'company';
}

// 사용자가 로그인되어 있는지 확인하는 함수
function isLoggedIn() {
    // 세션에서 userType 값을 확인하여 기업 사용자인 경우에만 로그인된 것으로 간주합니다.
    return isCompanyUser();
}

// JavaScript 코드
$(document).ready(function () {
    // 각 기업 소개의 길이를 확인하고 클래스를 추가
    $('.company-info').each(function () {
        var introLength = $(this)
            .text()
            .length;
        if (introLength > 50) {
            $(this).addClass('long-introduction');
        }
    });
});;