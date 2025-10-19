$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('payment', {}, authorizedHeader);
        if(response){
            const payments = response.data;
            const tableBody = document.getElementById('paymentTableBody');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            if(payments.length > 0){
                for(let listsCounter = 0; listsCounter < payments.length; listsCounter++){
                    const paymentCreatedDateObj = new Date(payments[listsCounter].createdAt);
                    const formattedPaymentCreatedDate = paymentCreatedDateObj.toLocaleDateString('ar-EG', options);
                    tableRows += `
                            <tr>
                                <td>${listsCounter + 1}</td>
                                <td id="serial-${payments[listsCounter]._id}">${payments[listsCounter].serialNumber}</td>
                                <td>${payments[listsCounter].serviceId.slug_ar}</td>
                                <td>${payments[listsCounter].serviceType}</td>
                                <td id="paid-${payments[listsCounter]._id}">${formatNumber(payments[listsCounter].amount)}</td>
                                <td>${formattedPaymentCreatedDate}</td>
                                <td>
                                    
                                </td>
                            </tr>    
                            `;
                }
            }
            $('#paymentTableBody').append(tableRows);
            if (payments.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد تأشيرات مدخلة الى الآن.</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        handleError(error);
    }
});