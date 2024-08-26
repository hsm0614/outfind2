document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 막기

    var adminEmail = document.getElementById('admin-email').value;
    var adminPassword = document.getElementById('admin-password').value;

    $.ajax({
        url: '/adminlogin', // 로그인 엔드포인트
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            userType: 'admin',
            email: adminEmail,
            password: adminPassword
        }),
        success: function(response) {
            if (response.token) {
                // 토큰을 세션 스토리지에 저장
                sessionStorage.setItem('email', response.email);
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('userType', response.userType);
                
                // 관리자 대시보드로 이동
                window.location.href = '/admin/admin.html';
            } else {
                document.getElementById('error-message').innerText = '로그인에 실패하였습니다.';
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                document.getElementById('error-message').innerText = '이메일 또는 비밀번호가 올바르지 않습니다.';
            } else {
                document.getElementById('error-message').innerText = '서버와 통신 중 오류가 발생했습니다.';
            }
        }
    });
});