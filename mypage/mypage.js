
// 현재 페이지가 로드되면 실행되는 함수
window.onload = function() {
    // 세션 스토리지에서 userType 값을 가져옴
    const userType = sessionStorage.getItem('userType');
    
    // userType이 'company' 또는 'contractor'인지 확인
    if (userType !== 'company' && userType !== 'contractor') {
        // 해당하지 않으면 로그인 페이지로 리디렉션
        window.location.href = '../loginpage/loginpage.html'; // 로그인 페이지 URL에 맞게 수정 필요
    }
};
$(document).ready(function() {
    // 매칭 리스트를 감싸는 부모 요소에 hover 이벤트 추가
    $('.matching-management-button-container').hover(function() {
        // 해당 요소에 마우스를 올렸을 때
        $(this).find('.matching-buttons').show(); // 버튼 보이기
    }, function() {
        // 해당 요소에서 마우스를 떼었을 때
        $(this).find('.matching-buttons').hide(); // 버튼 감추기
    });

    if (sessionStorage.getItem('userType') === 'contractor') {
        $('#password-modal').hide();
        $('#matching-management-section').show();
        loadMatchingData();  // 기본으로 모든 매칭 리스트 로드

        $('#matching-management-button').click(function() {
            loadMatchingData();  // 모든 매칭 리스트 로드
        });

        $('#matching-pending').click(function() {
            loadMatchingData('matching');  // 매칭중 리스트 로드
        });

        $('#matching-accepted').click(function() {
            loadMatchingData('accepted');  // 매칭완료 리스트 로드
        });
        function loadMatchingData(status) {
            
            $.ajax({
                url: '/check-matching',
                method: 'POST',
                data: {
                    contractorEmail: sessionStorage.getItem('contractor-email'),
                    status: status || ''  // 상태가 없으면 모든 매칭 리스트 로드
                },
                success: function(response) {
                    displayMatchingInfo(response.matchingCompanies, status);
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 404) {
                        alert("매칭된 기업이 없습니다");
                    } else {
                        alert("서버 오류가 발생했습니다");
                    }
                    console.error('매칭 정보 확인 중 오류:', error);
                }
            });
        }
        function displayMatchingInfo(matchingCompanies, status) {
            var matchingInfoDiv = $('#matching-info');
            matchingInfoDiv.empty();
        
            if (matchingCompanies.length > 0) {
                var html = '<div class="matching-heading"><h2>매칭된 기업 목록</h2></div>';
                matchingCompanies.forEach(function(company) {
                    if (!status || company.matching_status === status) {
                        var statusIndicator = '';
                        if (company.taxCertificate) {
                            statusIndicator = '<div class="status-indicator approved">납</div>';
                        }
                        html += '<div class="card">';
                        html += '<div class="card-body">';
                        html += statusIndicator; // 납 아이콘 추가
                        console.log(statusIndicator);
                        html += '<h5 class="card-title">' + company.project_name + '</h5><hr>';                       
                        html += '<p class="card-text">담당자 성함: ' + company.company_name + '</p>'; 
                        html += '<p class="card-text">산업: ' + company.industry + '</p>';
                        html += '<p class="card-text">인원수: ' + company.number_of_people + '</p>';
                        html += '<p class="card-text">지역: ' + company.location + '</p>';
                        html += '<p class="card-text">프로젝트 설명: ' + company.projectstructure + '</p>';
                        if (company.matching_status === 'matching') {
                            html += '<button class="accept-match btn btn-primary" data-company-email="' + company.company_email + '">수락</button>';
                            html += '<button class="reject-match btn btn-danger" data-company-email="' + company.company_email + '">거절</button>';
                        } else if (company.matching_status === 'accepted') {
                            html += '<p class="phone-info">담당자 번호: ' + company.phone + '</p>';
                        }
                        html += '</div>';
                        html += '</div>';}
                });
                matchingInfoDiv.html(html);

                $('.accept-match').click(function() {
                    var companyEmail = $(this).data('company-email');
                    var $card = $(this).closest('.card');
                    acceptMatch(companyEmail, $card);
                });

                $('.reject-match').click(function() {
                    var companyEmail = $(this).data('company-email');
                    rejectMatch(companyEmail);
                    $(this).closest('.card').remove();
                });
            } else {
                matchingInfoDiv.html('<p>매칭된 기업이 없습니다.</p>');
            }
        }

        async function acceptMatch(companyEmail, $card) {
            try {
                
                const response = await PortOne.requestPayment({
                    storeId: "store-bd2881ea-86f3-4d69-b779-c2dccb5e0c62",
                    paymentId: `payment-${crypto.randomUUID()}`,
                    orderName: "매칭 완료를 위한 결제페이지",
                    totalAmount: 50000,
                    currency: "CURRENCY_KRW",
                    channelKey: "channel-key-a62e997c-3b89-4b68-b406-0f6d59606bd1",
                    payMethod:  "CARD",
                    redirectUrl: "https://www.outfind.co.kr/order/create",  // 결제 완료 후 리디렉션될 URL
                    noticeUrls: ["https://www.outfind.co.kr/order/create"]  // 여기에 수신할 웹훅 URL 추가
                });
                

        
                if (response.code != null) {
                    console.error("결제 오류:", response.message);
                    return alert(response.message);
                }
        
                const paymentId = response.paymentId;
                const orderId = response.txId; // txId를 orderId로 변경

                if (!paymentId || !orderId) {
                    throw new Error('결제 응답에 paymentId 또는 orderId가 없습니다.');
                }
        


                // 주문 정보 생성
            const orderData = {
            paymentId: paymentId, // 수정된 부분
            orderId: orderId,
            contractor_email: companyEmail, // 매칭 수락한 회사 이메일을 고객 이름으로 사용
            amount: 500, // 결제 금액
            status: "주문 완료" // 주문 상태
            };

        // 서버로 주문 정보 전송
        const responseOrder = await fetch('/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!responseOrder.ok) {
            throw new Error('주문 생성 실패:', responseOrder.statusText);
        }

        const responseData = await responseOrder.json();

                
                
                const body = JSON.stringify({
                    paymentId: paymentId,
                    orderId: orderId,
                    companyEmail: companyEmail
                });
        
        
        
                const notified = await fetch('/payment/complete', {  // 경로 수정
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                });
        
                const notifiedJson = await notified.json();
        
                if (notified.ok) {

                    acceptMatchRequest(companyEmail, $card);

                } else {
                    console.error('결제 결과 서버 전송 실패:', notifiedJson.message);
                }
            } catch (error) {
                console.error('매칭 수락 API 호출 오류:', error);
            }
        }
        
        
        function acceptMatchRequest(companyEmail, $card) {
            $.ajax({
                url: '/accept-match',
                method: 'POST',
                data: {
                    contractorEmail: sessionStorage.getItem('contractor-email'),
                    companyEmail: companyEmail
                },
                success: function (response) {
                    loadMatchingData('matching');
                    loadMatchingData('accepted');
                    $card.remove();

                },
                error: function (xhr, status, error) {
                    console.error('매칭 수락 중 오류:', error);
                }
            });
        }
        function rejectMatch(companyEmail) {
            $.ajax({
                url: '/reject-match',
                method: 'POST',
                data: {
                    contractorEmail: sessionStorage.getItem('contractor-email'),
                    companyEmail: companyEmail
                },
                success: function(response) {
                    loadMatchingData('matching');
                },
                error: function(xhr, status, error) {
                    console.error('매칭 거절 중 오류:', error);
                }
            });
        }
    }
});
$(document).ready(function() {
    // 매칭 리스트를 감싸는 부모 요소에 hover 이벤트 추가
    $('.matching-management-button-container').hover(function() {
        // 해당 요소에 마우스를 올렸을 때
        $(this).find('.matching-buttons').show(); // 버튼 보이기
    }, function() {
        // 해당 요소에서 마우스를 떼었을 때
        $(this).find('.matching-buttons').hide(); // 버튼 감추기
    });

    if (sessionStorage.getItem('userType') === 'company') {
        $('#matching-management-section').show();
        $('#password-modal').hide();
        loadMatchingData();  // 기본으로 모든 매칭 리스트 로드

        $('#matching-management-button').click(function() {
            loadMatchingData();  // 모든 매칭 리스트 로드
        });

        $('#matching-pending').click(function() {
            loadMatchingData('matching');  // 매칭중 리스트 로드
        });

        $('#matching-accepted').click(function() {
            loadMatchingData('accepted');  // 매칭완료 리스트 로드
        });

        function loadMatchingData(status) {
            $.ajax({
                url: '/check-company-matching',
                method: 'POST',
                data: {
                    companyEmail: sessionStorage.getItem('email'),
                    status: status || ''  // 상태가 없으면 모든 매칭 리스트 로드
                },
                success: function(response) {
                    displayMatchingInfo(response.matchingContractors, status);
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 404) {
                        alert("매칭된 아웃소싱 업체가 없습니다");
                    } else {
                        alert("서버 오류가 발생했습니다");
                    }
                    console.error('매칭 정보 확인 중 오류:', error);
                }
            });
        }

        function displayMatchingInfo(matchingContractors, status) {
            var matchingInfoDiv = $('#matching-info');
            matchingInfoDiv.empty();

            var headingText = '매칭현황';
            if (status === 'matching') {
                headingText = '매칭 중';
            } else if (status === 'accepted') {
                headingText = '매칭완료';
            }
        
            if (matchingContractors.length > 0) {
                var html = '<div class="matching-heading"><h2>' + headingText + '</h2></div>';
                matchingContractors.forEach(function(contractor) {
                    if (!status || contractor.status === status) {
                        var statusIndicator = '';
                        if (contractor.taxCertificate) {
                            statusIndicator = '<div class="status-indicator approved">납</div>';
                        }
                        html += '<div class="card">';
                        html += '<div class="card-body">';
                        html += statusIndicator;
                        html += '<h4 class="card-title">기업명: ' + contractor.contractor_name + '</h4>';
                        html += '<p class="card-text">기업소개: ' + contractor.introduction + '</p>';
                        html += '<p class="card-text">직종: ' + contractor.industry + '</p>';
                        html += '<p class="card-text">세부 직종: ' + contractor.subindustry + '</p>';  // 세부 직종 추가
                        html += '<p class="card-text">지역: ' + contractor.location + '</p>';
                        html += '<p class="card-text">매칭 상태: <span class="' + (contractor.status === 'accepted' ? 'status-accepted' : 'status-pending') + '">' + (contractor.status === 'accepted' ? '승인' : '대기') + '</span></p>';  // 매칭 상태 표시
                        html += '</div>';
                        html += '</div>';
                    }
                });
                matchingInfoDiv.html(html);
            } else {
                matchingInfoDiv.html('<p>매칭된 아웃소싱 업체가 없습니다다.</p>');
            }
        }
    }
});


