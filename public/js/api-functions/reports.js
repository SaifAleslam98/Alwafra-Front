$('#visaFilterOption').on('change', async function () {
    $('#clients-report-table-body').html('');
    const filter = $(this).val();
    const filterObj = filterOption(filter, 'createdAt');
    try {
        const response = await sendGetRequest(`d${filterObj}`, {}, authorizedHeader);
        if (response) {
            const myClients = response.clients;
            setClientsIntoTable(myClients, 'clients-report-table-body')
        }
    } catch (error) {
        handleError(error)
    }
});

$('#insuranceFilterOption').on('change', async function () {
    $('#clients-report-table-body').html('');
    const filter = $(this).val();
    const filterObj = filterOption(filter, 'createdAt');
    try {
        const response = await sendGetRequest(`d${filterObj}`, {}, authorizedHeader);
        if (response) {
            const clients = response.clients;
            const clientsDocs = clients.data;
            const tableBody = document.getElementById('clients-indurance-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            if (clientsDocs.length > 0) {
                for (let listsCounter = 0; listsCounter < clientsDocs.length; listsCounter++) {
                    const createDateObj = new Date(clientsDocs[listsCounter].visa_created_date);

                    // Format the date to Arabic format
                    const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
                    tableRows += `
                            <tr id="view-client" data-id="${clientsDocs[listsCounter]._id}" >
                                <td>${listsCounter + 1}</td>
                                <td class="">${clientsDocs[listsCounter].passport_no}</td>
                                <td>${clientsDocs[listsCounter].slug_ar}</td>
                                <td>${clientsDocs[listsCounter].slug_en}</td>
                                <td>${clientsDocs[listsCounter].visa_type}</td>
                                <td>${formattedCreateDate}</td>
                                <td>${clientsDocs[listsCounter].insurance} درهم إماراتي</td>
                            </tr>

                    `;

                }
                tableRows += `
                        <tr>
                                <td colspan="7" class="text-center"><b>الإجمالي : </b>${clients.clientsInsuranceSum} درهم إماراتي</td>

                        </tr>
                `;
                $(`#clients-indurance-table-body`).append(tableRows);
            }
            // Optionally, you can add a message if no clients are found
            if (clientsDocs.length <= 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد عملاء مسجلين</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        handleError(error)
    }
});

$('#refundFilterOption').on('change', async function () {
    $('#clients-refund-table').html('');
    const filter = $(this).val();
    const filterObj = filterOption(filter, 'createdAt');
    try {
        const response = await sendGetRequest(`refund${filterObj}`, {}, authorizedHeader);
        if (response) {
            let sumOfRefund = 0;
            const refunds = response.data;
            const tableBody = document.getElementById('clients-refund-table');
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
                    sumOfRefund = sumOfRefund + refunds[listsCounter].refundable_amount;
                    tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td id="passport-${refunds[listsCounter]._id}">${refunds[listsCounter].client_visa_id.passport_no}</td>
                                    <td>${refunds[listsCounter].client_visa_id.slug_ar}</td>
                                    <td id="amount-${refunds[listsCounter]._id}">${refunds[listsCounter].refundable_amount} درهم إماراتي</td>
                                    <td>${formattedCreateDate}</td>
                                    <td id="updatedDate-${refunds[listsCounter]._id}">${formattedUpdatedDate}</td>
                                </tr>
                            `;
                }
                tableRows += `
                        <tr>
                                <td colspan="7" class="text-center"><b>الإجمالي : </b>${sumOfRefund} درهم إماراتي</td>

                        </tr>
                `;
            } $('#clients-refund-table').append(tableRows);
            if (refunds.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد مبالغ تأمينات مسترجعة الى الآن.</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        handleError(error)
    }
});