$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('client', {}, authorizedHeader);
        if (response) {
            const clients = response.data;
            depositDataTable(clients)
        }

    } catch (error) {
        console.log(error)
        alertMsg('حدث خطأ أثناء جلب بيانات التأمينات.', 'danger');
    }
});

$(document).on('click', '.openModal', async function () {
    openModal('newPaymentModal');
    // Get values from table 
    const serviceId = $(this).attr('id');
    const serialNumber = $(`#serial-${serviceId}`).text();
    const dueAmount = $(`#dueAmount-${serviceId}`).text();

    // Transfer values to modal
    document.getElementById("serialNumber").value = serialNumber;
    document.getElementById("dueAmount").value = dueAmount;
    document.getElementById("serviceId").value = serviceId;

});

// Deposit Payment
$('#deposit-payment').on('click', async function () {
    const serviceId = $('#serviceId').val();
    const serviceType = 'deposit';
    const serialNumber = $('#serialNumber').val();
    const amount = $('#amount').val();

    if (!serviceId || !serialNumber || !serviceType || !amount) {
        return alertMsg('الرجاء ملء جميع الحقول المطلوبة', 'warning');
    }

    const paymentData = {
        serviceId, serialNumber, serviceType, amount
    };
    try {
        const response = await sendPostRequest(`payment`, paymentData, authorizedHeader);
        if (response) {
            alertMsg('تمت عملية الدفع بنجاح', 'success')
            $('#amount').val('');
            setTimeout(location.reload(), 2000)
        }
    } catch (error) {
        handleError(error);
    }
});