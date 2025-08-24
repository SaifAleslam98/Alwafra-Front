$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('client', {}, authorizedHeader);
        if (response) {
            const clients = response.data;
            const tableBody = document.getElementById('clients-table-body');
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
                    const createDateObj = new Date(clients[listsCounter].visa_created_date);
                    const finishDateObj = new Date(clients[listsCounter].visa_finished_date);
                    let formattedClientEnteranceDate ;
                    
                    // Format the date to Arabic format
                    const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
                    const formattedFinishedDate = finishDateObj.toLocaleDateString('ar-EG', options);
                    if(clients[listsCounter].client_enterance_date){
                        const client_enternace_dateObj = new Date(clients[listsCounter].client_enterance_date);
                        formattedClientEnteranceDate = client_enternace_dateObj.toLocaleDateString('ar-EG', options);
                    }else{
                        formattedClientEnteranceDate = '---';
                    }
                    tableRows += `
                            <tr id="view-client" data-id="${clients[listsCounter]._id}" >
                                <td>${listsCounter + 1}</td>
                                <td class="">${clients[listsCounter].passport_no}</td>
                                <td>${clients[listsCounter].slug_ar}</td>
                                <td>${clients[listsCounter].slug_en}</td>
                                <td>${clients[listsCounter].visa_type}</td>
                                <td>${formattedCreateDate}</td>
                                <td>${formattedFinishedDate}</td>
                                
                                <td>${formattedClientEnteranceDate}</td>
                            </tr>

                    `;

                }
                $('#clients-table-body').append(tableRows);
            }
            // Optionally, you can add a message if no clients are found
            if (clients.length === 0) {
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

//View Client
$(document).on('click', '#view-client', async function () {
    try {
        let memberId = $(this).attr('data-id');
        document.location.href = `/clients/${memberId}`;
    } catch (error) {
        handleError(error)
    }
})