$(window).on('load', async function () {
    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    try {
        const response = await sendGetRequest(`client/${id}`, {}, authorizedHeader);
        
        if (response) {
            const client = response.data;
            setVisas();
            const visa_created_date = new Date(client.visa_created_date).toISOString().slice(0, 10);
            const visa_finished_date = new Date(client.visa_finished_date).toISOString().slice(0, 10);
            const passport_created_date = new Date(client.passport_created_date).toISOString().slice(0, 10);
            const passport_finished_date = new Date(client.passport_finished_date).toISOString().slice(0, 10);
            const birthDate = new Date(client.birthDate).toISOString().slice(0, 10);
            $('#passport_no').val(client.passport_no);
            $('#passport_created_date').val(passport_created_date);
            $('#passport_finished_date').val(passport_finished_date);
            $('#ar_first_name').val(client.ar_first_name);
            $('#ar_second_name').val(client.ar_second_name);
            $('#ar_third_name').val(client.ar_third_name);
            $('#ar_fourth_name').val(client.ar_fourth_name);
            $('#birthDate').val(birthDate);
            $('#en_first_name').val(client.en_first_name);
            $('#en_second_name').val(client.en_second_name);
            $('#en_third_name').val(client.en_third_name);
            $('#en_fourth_name').val(client.en_fourth_name);
            $('#gender').val(client.gender);
            $('#phone').val(client.phone);
            $('#visasOptions').text(client.visa_type);
            $('#category').val(client.category);
            $('#visa_amount').val(client.visa_amount);
            $('#visa_amount_currency').val('درهم اماراتي');
            $('#warranty').val((client.warranty).toString());
            $('#deposit').val(client.deposit);
            $('#discount').val(client.discount);
            $('#total').val(client.total_amount);
            $('#visa_created_date').val(visa_created_date);
            $('#visa_finished_date').val(visa_finished_date);
            if (client.client_enterance_date) {
                const client_entrance_date = new Date(client.client_enterance_date).toISOString().slice(0, 10);
                $('#client_enterance_date').val(client_entrance_date);
            }
            

        }
    } catch (error) {
        handleError(error)
    }
});

$('#update-client').on('click', async function updateClient(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const dataObject = {};
    dataObject.passport_no = $('#passport_no').val();
    dataObject.passport_created_date = $('#passport_created_date').val();
    dataObject.passport_finished_date = $('#passport_finished_date').val();
    dataObject.ar_first_name = $('#ar_first_name').val();
    dataObject.ar_second_name = $('#ar_second_name').val();
    dataObject.ar_third_name = $('#ar_third_name').val();
    dataObject.ar_fourth_name = $('#ar_fourth_name').val();
    dataObject.birthDate = $('#birthDate').val();
    dataObject.en_first_name = $('#en_first_name').val();
    dataObject.en_second_name = $('#en_second_name').val();
    dataObject.en_third_name = $('#en_third_name').val();
    dataObject.en_fourth_name = $('#en_fourth_name').val();
    dataObject.gender = $('#gender').val();
    dataObject.phone = $('#phone').val();
    dataObject.visa_type = $('#visasOptions').val();
    dataObject.category = $('#category').val();
    dataObject.visa_amount = $('#visa_amount').val();
    dataObject.deposit = $('#deposit').val();
    dataObject.discount = $('#discount').val();
    dataObject.total_amount = $('#total').val();
    dataObject.visa_amount_currency = 'AED';
    dataObject.warranty = $('#warranty').val();
    dataObject.visa_created_date = $('#visa_created_date').val();
    dataObject.visa_finished_date = $('#visa_finished_date').val();
    if($('#client_enterance_date').val()){
        dataObject.client_enterance_date = $('#client_enterance_date').val();
    }
    try {
        const response = await sendPatchRequest(`client/${id}`, dataObject, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث بيانات العميل بنجاح', 'success');
            setTimeout(() => {
                window.location.href = `/clients/${id}`;
            }, 5000);
        }
    } catch (error) {
        handleError(error);
    }
});
