$(window).on('load', async function () {
    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    try {
        const response = await sendGetRequest(`client/${id}`, {}, authorizedHeader);
        
        if (response) {
            const client = response.data;
            $('#passport_number').val(client.passport_no);
            $('#client_name').val(`${client.ar_first_name} ${client.ar_second_name} ${client.ar_third_name} ${client.ar_fourth_name}`);
            $('#insurance').val(client.insurance);
            $('#refund').val(client.refund);
        }
    } catch (error) {
        handleError(error)
    }
});

$('#client-refund').on('click', async function clientRefund(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const url = document.URL;
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const insuranceAmount = $('#insurance').val();
    const refundAmount = $('#refund').val();
    if(refundAmount > insuranceAmount){
        alertMsg('مبلغ الإسترجاع لا يمكن أن يكون أكبر من مبلغ التأمين المدفوع', 'danger');
        return;
    }
    const dataObject = {};
    dataObject.refundable_amount = $('#refund').val();
    dataObject.client_visa_id = id;
    try {
        const response = await sendPostRequest(`refund`, dataObject, authorizedHeader);
        if (response) {
            alertMsg('تم إسترجاع مبلغ التأمين بنجاح', 'success');
            setTimeout(() => {
                window.location.href = '/clients';
            }, 2000);
        }
    } catch (error) {
        
        handleError(error)
    }
});