$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('client?refundStatus=pending&paidDeposit[gt]=0', {}, authorizedHeader);
        if (response) {
            const clients = response.data;
            depositBackDataTable(clients)

        }

    } catch (error) {
        console.log(error)
        alertMsg('حدث خطأ أثناء جلب البيانات.', 'danger');
    }
});

$(document).on('click', '.openModal', async function () {
    openModal('newExpenseRefundModal');
    // Get values from table 
    const serviceId = $(this).attr('id');
    const serial = $(`#serial-${serviceId}`).text();
    const name = $(`#name-${serviceId}`).text();
    const dueAmount = $(`#dueAmount-${serviceId}`).text();

    // Pass Values to modal
    document.getElementById('serviceId').value = serviceId;
    document.getElementById('name').value = name;
    document.getElementById('dueAmount').value = dueAmount;
    document.getElementById('serialNumber').value = serial;

});

// Deposit Back
$('#depositBack-save').on('click', async function () {
    const title = 'مبلغ تأمين';
    const category = 'Deposit';
    const amount = $('#amount').val();
    const comment = $('#comment').val();
    const serviceId = $('#serviceId').val();
    const serviceType = 'deposit';



    if (!serviceId || !category || !serviceType || !amount) {
        return alertMsg('الرجاء ملء جميع الحقول المطلوبة', 'warning');
    }

    const depositData = {
        serviceId, category, serviceType, amount, title, comment
    };
    try {
        const response = await sendPostRequest(`expense`, depositData, authorizedHeader);
        if (response) {
            alertMsg('تمت عملية الدفع بنجاح', 'success')
            setTimeout(location.reload(), 2000)
        }
    } catch (error) {
        handleError(error);
    }
});