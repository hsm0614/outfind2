$(document).ready(function() {
    // 매칭 관리 현황 버튼 클릭 시 이벤트 리스너 추가
    $('#matching-management-button').click(function() {
        // 매칭 관리 현황 섹션 보이기
        $('#matching-management-section').show();
        // 매칭 정보 가져오기
        getMatchingInfo();
    });

    // 매칭 정보를 가져오는 함수
    function getMatchingInfo() {
        $.ajax({
            url: '/check-matching',
            method: 'POST',
            data: {
                contractorEmail: sessionStorage.getItem('contractor-email')
            },
            success: function(response) {
                // 매칭 정보를 화면에 표시
                displayMatchingInfo(response.matchingCompanies);
            },
            error: function(xhr, status, error) {
                console.error('매칭 정보 확인 중 오류:', error);
            }
        });
    }

// 매칭 정보를 화면에 표시하는 함수
function displayMatchingInfo(matchingCompanies) {
    var matchingInfoDiv = $('#matching-info');
    if (matchingCompanies.length > 0) {
        var html = '<h2>매칭된 기업 목록</h2>';
        matchingCompanies.forEach(function(company) {
            html += '<div class="card">';
            html += '<div class="card-body">';
            html += '<h5 class="card-title">프로젝트 이름: ' + company.project_name + '</h5>';
            html += '<p class="card-text">산업: ' + company.industry + '</p>';
            html += '<p class="card-text">인원수: ' + company.number_of_people + '</p>';
            if (company.status === 'matching') {
                html += '<button class="accept-match btn btn-primary" data-company-email="' + company.company_email + '">수락</button>';
                html += '<button class="reject-match btn btn-danger" data-company-email="' + company.company_email + '">거절</button>';
            } else if (company.status === 'accepted') {
                html += '<p class="phone-info">담당자 번호: ' + company.phone + '</p>';
            }
            html += '</div>';
            html += '</div>';
        });
        matchingInfoDiv.html(html);

        // 수락 및 거절 버튼에 클릭 이벤트 리스너 추가
        $('.accept-match').click(function() {
            var companyEmail = $(this).data('company-email');
            // 수락 처리를 위한 AJAX 요청
            acceptMatch(companyEmail);
            // 해당 수락 버튼이 속한 리스트 아이템의 담당자 번호를 표시
            $(this).closest('.card').find('.phone-info').show();
            $(this).siblings('.reject-match').hide();
            $(this).siblings('.accept-match').hide();
        });

        $('.reject-match').click(function() {
            var companyEmail = $(this).data('company-email');
            // 거절 처리를 위한 AJAX 요청
            rejectMatch(companyEmail);
            // 해당 기업 정보를 포함한 카드 요소 제거
            $(this).closest('.card').remove(); // 해당 버튼이 속한 카드 요소 제거
        });
    } else {
        matchingInfoDiv.html('<p>매칭된 기업이 없습니다.</p>');
    }
}
    
// 매칭 수락 처리를 위한 함수
function acceptMatch(companyEmail) {
    $.ajax({
        url: '/accept-match',
        method: 'POST',
        data: {
            contractorEmail: sessionStorage.getItem('contractor-email'),
            companyEmail: companyEmail
        },
        success: function(response) {
            // 성공적으로 수락한 경우의 처리
            console.log('매칭 수락:', response);
            // 해당 수락 버튼이 속한 리스트 아이템의 담당자 번호를 표시
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error('매칭 수락 중 오류:', error);
        }
    });
}

    // 매칭 거절 처리를 위한 함수
    function rejectMatch(companyEmail) {
        $.ajax({
            url: '/reject-match',
            method: 'POST',
            data: {
                contractorEmail: sessionStorage.getItem('contractor-email'),
                companyEmail: companyEmail
            },
            success: function(response) {
                // 성공적으로 거절한 경우의 처리
                console.log('매칭 거절:', response);
                // 다시 매칭 정보 갱신 등의 작업 수행
                getMatchingInfo(); // 매칭 정보 다시 가져오기
            },
            error: function(xhr, status, error) {
                console.error('매칭 거절 중 오류:', error);
            }
        });
    }
});