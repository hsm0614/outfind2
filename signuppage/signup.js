// 회원가입 데이터를 MySQL에 삽입하는 함수
function signup(formData) {
    // MySQL 쿼리 실행하여 회원가입 데이터 삽입
    connection.query('INSERT INTO company SET ?', formData, (error, results, fields) => {
        if (error) {
            console.error('회원가입 오류:', error);
            throw error;
        }
        console.log('회원가입 성공:', results);
        // 여기서 다음 작업을 수행하거나 응답을 보내십시오.
    });
}

// 기업 회원가입 버튼 클릭 시 기업 회원가입 폼 보이기
    document.getElementById("company-signup-btn").addEventListener("click", function() {
    document.getElementById("company-signup-form").style.display = "block";
    document.getElementById("contractor-signup-form").style.display = "none";
});

// 인력도급업체 회원가입 버튼 클릭 시 인력도급업체 회원가입 폼 보이기
    document.getElementById("contractor-signup-btn").addEventListener("click", function() {
    document.getElementById("company-signup-form").style.display = "none";
    document.getElementById("contractor-signup-form").style.display = "block";
});

//중복확인
$(document).ready(function() {
    // 중복 확인 버튼 클릭 시
    $('#company-email-check-button').click(function(event) {
        event.preventDefault();

        var email = $('#company-email').val();

        // 이메일 유효성 검사
        if (!isValidEmail(email)) {
            alert('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        // 서버로 이메일 중복 확인 요청
        $.ajax({
            url: 'https://outfind.co.kr/check-email',
            type: 'POST',
            data: { email: email },
            success: function(response) {
                console.log(response); // 서버로부터 받은 응답을 콘솔에 출력
                if (response.exists) {
                    alert('이미 사용 중인 이메일입니다.');
                } else {
                    alert('사용 가능한 이메일입니다.');
                }
            },
            error: function() {
                alert('이메일 중복 확인 중 오류가 발생했습니다.');
            }
        });
    });

    // 이메일 유효성 검사 함수
    function isValidEmail(email) {
        // 이메일 유효성 검사 로직 추가
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});

//기업
  $(document).ready(function() {
    // 회원가입 폼 제출 시
    $('#company-signup-form').submit(function(event) {
        // 기본 제출 동작 막기
        event.preventDefault();

        // 필수 입력 필드 확인 및 데이터 가져오기
        var businessNumber = $('#company-business-number1').val();
        var companyName = $('#company-name').val();
        var companyRepresentative = $('#company-representative').val();
        var companyEmail = $('#company-email').val();
        var companyPassword = $('#company-password').val();
        var companyConfirmPassword = $('#company-confirm-password').val();
        var companyAddress = $('#company-address').val();
        var companyAddressDetails = $('#company-address-details').val();
        var companyIntroduction = $('#company-introduction').val();

        // 모든 필수 입력 필드가 채워져 있는지 확인
        if (companyName === '' || companyRepresentative === '' || companyPassword === '' || companyConfirmPassword === '' || companyEmail === '' || companyAddress === '' || companyAddressDetails === '' || companyIntroduction === '') {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        // 비밀번호 일치 확인
        if (companyPassword !== companyConfirmPassword) {
            alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }
        // 회원가입 정보를 객체로 저장
        var signupData = {
        businessNumber: businessNumber,
        companyName: companyName,
        companyRepresentative: companyRepresentative,
        companyEmail: companyEmail,
        companyPassword: companyPassword,
        companyAddress: companyAddress,
        userType: 'company',
};


        // AJAX 요청 보내기(company)
        $.ajax({
            url: '/signuppage/signup.html/signup/company', // 실제 회원가입 엔드포인트로 수정
            type: 'POST', // POST 메소드 사용
            data: {
                "businessNumber": businessNumber, // 사업자 번호
                "companyName": companyName, // 회사명
                "companyRepresentative": companyRepresentative, // 회사 대표명
                "companyEmail": companyEmail, // 이메일
                "companyPassword": companyPassword, // 비밀번호
                "companyAddress": companyAddress, // 주소
                "companyAddressDetails": companyAddressDetails, // 주소 상세정보
                "companyIntroduction": companyIntroduction // 회사 소개
            },
           success: function(response) {
    if(response === "complete") {
        alert('회원가입이 완료되었습니다.');
        window.location.href = '/loginpage/loginpage.html';
    } else {
        alert('회원가입 중 오류가 발생했습니다: ' + response.message);
    }
},
            error: function(xhr, status, error) {
                // 오류 응답 처리
                console.error(xhr.responseText);
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    });
});

// 중복 확인 버튼 클릭 시
$('#contractor-email-check-button').click(function(event) {
    event.preventDefault();

    var email = $('#contractor-email').val();

    // 이메일 유효성 검사
    if (!isValidEmail(email)) {
        alert('유효한 이메일 주소를 입력해주세요.');
        return;
    }

    // 서버로 이메일 중복 확인 요청
    $.ajax({
        url: 'https://outfind.co.kr/check-contractor-email',
        type: 'POST',
        data: { email: email },
        success: function(response) {
            if (response.exists) {
                alert('이미 사용 중인 이메일입니다.');
            } else {
                alert('사용 가능한 이메일입니다.');
            }
        },
        error: function() {
            alert('이메일 중복 확인 중 오류가 발생했습니다.');
        }  
    });
        // 이메일 유효성 검사 함수
        function isValidEmail(email) {
            // 이메일 유효성 검사 로직 추가
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
});

//인력도급
$(document).ready(function() {
    // 회원가입 폼 제출 시
    $('#contractor-signup-form').submit(function(event) {
        // 기본 제출 동작 막기
        event.preventDefault();


    // 폼 데이터 가져오기
    var businessNumber = $('#contractor-business-number1').val();
    var contractorname = $('#contractorname').val();
    var email = $('#contractor-email').val();
    var password = $('#contractor-password').val();
    var confirmPassword = $('#contractor-confirm-password').val();
    var industry = $('#contractor-industry').val();
    var subIndustry = $('#contractor-subindustry').val();
    var location = $('#contractor-location').val();
    var contractorintroduction = $('#contractor-introduction').val();


    // 필수 입력 필드 확인
    if (businessNumber === '' || email === '' || password === '' || confirmPassword === '' || industry === '' || subIndustry === '' || location === ''| contractorintroduction === '') {
    alert('모든 필수 항목을 입력해주세요.');
    return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
    }

    // 서버로 전송할 데이터 객체 생성
    var data = {
        businessNumber: businessNumber,
        contractorname: contractorname,
        email : email,
        password: password,
        industry: industry,
        subIndustry: subIndustry,
        location: location,
        contractorintroduction: contractorintroduction,
        userType: 'contractor'
    };

    // AJAX 요청 보내기
    $.ajax({
        url: '/signuppage/signup.html/signup/contractor', // 실제 회원가입 엔드포인트로 수정
        type: 'POST', // POST 메소드 사용
        data: data,
        success: function(response) {
            if(response === "complete") {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/loginpage/loginpage.html';
            } else {
                alert('회원가입 중 오류가 발생했습니다: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
});
});

////직업 옵션
        function updateSubIndustry() {
            var industrySelect = document.getElementById("contractor-industry");
            var subIndustrySelect = document.getElementById("contractor-subindustry");
            subIndustrySelect.innerHTML = ""; // 이전 선택 내용 지우기
            
            var selectedIndustry = industrySelect.value;
            var subIndustries = [];
            
            switch(selectedIndustry) {
                case "제조업":
                    subIndustries = ["식음료제조업", "자동차 금속 기계업", "의복류 제조업", "펄프 종이제조업", "의료, 정밀기계 제조업", "기타제조업"];
                    break;
                case "물류업":
                    subIndustries = ["냉장 냉동물류", "의류물류", "농산물 물류", "일반 물류"];
                    break;
                case "서비스업":
                    subIndustries = ["판촉업(마트)", "호텔 및 리조트", "식음료 서비스업"];
                    break;
                default:
                    subIndustries = [];
                    break;
            }
            
// 상세업종 옵션 추가
    subIndustries.forEach(function(subIndustry) {
        var option = document.createElement("option");
            option.value = subIndustry;
            option.text = subIndustry;
            subIndustrySelect.appendChild(option);
     });
}            
