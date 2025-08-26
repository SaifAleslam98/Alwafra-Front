$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('visa', {}, authorizedHeader);
        if (response) {
            const visas = response.data;

            for (const visa of visas) {
                $('#visasOptions').append(new Option(visa.visa, visa._id));
            }
        }
    } catch (error) {
        console.error('Error fetching visa types:', error);
    }

});

// Select Visa
$('#visasOptions').on('change', async function () {
    // Inside this function, 'this' refers to the <select> element that triggered the change.
    var selectedValue = $(this).val(); // Get the value of the selected option
    try {
        const response = await sendGetRequest(`visa/${selectedValue}`, {}, authorizedHeader);
        if (response) {
            const visaDetails = response.data;
            $('#visa_amount').val(visaDetails.amount);
        }
    } catch (error) {
        handleError(error);
    }
});

// add new client
$('#add-client').on('click', async function (e) {
    e.preventDefault();
    const arabicFirstName = $('#ar_first_name').val();
    const arabicSecondName = $('#ar_second_name').val();
    const arabicThirdName = $('#ar_third_name').val();
    const arabicFourthName = $('#ar_fourth_name').val();
    const englishFirstName = $('#en_first_name').val();
    const englishSecondName = $('#en_second_name').val();
    const englishThirdName = $('#en_third_name').val();
    const englishFourthName = $('#en_fourth_name').val();
    const visaType = $('#visasOptions').find('option:selected').text();
    const visaAmount = $('#visa_amount').val();
    const visaCurrency = 'AED'; // Default currency
    const insurance = $('#insurance').val();
    const passportNumber = $('#passport_no').val();
    const visaCreatedDate = $('#visa_created_date').val();
    const visaFinishedDate = $('#visa_finished_date').val();
    const clientEnteranceDate = $('#client_enterance_date').val();
    const visaImage = $('#visa_file')[0].files[0];
    const passportImage = $('#client_passport')[0].files[0];
    const clientImage = $('#client_photograph')[0].files[0];
    const permitImage = $('#permit')[0].files[0];

    // Basic validation
    if (!arabicFirstName || !arabicSecondName || !arabicThirdName || !arabicFourthName ||
        !englishFirstName || !englishSecondName || !englishThirdName || !englishFourthName ||
        !visaType || !visaAmount || !passportNumber || !visaCreatedDate || !visaFinishedDate || !clientImage || !passportImage) {
        alertMsg('الرجاء ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    const formData = new FormData();
    formData.append('ar_first_name', arabicFirstName);
    formData.append('ar_second_name', arabicSecondName);
    formData.append('ar_third_name', arabicThirdName);
    formData.append('ar_fourth_name', arabicFourthName);
    formData.append('en_first_name', englishFirstName);
    formData.append('en_second_name', englishSecondName);
    formData.append('en_third_name', englishThirdName);
    formData.append('en_fourth_name', englishFourthName);
    formData.append('visa_type', visaType);
    formData.append('visa_amount', visaAmount);
    formData.append('visa_amount_currency', visaCurrency);
    formData.append('insurance', insurance);
    formData.append('passport_no', passportNumber);
    formData.append('visa_created_date', visaCreatedDate);
    formData.append('visa_finished_date', visaFinishedDate);
    formData.append('client_enterance_date', clientEnteranceDate);
    if (visaImage) {
        console.log('Visa Image:', visaImage.name);
        formData.append('visa_file', visaImage);
    }
    if (passportImage) {
        formData.append('client_passport', passportImage);
    }
    if (clientImage) {
        formData.append('client_photograph', clientImage);
    }
    if (permitImage) {
        formData.append('permit', permitImage);
    }


    try {

        const response = await sendPostRequest('client', formData, multiPartAuthorizedHeader);
        if (response) {
            alertMsg('تم إضافة العميل بنجاح', 'success');
            // Optionally, reset the form after successful submission
            $('#new-client-form')[0].reset();
        }
    } catch (error) {
        handleError(error);

    }


    console.log('Client Data:', formData); // Log the client data for debugging

});