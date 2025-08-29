$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('refund', {}, authorizedHeader);
        if (response) {
            
            const refunds = response.data;
            const tableBody = document.getElementById('insuranceTableBody');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            if (refunds.length > 0) {
                for (let listsCounter = 0; listsCounter < refunds.length; listsCounter++) {
                    const createDateObj = new Date(refunds[listsCounter].createdAt);
                    const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
                    const updatedDateObj = new Date(refunds[listsCounter].updatedAt);
                    const formattedUpdatedDate = updatedDateObj.toLocaleDateString('ar-EG', options);
                    tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td id="passport-${refunds[listsCounter]._id}">${refunds[listsCounter].client_visa_id.passport_no}</td>
                                    <td>${refunds[listsCounter].client_visa_id.slug_ar}</td>
                                    <td id="amount-${refunds[listsCounter]._id}">${refunds[listsCounter].refundable_amount}</td>
                                    <td>${formattedCreateDate}</td>
                                    <td id="updatedDate-${refunds[listsCounter]._id}">${formattedUpdatedDate}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm openModal" id="${refunds[listsCounter]._id}" data-id="${refunds[listsCounter].client_visa_id._id}">تعديل</button>
                                        
                                    </td>
                                </tr>
                            `;
                }
            } $('#insuranceTableBody').append(tableRows);
            if (refunds.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد مبالغ تأمينات مسترجعة الى الآن.</td>
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
    openModal('updateRefundModal');
    const refundId = $(this).attr('id');
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