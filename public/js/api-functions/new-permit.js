$(window).on('load', async function () {
    $('#perm_amount').val(``); // Clear previous amount
    try {
        const response = await sendGetRequest('perm', {}, authorizedHeader);
        if (response) {
            const perms = response.data;

            for (const perm of perms) {
                $('#permitOptions').append(new Option(perm.permit, perm._id));
            }
        }
    } catch (error) {
        console.error('Error fetching Permit types:', error);
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

// add new permit
$('#add-permit').on('click', async function (e) {
    e.preventDefault();
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
        const response = await sendPostRequest('permit', formData, authorizedHeader);
        if (response) {
            alertMsg('تمت إضافة الإقامة بنجاح', 'success');
            // Optionally, reset the form fields here
            clearData();
        }
    } catch (error) {
        handleError(error);
    }
});

function clearData() {
    $('#ar_first_name').val('');
    $('#ar_second_name').val('');
    $('#ar_third_name').val('');
    $('#ar_fourth_name').val('');
    $('#en_first_name').val('');
    $('#en_second_name').val('');
    $('#en_third_name').val('');
    $('#en_fourth_name').val('');
    $('#perm_amount').val('');
    $('#issue_date').val('');
    $('#expiry_date').val('');
    $('#insurance').val('');
    $('#passport_no').val('');
    $('#price').val('');
    $('#permit_number').val('');
}