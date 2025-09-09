$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('permit', {}, authorizedHeader);
        if (response) {
            const permits = response.data;
            setData(permits)
        }
    } catch (error) {
        handleError(error)
    }
});

function setData(data) {
    const clients = data
    const tableBody = document.getElementById('permitsTableBody');
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
            const createDateObj = new Date(clients[listsCounter].issue_date);
            const finishDateObj = new Date(clients[listsCounter].expiry_date);

            // Format the date to Arabic format
            const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
            const formattedFinishedDate = finishDateObj.toLocaleDateString('ar-EG', options);
            tableRows += `
                            <tr id="view-client" data-id="${clients[listsCounter]._id}" >
                                <td>${listsCounter + 1}</td>
                                <td class="">${clients[listsCounter].passport_no}</td>
                                <td>${clients[listsCounter].slug_ar}</td>
                                <td>${clients[listsCounter].permit_number}</td>
                                <td>${clients[listsCounter].permit_type}</td>
                                <td>${clients[listsCounter].city}</td>
                                <td>${clients[listsCounter].status}</td>
                                <td>${formattedCreateDate}</td>
                                <td>${formattedFinishedDate}</td>
                            </tr>

                    `;

        }
        $('#permitsTableBody').append(tableRows);
    }
    // Optionally, you can add a message if no clients are found
    if (clients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="9" class="text-center">لا توجد إقامات مسجلة</td>
                `;
        tableBody.appendChild(row);
    }
}