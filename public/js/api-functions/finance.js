$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('client', {}, authorizedHeader);
        if (response) {
            
            const clients = response.data;
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
                    let paymentStatus='';
                    if(clients[listsCounter].paymentStatus == 'pending'){
                        paymentStatus = '<div class="process-status pending">pending</div>'
                    }else if(clients[listsCounter].paymentStatus == 'partial'){
                        paymentStatus = '<div class="process-status partial">partial</div>'
                    }else if(clients[listsCounter].paymentStatus == 'completed'){
                        paymentStatus = '<div class="process-status completed">completed</div>'
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
                                    <td>${formatNumber(clients[listsCounter].total_amount)}</td>
                                    <td>${formatNumber(clients[listsCounter].paidAmount)}</td>
                                    <td>${paymentStatus}</td>
                                    <td>
                                        <button class="button openModal" id="${clients[listsCounter]._id}">سداد</button>
                                    </td>
                                </tr>
                            `;
                }
            } $('#visaTableBody').append(tableRows);
            if (clients.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="9" class="text-center">لا يوجد تأشيرات مدخلة الى الآن.</td>
                `;
                tableBody.appendChild(row);
            }
        }

    } catch (error) {
        console.log(error)
        alertMsg('حدث خطأ أثناء جلب بيانات التأمينات.', 'danger');
    }
});

$(document).on('click', '.openModal', async function () {
    openModal('newPaymentModal');
    const clientId = $(this).attr('id');
    const client_visa_id = $(this).attr('data-id')
    const amount = $(`#amount-${refundId}`).text();
    const passport = $(`#passport-${refundId}`).text();
    document.getElementById("refund-id").value = refundId;
    document.getElementById("client-visa-id").value = client_visa_id;
    document.getElementById("clientPassportNo").value = passport;
    document.getElementById("edit-refund-amount").value = amount;

});

$('#edit-refund-button').on('click', async function () {
    const refundId = $('#refund-id').val();
    const client_visa_id = $('#client-visa-id').val();
    const refundable_amount = document.getElementById("edit-refund-amount").value;

    const updatedData = {
        refundable_amount: refundable_amount,
        client_visa_id
    };
    try {
        const response = await sendPatchRequest(`refund/${refundId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث العملية بنجاح', 'success');
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            // Update the table row with new data
            $(`#amount-${refundId}`).text(refundable_amount);
            const updatedDateObj = new Date(response.data.updatedAt);
            const formattedUpdatedDate = updatedDateObj.toLocaleDateString('ar-EG', options);
            $(`#updatedDate-${refundId}`).text(formattedUpdatedDate);
            closeModal('updateRefundModal');
        }
    } catch (error) {
        handleError(error);
    }
});