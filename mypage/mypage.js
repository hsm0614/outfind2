
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
                    console.log(matchingCompanies)
                    if (!status || company.status === status) {
                        html += '<div class="card">';
                        html += '<div class="card-body">';
                        html += '<h5 class="card-title">' + company.project_name + '</h5><hr>';                       
                        html += '<p class="card-text">담당자 성함: ' + company.name + '</p>'; 
                        html += '<p class="card-text">산업: ' + company.industry + '</p>';
                        html += '<p class="card-text">인원수: ' + company.number_of_people + '</p>';
                        html += '<p class="card-text">지역: ' + company.location + '</p>';
                        html += '<p class="card-text">프로젝트 설명: ' + company.projectstructure + '</p>';
                        if (company.status === 'matching') {
                            html += '<button class="accept-match btn btn-primary" data-company-email="' + company.company_email + '">수락</button>';
                            html += '<button class="reject-match btn btn-danger" data-company-email="' + company.company_email + '">거절</button>';
                        } else if (company.status === 'accepted') {
                            html += '<p class="phone-info">담당자 번호: ' + company.phone + '</p>';
                        }
                        html += '</div>';
                        html += '</div>';
                    }
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
                console.log("매칭 수락 API 호출 시작"); // 디버깅용 로그
                
                const response = await PortOne.requestPayment({
                    storeId: "store-bd2881ea-86f3-4d69-b779-c2dccb5e0c62",
                    paymentId: `payment-${crypto.randomUUID()}`,
                    orderName: "매칭 완료를 위한 결제페이지",
                    totalAmount: 500,
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
        
                console.log('매칭 수락 API 호출 시작');


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
        console.log('주문 생성 응답:', responseData);

                
                
                const body = JSON.stringify({
                    paymentId: paymentId,
                    orderId: orderId,
                    companyEmail: companyEmail
                });
        
                console.log('서버로 전송할 데이터:', body);
        
        
                const notified = await fetch('/payment/complete', {  // 경로 수정
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                });
        
                const notifiedJson = await notified.json();
        
                if (notified.ok) {
                    console.log('결제 결과 서버에 전송 완료');

                    acceptMatchRequest(companyEmail, $card);

                } else {
                    console.error('결제 결과 서버 전송 실패:', notifiedJson.message);
                }
            } catch (error) {
                console.error('매칭 수락 API 호출 오류:', error);
            }
        }
        
        
        function acceptMatchRequest(companyEmail, $card) {
            console.log('매칭 수락 요청 시작'); // 디버깅용 로그
            $.ajax({
                url: '/accept-match',
                method: 'POST',
                data: {
                    contractorEmail: sessionStorage.getItem('contractor-email'),
                    companyEmail: companyEmail
                },
                success: function (response) {
                    console.log('매칭 수락 성공:', response);
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
                    console.log('매칭 거절:', response);
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
                        html += '<div class="card">';
                        html += '<div class="card-body">';
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