$(document).ready(function() {
    // 매칭 관리 버튼 호버 시 서브 버튼 표시
    $('.matching-management-button-container').hover(function() {
        $(this).find('.matching-buttons').show(); // 버튼 보이기
    }, function() {
        $(this).find('.matching-buttons').hide(); // 버튼 감추기
    });

    // 매칭 리스트, 매칭 중, 매칭 완료 버튼 클릭 시 섹션 표시
    $('#matching-management-button').click(function() {
        $('#matching-management-section').show();
        $('#password-section').hide();
        $('#profile-section').hide();
        $('#password-modal').hide();
        loadMatchingData();  // 모든 매칭 리스트 로드
    });

    $('#matching-pending').click(function() {
        $('#matching-management-section').show();
        $('#password-section').hide();
        $('#profile-section').hide();
        $('#password-modal').hide();
        loadMatchingData('matching');  // 매칭중 리스트 로드
    });

    $('#matching-accepted').click(function() {
        $('#matching-management-section').show();
        $('#password-section').hide();
        $('#profile-section').hide();
        $('#password-modal').hide();
        loadMatchingData('accepted');  // 매칭완료 리스트 로드
    });

    // 모달 관련 변수 및 함수
    var modal = document.getElementById('password-modal');
    var closeBtn = document.querySelector('.modal .close');

    // 회원 정보 조회 버튼 클릭 시 모달 표시
    $('#profile').on('click', function() {
        $('#password-modal').css('visibility', 'visible');
        $('#matching-management-section').hide();
        $('#profile-section').hide();
        modal.style.display = 'flex';
    });

    // 모달 닫기 버튼 클릭 시 모달 숨기기
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 모달 외부 클릭 시 모달 숨기기
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
  
// 비밀번호 확인 폼 제출 시
$('#password-form').on('submit', function(e) {
    e.preventDefault();
    
    const password = $('#password').val();
    const userType = sessionStorage.getItem('userType'); // userType 가져오기
    const userEmail = userType === 'contractor'
        ? sessionStorage.getItem('contractor-email')
        : sessionStorage.getItem('email');

    if (!password || !userType || !userEmail) {
        alert('필수 정보가 누락되었습니다.');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/check-password',
        contentType: 'application/json',
        data: JSON.stringify({
            password: password,
            userType: userType,  // userType을 서버에 전송
            userEmail: userEmail
        }),
        success: function(response) {
            if (response.success) {
                $('#password-modal').hide();
                $('#password-section').hide();
                $('#profile-section').show();

                if (userType === 'company') {
                    $('#company-fields').show();
                    $('#contractor-fields').hide();
                    $('#business_number').val(response.user.business_number);
                    $('#company_name').val(response.user.company_name);
                    $('#representatinve_name').val(response.user.representatinve_name);
                    $('#address').val(response.user.address);
                    $('#address_details').val(response.user.address_details);
                } else if (userType === 'contractor') {
                    $('#company-fields').hide();
                    $('#contractor-fields').show();
                    $('#business_number').val(response.user.business_number);
                    $('#contractor_name').val(response.user.contractor_name);
                    $('#industry').val(response.user.industry);
                    $('#sub_industry').val(response.user.sub_industry);
                    $('#location').val(response.user.location);
                }
                
                $('#email').val(response.user.email);
                $('#password-update').val(response.user.password);
                $('#introduction').val(response.user.introduction);
                
                $.ajax({
                    type: 'POST',
                    url: '/get-uploaded-file',
                    contentType: 'application/json',
                    data: JSON.stringify({ 
                        userEmail: userEmail,  // userEmail 전달
                        userType: userType     // userType 전달
                    }),
                    success: function(fileResponse) {
                        if (fileResponse.fileName) {
                            $('#uploaded-file-name').text('Uploaded file: ' + fileResponse.fileName);
                        }
                    },
                    error: function(error) {
                        console.error('Error:', error);
                        alert('파일 정보를 가져오는 중 오류가 발생했습니다.');
                    }
                });
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
            
        },
        error: function(error) {
            console.error('Error:', error);
            alert('비밀번호 확인 중 오류가 발생했습니다.');
        }
    });
});

    
    // 회원 정보 수정 폼 제출 시
    $('#profile-form').on('submit', function(e) {
        e.preventDefault();
    
        const userType = sessionStorage.getItem('userType');
        const userEmail = userType === 'contractor'
            ? sessionStorage.getItem('contractor-email')
            : sessionStorage.getItem('email');
    
        const userData = {
            email: userEmail,
            business_number: $('#business_number').val(),
            password: $('#password').val(),
            introduction: $('#introduction').val()
        };
    
        if (userType === 'company') {
            userData.company_name = $('#company_name').val();
            userData.representatinve_name = $('#representatinve_name').val();
            userData.address = $('#address').val();
            userData.address_details = $('#address_details').val();
        } else if (userType === 'contractor') {
            userData.contractor_name = $('#contractor_name').val();
            userData.industry = $('#industry').val();
            userData.sub_industry = $('#sub_industry').val();
            userData.location = $('#location').val();
        }
    
        $.ajax({
            type: 'POST',
            url: '/update-profile',
            contentType: 'application/json',
            data: JSON.stringify({
                userType: userType,
                userData: userData
            }),
            success: function(response) {
                if (response.success) {
                    // 2. 납세 증명서 파일 업로드 (선택 사항)
                    const taxCertificateFile = $('#tax_certificate')[0].files[0];
                    if (taxCertificateFile) {
                        const formData = new FormData();
                        formData.append('email', userEmail);
                        formData.append('userType', userType); // userType을 추가합니다
                        formData.append('tax_certificate', taxCertificateFile);
    
                        $.ajax({
                            type: 'POST',
                            url: '/upload-tax-certificate',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function(uploadResponse) {
                                if (uploadResponse.success) {
                                    alert('회원 정보와 납세 증명서가 성공적으로 업데이트되었습니다.');
                                    location.reload();
                                } else {
                                    alert('회원 정보는 업데이트되었으나 납세 증명서 업로드에 실패했습니다.');
                                }
                            },
                            error: function(error) {
                                console.error('Error:', error);
                                alert('납세 증명서 업로드 중 오류가 발생했습니다.');
                            }
                        });
                    } else {
                        alert('회원 정보가 성공적으로 업데이트되었습니다.');
                        location.reload(); 
                    }
                } else {
                    alert('회원 정보 업데이트에 실패했습니다.');
                }
            },
            error: function(error) {
                console.error('Error:', error);
                alert('회원 정보 업데이트 중 오류가 발생했습니다.');
            }
        });
    });});
