//Login Button
$('#login-button').on('click', async function () {
    try {

        let myBody = {}
        myBody.email = $('#email').val();
        myBody.password = $('#password').val();
        const response = await sendPostRequest(`auth/login`, myBody);
       if (response) {
            // Set the token in cookies
            setCookie('token', JSON.stringify(response.token), 1);
            localStorage.setItem('userName', response.user.firstName);
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('_id', response.user.id);
            alertMsg('Login successful', 'success');
            // Redirect to the dashboard or home page
            window.location.href = '/h/';
        }
    } catch (error) {
        handleError(error)
    }
})