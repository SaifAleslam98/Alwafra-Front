$(window).on('load', async function () {
    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    try {
        const response = await sendGetRequest(`client/${id}`, {}, authorizedHeader);
        const client = response.data;
        if (response) {
            const client = response.data;
            const visa_created_date = new Date(client.visa_created_date).toISOString().slice(0, 10);
            const visa_finished_date = new Date(client.visa_finished_date).toISOString().slice(0, 10);

            $('#client_p').text(client.passport_no);
            $('#ar_first_name').val(client.ar_first_name);
            $('#ar_second_name').val(client.ar_second_name);
            $('#ar_third_name').val(client.ar_third_name);
            $('#ar_fourth_name').val(client.ar_fourth_name);
            $('#en_first_name').val(client.en_first_name);
            $('#en_second_name').val(client.en_second_name);
            $('#en_third_name').val(client.en_third_name);
            $('#en_fourth_name').val(client.en_fourth_name);
            $('#visa_type').val(client.visa_type);
            $('#visa_amount').val(client.visa_amount);
            $('#visa_amount_currency').val('درهم اماراتي');
            $('#insurance').val(client.insurance);
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
    dataObject.passport_no = $('#client_p').text();
    dataObject.ar_first_name = $('#ar_first_name').val();
    dataObject.ar_second_name = $('#ar_second_name').val();
    dataObject.ar_third_name = $('#ar_third_name').val();
    dataObject.ar_fourth_name = $('#ar_fourth_name').val();
    dataObject.en_first_name = $('#en_first_name').val();
    dataObject.en_second_name = $('#en_second_name').val();
    dataObject.en_third_name = $('#en_third_name').val();
    dataObject.en_fourth_name = $('#en_fourth_name').val();
    dataObject.visa_type = $('#visa_type').val();
    dataObject.visa_amount = $('#visa_amount').val();
    dataObject.insurance = $('#insurance').val();
    dataObject.visa_amount_currency = 'EAD';
    dataObject.visa_created_date = $('#visa_created_date').val();
    dataObject.visa_finished_date = $('#visa_finished_date').val();
    dataObject.client_enterance_date = $('#client_enterance_date').val();
    try {
        const response = await sendPatchRequest(`client/${id}`, dataObject, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث بيانات العميل بنجاح', 'success');
            setTimeout(() => {
                window.location.href = `/clients/${id}`;
            }, 5000);
        }
        console.log(response);
    } catch (error) {
        handleError(error);
    }
});
