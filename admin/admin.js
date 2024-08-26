$(document).ready(function() {
    // 사용자 목록 가져오기
    $.ajax({
        type: 'GET',
        url: '/admin/get-users',
        success: function(users) {
            let userListHtml = '';
            users.forEach(user => {
                const escapedEmail = escapeSelector(user.email);
                userListHtml += `
                    <tr>
                        <td>${user.email}</td>
                        <td>${user.name || 'N/A'}</td>
                        <td><a href="${user.tax_certificate || '#'}" target="_blank">보기</a></td>
                        <td id="status-${escapedEmail}">${user.status || 'N/A'}</td>
                        <td>
                            <button onclick="approveUser('${user.email}', '${user.user_type}')">승인</button>
                            <button onclick="rejectUser('${user.email}', '${user.user_type}')">거절</button>
                        </td>
                    </tr>
                `;
            });
            $('#user-list').html(userListHtml);
        },
        error: function(error) {
            console.error('Error:', error);
            alert('사용자 목록을 불러오는 중 오류가 발생했습니다.');
        }
    });
});

function approveUser(email, userType) {
    updateUserStatus(email, 'approved', userType);
}

function rejectUser(email, userType) {
    updateUserStatus(email, 'rejected', userType);
}

function escapeSelector(selector) {
    return selector.replace(/([\\\^\$\.\|\?\*\+\(\)\[\]\{\}])/g, '\\$1');
}

function updateUserStatus(email, status, userType) {
    $.ajax({
        type: 'POST',
        url: '/admin/update-status',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            status: status,
            userType: userType // userType을 추가로 전송
        }),
        success: function(response) {
            if (response.success) {
                const escapedEmail = escapeSelector(email);
                $('#status-' + escapedEmail).text(status);
                alert('상태가 업데이트되었습니다.');
            } else {
                alert('상태 업데이트에 실패했습니다.');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            alert('상태 업데이트 중 오류가 발생했습니다.');
        }
    });
}

// userType을 결정하는 예시 함수
function getUserType(email) {
    // 이 함수는 실제로 사용자의 이메일을 기반으로 유저 유형을 결정하는 로직이 필요합니다.
    // 예시로 'company'를 반환하는데, 실제 데이터에 맞게 변경해야 합니다.
    // 예: 이메일 도메인에 따라 구분하거나, 서버에서 유저 정보를 가져오는 방법 등
    return 'company'; // 또는 실제 로직에 맞게 'contractor' 반환
}
