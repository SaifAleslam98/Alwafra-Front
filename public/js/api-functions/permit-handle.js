$(window).on('load', async function () {
    $('#perm_amount').val(``); // Clear previous amount
    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    try {
        const permResponse = await sendGetRequest('perm', {}, authorizedHeader);
        if (permResponse) {
            const perms = permResponse.data;

            for (const perm of perms) {
                $('#permitOptions').append(new Option(perm.permit, perm.permit));
            }
        }
        const response = await sendGetRequest(`permit/${id}`, {}, authorizedHeader);
        
        if (response) {
            const permit = response.data;
            const issue_date = new Date(permit.issue_date).toISOString().slice(0, 10);
            const expiry_date = new Date(permit.expiry_date).toISOString().slice(0, 10);

            $('#passport_no').val(permit.passport_no);
            $('#permit_number').val(permit.permit_number);
            $('#ar_first_name').val(permit.ar_first_name);
            $('#ar_second_name').val(permit.ar_second_name);
            $('#ar_third_name').val(permit.ar_third_name);
            $('#ar_fourth_name').val(permit.ar_fourth_name);
            $('#en_first_name').val(permit.en_first_name);
            $('#en_second_name').val(permit.en_second_name);
            $('#en_third_name').val(permit.en_third_name);
            $('#en_fourth_name').val(permit.en_fourth_name);
            $('#permitOptions').val(permit.permit_type);
            $('#perm_amount').val(permit.price);
            $('#cityOptions').val(permit.city);
            $('#insurance').val(permit.insurance);
            $('#refund').val(permit.refund);
            $('#issue_date').val(issue_date);
            $('#expiry_date').val(expiry_date);
            $('#refund-button').attr('href', `/h/refund/${permit._id}`);

        }
    } catch (error) {
        handleError(error);
    }

});

// Select Permit
$('#permitOptions').on('change', async function () {
    // Inside this function, 'this' refers to the <select> element that triggered the change.
    var selectedValue = $(this).val(); // Get the value of the selected option
    $('#perm_amount').val(``); // Clear previous amount
    try {
        const response = await sendGetRequest(`perm/${selectedValue}`, {}, authorizedHeader);
        if (response) {
            const permDetails = response.data;
            $('#perm_amount').val(permDetails.price);
        }
    } catch (error) {
        handleError(error);
    }
});

// update permit
$('#update-permit').on('click', async function (e) {
    e.preventDefault();
    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];

    const ar_first_name = $('#ar_first_name').val();
    const ar_second_name = $('#ar_second_name').val();
    const ar_third_name = $('#ar_third_name').val();
    const ar_fourth_name = $('#ar_fourth_name').val();
    const en_first_name = $('#en_first_name').val();
    const en_second_name = $('#en_second_name').val();
    const en_third_name = $('#en_third_name').val();
    const en_fourth_name = $('#en_fourth_name').val();
    const permit_type = $('#permitOptions').find('option:selected').text();
    const city = $('#cityOptions').find('option:selected').text();
    const price = $('#perm_amount').val();
    const issue_date = $('#issue_date').val();
    const expiry_date = $('#expiry_date').val();
    const insurance = $('#insurance').val();
    const passport_no = $('#passport_no').val();
    const permit_number = $('#permit_number').val();

    // Basic validation
    if (!ar_first_name || !ar_second_name || !ar_third_name || !ar_fourth_name ||
        !en_first_name || !en_second_name || !en_third_name || !en_fourth_name ||
        !permit_type || !city || !passport_no || !permit_number || !price || !insurance || !issue_date || !expiry_date) {
        alertMsg('الرجاء ملء جميع الحقول المطلوبة', 'warning');
        return;
    }

    const formData = {
        ar_first_name,
        ar_second_name,
        ar_third_name,
        ar_fourth_name,
        en_first_name,
        en_second_name,
        en_third_name,
        en_fourth_name,
        permit_type,
        city,
        price,
        issue_date,
        expiry_date,
        insurance,
        passport_no,
        permit_number
    };

    try {
        const response = await sendPatchRequest(`permit/${id}`, formData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث بيانات الإقامة بنجاح', 'success');
            setTimeout(() => {
                document.location.href = '/permits';
            }, 1500);
        }
    } catch (error) {
        handleError(error);
    }
});