$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('d', {}, authorizedHeader);
        if (response) {
            const clients = response.clients;
            $('#sumOfVisas').text(clients.result + ' تأشيرة');
            $('#clientsMoneySum').text(parseFloat(clients.clientsMoneySum) + ' درهم');
            $('#ClientsInsuranceSum').text(clients.clientsInsuranceSum + ' درهم');
            $('#ClientsRefunSum').text(clients.refundSum + ' درهم');
            const clientsDocs = clients.data;

            const tableBody = document.getElementById('clients-table-body');
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
                    const finishDateObj = new Date(clientsDocs[listsCounter].visa_finished_date);
                    let formattedClientEnteranceDate;

                    // Format the date to Arabic format
                    const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
                    const formattedFinishedDate = finishDateObj.toLocaleDateString('ar-EG', options);
                    if (clientsDocs[listsCounter].client_enterance_date) {
                        const client_enternace_dateObj = new Date(clientsDocs[listsCounter].client_enterance_date);
                        formattedClientEnteranceDate = client_enternace_dateObj.toLocaleDateString('ar-EG', options);
                    } else {
                        formattedClientEnteranceDate = '---';
                    }
                    tableRows += `
                            <tr id="view-client" data-id="${clientsDocs[listsCounter]._id}" >
                                <td>${listsCounter + 1}</td>
                                <td class="">${clientsDocs[listsCounter].passport_no}</td>
                                <td>${clientsDocs[listsCounter].slug_ar}</td>
                                <td>${clientsDocs[listsCounter].slug_en}</td>
                                <td>${clientsDocs[listsCounter].visa_type}</td>
                                <td>${formattedCreateDate}</td>
                                <td>${formattedFinishedDate}</td>
                                
                                <td>${formattedClientEnteranceDate}</td>
                            </tr>

                    `;

                }
                $('#clients-table-body').append(tableRows);
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
