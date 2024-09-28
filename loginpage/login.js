
// 기업 로그인 버튼 클릭 시 기업 로그인 폼을 보여줌
document.getElementById("company-login-btn").addEventListener("click", function() {
    document.getElementById("company-login-form").style.display = "block";
    document.getElementById("contractor-login-form").style.display = "none";
});

// 인력도급 업체 로그인 버튼 클릭 시 인력도급 업체 로그인 폼을 보여줌
document.getElementById("contractor-login-btn").addEventListener("click", function() {
    document.getElementById("company-login-form").style.display = "none";
    document.getElementById("contractor-login-form").style.display = "block";
});

window.onload = function() {
    // 기업 로그인 아이디 불러오기
    const savedCompanyEmail = localStorage.getItem('companyEmail');
    if (savedCompanyEmail) {
        document.getElementById('email').value = savedCompanyEmail;
        document.getElementById('rememberCompanyEmail').checked = true;
    }

    // 인력도급 업체 로그인 아이디 불러오기
    const savedContractorEmail = localStorage.getItem('contractorEmail');
    if (savedContractorEmail) {
        document.getElementById('contractor-email').value = savedContractorEmail;
        document.getElementById('rememberContractorEmail').checked = true;
    }
};


$('#company-login-button').click(function(event) {
    event.preventDefault(); // 기본 제출 동작 막기

    var companyEmail = $('#email').val(); // 이메일 가져오기
    var companyPassword = $('#password').val(); // 비밀번호 가져오기
    var rememberCompanyEmail = $('#rememberCompanyEmail').is(':checked');

    if (rememberCompanyEmail) {
        // 체크박스가 체크되어 있으면 아이디를 저장
        localStorage.setItem('companyEmail', companyEmail);
    } else {
        // 체크박스가 체크 해제되어 있으면 저장된 아이디 삭제
        localStorage.removeItem('companyEmail');
    }

    $.ajax({
        url: '/loginpage/loginpage.html/login/company', // 로그인 엔드포인트로 수정
        type: 'POST',
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: JSON.stringify({
            userType: 'company',
            companyEmail: companyEmail,
            companyPassword: companyPassword,
        }),
        success: function(response) {
            if(response.token) {
                // 토큰을 세션 스토리지에 저장
                // 세션 스토리지에 이메일 저장
                sessionStorage.setItem('email', response.companyEmail);
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('userType', response.userType); // userType을 세션 스토리지에 저장
                // 받은 유저 타입에 따라 처리
                if (response.userType === 'company') {
                    
                    // 기업 유저인 경우 메인 페이지로 이동
                    window.location.href = 'https://www.outfind.co.kr/';
                } else {
                    // 기타 유저 타입 처리
                    alert('올바른 유저 타입이 아닙니다.');
                }
            } else {
                // 토큰을 받아오지 못한 경우
                alert('로그인에 실패하였습니다.');
            }
        },
        error: function(xhr, status, error) {
            if(xhr.status === 401) {
                alert('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else {
                // 401 외의 다른 오류일 경우
                alert('서버와 통신 중 오류가 발생했습니다.');
            }
        }
    });
});

    // 보호되는 페이지 요청 예시
$.ajax({
    url: '/protected',
    type: 'GET',
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    success: function(response) {
        // 인증이 성공하면 응답을 처리
    },
    error: function(xhr, status, error) {
        // 인증이 실패하면 오류 처리
    }
});



$('#contractor-login-button').click(function(event) {
    event.preventDefault(); // 기본 제출 동작 막기

    var contractorEmail = $('#contractor-email').val(); // 이메일 가져오기
    var contractorPassword = $('#contractor-password').val(); // 비밀번호 가져오기
    var rememberContractorEmail = $('#rememberContractorEmail').is(':checked');

    if (rememberContractorEmail) {
        // 체크박스가 체크되어 있으면 아이디를 저장
        localStorage.setItem('contractorEmail', contractorEmail);
    } else {
        // 체크박스가 체크 해제되어 있으면 저장된 아이디 삭제
        localStorage.removeItem('contractorEmail');
    }
    
    $.ajax({
        url: '/loginpage/loginpage.html/login/contractor', // 로그인 엔드포인트로 수정
        type: 'POST',
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: JSON.stringify({
            userType: 'contractor',
            contractorEmail: contractorEmail, // 이메일 전달
            contractorPassword: contractorPassword // 비밀번호 전달
        }),
        success: function(response) {
            if(response.token) {
                // 토큰을 세션 스토리지에 저장
                sessionStorage.setItem('contractor-email', response.contractorEmail);
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('userType', response.userType); // userType을 세션 스토리지에 저장
                // 받은 유저 타입에 따라 처리
                if (response.userType === 'contractor') {
                    // 인력도급 유저인 경우 메인 페이지로 이동
                    window.location.href = '/';
                } else {
                    // 기타 유저 타입 처리
                    alert('올바른 유저 타입이 아닙니다.');
                }
            } else {
                // 토큰을 받아오지 못한 경우
                alert('로그인에 실패하였습니다.');
            }
        },
        error: function(xhr, status, error) {
            if(xhr.status === 401) {
                alert('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else {
                // 401 외의 다른 오류일 경우
                alert('서버와 통신 중 오류가 발생했습니다.');
            }
        }
    });
});