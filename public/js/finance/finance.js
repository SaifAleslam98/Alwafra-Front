$(window).on('load', async function () {
    try {
        const financeResponse = await sendGetRequest('d/finance', {}, authorizedHeader);
        if(financeResponse){
            const finance = financeResponse
            $('#paymentMoney').text(formatNumber(finance.payment.paymentSum));
            $('#expenseMoney').text(formatNumber(finance.expense.expenseSum));
            $('#depositMoney').text(formatNumber(finance.deposit.depositSum));
            $('#refundMoney').text(formatNumber(finance.refund.refundSum));
        }
        const response = await sendGetRequest('client', {}, authorizedHeader);
        if (response) {
            const clients = response.data;
            visaDataTable(clients)
        }
    } catch (error) {
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

// Visa Payment
$('#visa-payment').on('click', async function () {
    const serviceId = $('#serviceId').val();
    const serviceType = 'visa';
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

// Function to set visa data
function visaDataTable(data) {
    const clients = data
    const tableBody = document.getElementById('visaTableBody');
    tableBody.innerHTML = ''; // Clear existing rows
    let tableRows = '';
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    if (clients.length > 0) {
        for (let listsCounter = 0; listsCounter < clients.length; listsCounter++) {
            let paymentStatus = '';
            let payButton = '';
            // Ckeck the payment status
            if (clients[listsCounter].paymentStatus === 'pending') {
                paymentStatus = '<div class="process-status pending">لم تسدد</div>'
                payButton = `<button class="button openModal" id="${clients[listsCounter]._id}">سداد</button>`
            } else if (clients[listsCounter].paymentStatus === 'partial') {
                paymentStatus = '<div class="process-status partial">جزئي</div>'
                payButton = `<button class="button openModal" id="${clients[listsCounter]._id}">سداد</button>`
            } else if (clients[listsCounter].paymentStatus === 'completed') {
                paymentStatus = '<div class="process-status completed">مكتمل</div>'
            }
            const visaCreatedDateObj = new Date(clients[listsCounter].visa_created_date);
            const formattedVisaCreatedDate = visaCreatedDateObj.toLocaleDateString('ar-EG', options);
            tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td id="serial-${clients[listsCounter]._id}">${clients[listsCounter].serialNumber}</td>
                                    <td>${clients[listsCounter].slug_ar}</td>
                                    <td>${clients[listsCounter].visa_type}</td>
                                    <td>${formattedVisaCreatedDate}</td>
                                    <td id="total-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].total_amount)}</td>
                                    <td id="paid-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].paidAmount)}</td>
                                    <td id="dueAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].dueAmount)}</td>
                                    <td>${paymentStatus}</td>
                                    <td>
                                        ${payButton}
                                    </td>
                                </tr>
                            `;
        }
    } $('#visaTableBody').append(tableRows);
    if (clients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="10" class="text-center">لا يوجد تأشيرات مدخلة الى الآن.</td>
                `;
        tableBody.appendChild(row);
    }
}

