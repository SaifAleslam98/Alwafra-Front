$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('payment', {}, authorizedHeader);
        if (response) {
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
            if (payments.length > 0) {
                for (let listsCounter = 0; listsCounter < payments.length; listsCounter++) {
                    const paymentCreatedDateObj = new Date(payments[listsCounter].createdAt);
                    const formattedPaymentCreatedDate = paymentCreatedDateObj.toLocaleDateString('ar-EG', options);
                    tableRows += `
                            <tr>
                                <td>${listsCounter + 1}</td>
                                <td id="serial-${payments[listsCounter]._id}">${payments[listsCounter].serialNumber}</td>
                                <td id="name-${payments[listsCounter]._id}">${payments[listsCounter].serviceId.slug_ar}</td>
                                <td>
                                    ${payments[listsCounter].serviceType}
                                    <input id="visa-${payments[listsCounter]._id}" type="hidden" value="${payments[listsCounter].serviceId.visa_type}" />
                                </td>
                                <td id="paid-${payments[listsCounter]._id}">${formatNumber(payments[listsCounter].amount)}</td>
                                <td>
                                    ${formattedPaymentCreatedDate}
                                    <input id="date-${payments[listsCounter]._id}" type="hidden" value="${payments[listsCounter].createdAt}" />
                                </td>
                                <td>
                                    <a href="/finance/invoice/${payments[listsCounter]._id}" class="button pdf-btn" id="${payments[listsCounter]._id}"><i class="fa fa-print"></i></a>
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

// PDF button
$(document).on('click', '.pdf-btn', async function () {
    const id = $(this).attr('id');
    const serial = $(`#serial-${id}`).text();
    const name = $(`#name-${id}`).text();
    const visa = $(`#visa-${id}`).val();
    const paid = $(`#paid-${id}`).text();
    const date = $(`#date-${id}`).val();
    const body = {serial,name,visa,paid,date}
    const res = await axios.post('/finance/generate-pdf',[body])
    console.log(id)
})