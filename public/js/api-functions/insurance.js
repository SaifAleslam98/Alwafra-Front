$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('refund', {}, authorizedHeader);
        if (response) {
            const refunds = response.data;
            const tableBody = document.getElementById('insuranceTableBody');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            if (refunds.length > 0) {
                for (let listsCounter = 0; listsCounter < refunds.length; listsCounter++) {
                    const createDateObj = new Date(refunds[listsCounter].createdAt);
                    const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
                    tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td>${refunds[listsCounter].client_visa_id.passport_no}</td>
                                    <td>${refunds[listsCounter].client_visa_id.slug_ar}</td>
                                    <td>${refunds[listsCounter].refundable_amount}</td>
                                    <td>${formattedCreateDate}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="openEditModal('${refunds[listsCounter]._id}')">تعديل</button>
                                        <button class="btn btn-danger btn-sm" onclick="deleteInsurance('${refunds[listsCounter]._id}')">حذف</button>
                                    </td>
                                </tr>
                            `;
                }
            } $('#insuranceTableBody').append(tableRows);
            if (refunds.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد مبالغ تأمينات مدفوعة الى الآن.</td>
                `;
                tableBody.appendChild(row);
            }
        }

    } catch (error) {
        alertMsg('حدث خطأ أثناء جلب بيانات التأمينات.','danger');
    }
});