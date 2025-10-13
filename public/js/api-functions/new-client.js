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
            $('#insurance').val(visaDetails.insurance);
            $('#warranty').val('true');
            $('#category').val(visaDetails.category);
            const discount = $('#discount').val();
            if (discount === 0 || discount === '') {
                $('#total').val(visaDetails.amount);
                return;
            }
            const total = visaDetails.amount - discount;
            if (total < 0) {
                alertMsg('الخصم لا يمكن أن يكون أقل من صفر', 'warning');
                $('#discount').val(0);
                $('#total').val(visaDetails.amount);
                return;
            }
            $('#total').val(total);
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
    const birthDate = $('#birthDate').val();
    const visaType = $('#visasOptions').find('option:selected').text();
    const visaAmount = $('#visa_amount').val();
    const visaCurrency = 'AED'; // Default currency
    const insurance = $('#insurance').val();
    const discount = $('#discount').val() || 0;
    const total = $('#total').val() || visaAmount;
    const warranty = $('#warranty').val() || 'true';
    const category = $('#category').val();
    const gender = $('#gender').val();
    const passportNumber = $('#passport_no').val();
    const passport_created_date = $('#passport_created_date').val();
    const passport_finished_date = $('#passport_finished_date').val();
    const visaCreatedDate = $('#visa_created_date').val();
    const visaFinishedDate = $('#visa_finished_date').val();
    const clientEnteranceDate = $('#client_enterance_date').val();
    const visaImage = $('#visa_file')[0].files[0];
    const passportImage = $('#client_passport')[0].files[0];
    const clientImage = $('#client_photograph')[0].files[0];
    const permitImage = $('#permit')[0].files[0];

    // Basic validation
    if (!passportNumber || !passport_created_date || !passport_finished_date ||
        !arabicFirstName || !arabicSecondName || !arabicThirdName || !arabicFourthName || !birthDate ||
        !englishFirstName || !englishSecondName || !englishThirdName || !englishFourthName || !gender ||
        !visaType || !category || !visaAmount || !insurance || !discount || !total || !warranty ||
        !visaCreatedDate || !visaFinishedDate || !clientImage || !passportImage) {
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
    formData.append('birthDate', birthDate);
    formData.append('gender', gender);
    formData.append('discount', discount);
    formData.append('total_amount', total);
    formData.append('warranty', warranty);
    formData.append('category', category);
    formData.append('passport_created_date', passport_created_date);
    formData.append('passport_finished_date', passport_finished_date);
    formData.append('visa_created_date', visaCreatedDate);
    formData.append('visa_finished_date', visaFinishedDate);
    formData.append('client_enterance_date', clientEnteranceDate);
    if (visaImage) {
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


    

});

// Calculate total after discount
$('#discount').on('change', function () {
    const visaAmount = $('#visa_amount').val();
    const discount = $(this).val();
    const total = visaAmount - discount;
    if (total < 0) {
        alertMsg('الخصم لا يمكن أن يكون أكبر من مبلغ التأشيرة', 'warning');
        $(this).val(0);
        $('#total').val(visaAmount);
        return;
    }
    $('#total').val(total);
});


$('#warranty').on('change', async function () {
    const warranty = $(this).val();
    if (warranty === 'true') {
        const visaId = $('#visasOptions').val();
        if (!visaId) {
            alertMsg('الرجاء اختيار نوع التأشيرة أولاً', 'warning');
            $(this).val('');
            $('#insurance').val(0);
            return;
        }
        try {
            const response = await sendGetRequest(`visa/${visaId}`, {}, authorizedHeader);
            if (response) {
                const visaDetails = response.data;
                $('#insurance').val(visaDetails.insurance);
            }
        } catch (error) {
            handleError(error);
        }
    } else {
        $('#insurance').val(0);
    }
});