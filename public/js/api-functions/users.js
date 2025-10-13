$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('user', {}, authorizedHeader);
        if (response) {
            const users = response.data;
            const tableBody = document.getElementById('users-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            if (users.length > 0) {
                for (let listsCounter = 0; listsCounter < users.length; listsCounter++) {
                    let isActiveChecked = users[listsCounter].isActive ;
                    let iconIsActive;
                    if (isActiveChecked) {
                        iconIsActive = '<i class="fa fa-circle text-success"></i>';
                    } else {
                        iconIsActive = '<i class="fa fa-circle text-danger"></i>';
                    }
                    tableRows += `
                            <tr id="row-${users[listsCounter]._id}">
                                <td>${listsCounter + 1}</td>
                                <td>${users[listsCounter].username}</td>
                                <td>${users[listsCounter].email}</td>
                                <td>${users[listsCounter].phone}</td>
                                <td id="role-${users[listsCounter]._id}">${users[listsCounter].role}</td>
                                <td id="isActive-${users[listsCounter]._id}" data-id="${users[listsCounter].isActive}">${iconIsActive}</td>
                                <td><button type="button" class="button openModal" id="${users[listsCounter]._id}">تعديل</button</td>
                            </tr>

                    `;

                }
                $('#users-table-body').append(tableRows);
                const uid = localStorage.getItem('_id');
                const mybutton = document.getElementById(`${uid}`);
                mybutton.disabled = true;
            }
            // Optionally, you can add a message if no clients are found
            if (users.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد مستخدمين</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        handleError(error)
    }
});

$(document).on('click', '.openModal', async function () {
    openModal('updateUserModal');
    const userId = $(this).attr('id');
    const uRole = $(`#role-${userId}`).text();
    const uIsActive = $(`#isActive-${userId}`).attr('data-id');
    document.getElementById("user-id").value = userId;
    document.getElementById("user-role").value = uRole;
    document.getElementById("user-isActive").value = uIsActive;

});

$('#update-user-button').on('click', async function () {
    const userId = $('#user-id').val();
    const updatedRole = document.getElementById("user-role").value;
    const updatedIsActive = document.getElementById("user-isActive").value;

    const updatedData = {
        role: updatedRole,
        isActive: updatedIsActive
    };
    try {
        const response = await sendPatchRequest(`user/${userId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث المستخدم بنجاح', 'success');
            // Update the table row with new data
            $(`#role-${userId}`).text(updatedRole);
            if (updatedIsActive === 'true') {
                $(`#isActive-${userId}`).html('<i class="fa fa-circle text-success"></i>');
                $(`#isActive-${userId}`).attr('data-id', true);
            } else {
                $(`#isActive-${userId}`).html('<i class="fa fa-circle text-danger"></i>');
                $(`#isActive-${userId}`).attr('data-id', false);
            }
            closeModal('updateUserModal');
        }
    } catch (error) {
        handleError(error);
    }
});

$('#new-user-button').on('click', async function () {
    const newUserName = document.getElementById("newUserName").value;
    const newUserEmail = document.getElementById("newUserEmail").value;
    const newUserPhone = document.getElementById("newUserPhone").value;
    const newUserPassword = document.getElementById("newUserPassword").value;
    const newUserRole = document.getElementById("newUserRole").value;

    if (!newUserName || !newUserEmail || !newUserPhone || !newUserPassword || !newUserRole) {
        alertMsg('جميع الحقول مطلوبة', 'warning');
        return;
    }

    const newUserData = {
        username: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        password: newUserPassword,
        role: newUserRole
    };
    try {
        const response = await sendPostRequest('user', newUserData, authorizedHeader);
        if (response) {
            alertMsg('تم إضافة المستخدم بنجاح', 'success');
            // Optionally, you can append the new user to the table without reloading
            closeModal('newUserModal');
            // Clear input fields
            document.getElementById("newUserName").value = '';
            document.getElementById("newUserEmail").value = '';
            document.getElementById("newUserPhone").value = '';
            document.getElementById("newUserPassword").value = '';
            // Reload the page to show the new user in the list
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        handleError(error);
    }
});