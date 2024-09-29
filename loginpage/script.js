document.addEventListener('DOMContentLoaded', () => {
    // 비밀번호 재설정 요청 처리
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const userType = document.getElementById('userType').value;

            try {
                const response = await fetch('/forgot_password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, userType })
                });

                const result = await response.json();
                document.getElementById('responseMessage').textContent = result.message;

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('responseMessage').textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
            }
        });
    }

    // 비밀번호 재설정 처리
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newPassword = document.getElementById('newPassword').value;

            // URL에서 이메일 파라미터 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email');
            
            console.log('이메일:', email);

            try {
                const response = await fetch('/reset_password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newPassword, email })
                });

                const result = await response.json();
                
                // Reset message element에 메시지 출력
                document.getElementById('resetResponseMessage').textContent = result.message;

                if (result.message === '비밀번호가 성공적으로 변경되었습니다.') {
                    // 잠시 후 리다이렉션
                    setTimeout(() => {
                        window.location.href = '.loginpage/loginpage.html';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('resetResponseMessage').textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
            }
        });
    }
});