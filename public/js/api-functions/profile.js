$(window).on('load', async function () {
    const userId = localStorage.getItem('_id');
    try {
        const response = await sendGetRequest(`user/${userId}`, {}, authorizedHeader);
        if (response) {
            const user = response.data;
            document.getElementById('user-Name').value = user.username;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPhone').value = user.phone;
        }
    } catch (error) {
        handleError(error)
    }
});

$('#update-profile').on('click', async function () {
    const userId = localStorage.getItem('_id');
    const updatedData = {
        username: document.getElementById('user-Name').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
    };
    try {
        const response = await sendPatchRequest(`user/${userId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث البيانات بنجاح', 'success');
            localStorage.setItem('userName', response.data.username)
        }
    } catch (error) {
        handleError(error)
    }
});

$('#change-password-button').on('click', async function () {
    const userId = localStorage.getItem('_id');
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(!passwordCurrent || !newPassword || !confirmPassword){
        alertMsg('جميع الحقول مطلوبة','warning');
        return
    }
    const passwordData = {
        passwordCurrent: passwordCurrent,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword
    };
    
    if (passwordData.newPassword != passwordData.confirmNewPassword) {
        alertMsg('كلمة المرور الجديدة و التأكيد لا يتطابقان', 'warning');
        return;
    }
    try {
        const response = await sendPatchRequest(`user/changePassword/${userId}`, passwordData, authorizedHeader);
        if (response) {
            console.log(response);
            alertMsg('تم تغيير كلمة المرور بنجاح', 'success');
            // Optionally, you might want to log the user out or prompt them to log in again
        }
    } catch (error) {
        handleError(error)
    }
});