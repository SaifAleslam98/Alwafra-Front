$(window).on('load', async function() {
    // You can add any initialization code here if needed
    try {
         const response = await sendGetRequest('visa', {}, authorizedHeader);
        if (response) {
            const visas = response.data;
            const tableBody = document.getElementById('visas-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            if (visas.length > 0) {
                for (let listsCounter = 0; listsCounter < visas.length; listsCounter++) {
                    tableRows += `
                            <tr id="row-${visas[listsCounter]._id}">
                                <td>${listsCounter + 1}</td>
                                <td id="visa-${visas[listsCounter]._id}">${visas[listsCounter].visa}</td>
                                <td id="amount-${visas[listsCounter]._id}">${visas[listsCounter].amount}</td>
                                <td>${visas[listsCounter].currency}</td>
                                <td><button type="button" class="btn btn-warning openModal" id="${visas[listsCounter]._id}"><i class="pe-7s-refresh-2"></i></button></td>
                                <td>
                                    <button type="button" class="btn btn-danger openDeleteModal" id="${visas[listsCounter]._id}"><i class="pe-7s-trash"></i></button>

                                </td>
                            </tr>

                    `;

                }
                $('#visas-table-body').append(tableRows);
            }
            // Optionally, you can add a message if no clients are found
            if (visas.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center">لا يوجد تأشيرات</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        
    }
});

// New Visa Save Button Click
$('#save-visa-button').on('click', async function() {
    const visaType = $('#visa').val();
    const amount = $('#amount').val();
    const currency = 'AED'; // Assuming currency is fixed as AED

    if (!visaType || !amount || !currency) {
        alertMsg('الرجاء ملء جميع الحقول.','warning');
        return;
    }

    const visaData = {
        visa: visaType,
        amount: amount,
        currency: currency
    };

    try {
        const response = await sendPostRequest('visa', visaData, authorizedHeader);
        if (response) {
            alertMsg('تمت إضافة نوع التأشيرة بنجاح!','success');
            closeModal('newVisaModal');
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        handleError(error);
    }
});

// Edit Visa Modal
$(document).on('click', '.openModal', async function () {
    openModal('updateVisaModal');
    const visaId = $(this).attr('id');
    const visaType = $(`#visa-${visaId}`).text();
    const visaAmount = $(`#amount-${visaId}`).text();
    document.getElementById("visa-id").value = visaId;
    document.getElementById("edit-visa-type").value = visaType;
    document.getElementById("edit-visa-amount").value = visaAmount;

});

// Update Visa Button Click
$('#edit-visa-button').on('click', async function() {
    const visaId = $('#visa-id').val();
    const updatedVisaType = $('#edit-visa-type').val();
    const updatedAmount = $('#edit-visa-amount').val();

    if (!updatedVisaType || !updatedAmount) {
        alertMsg('الرجاء ملء جميع الحقول.','warning');
        return;
    }

    const updatedData = {
        visa: updatedVisaType,
        amount: updatedAmount
    };

    try {
        const response = await sendPatchRequest(`visa/${visaId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث نوع التأشيرة بنجاح!','success');
            // Update the table row with new data
            $(`#visa-${visaId}`).text(updatedVisaType);
            $(`#amount-${visaId}`).text(updatedAmount);
            closeModal('updateVisaModal');
        }
    } catch (error) {
        handleError(error);
    }
});

// Delete Visa Modal
$(document).on('click', '.openDeleteModal', async function () {
    openModal('deleteVisaModal');
    const deleteVisaId = $(this).attr('id');
    document.getElementById("delete-visa-id").value = deleteVisaId;
});

// Confirm Delete Visa Button Click
$('#confirm-delete-visa-button').on('click', async function() {
    const visaId = $('#delete-visa-id').val();

    try {
        const response = await sendDeleteRequest(`visa/${visaId}`,{}, authorizedHeader);
        if (response) {
            alertMsg('تم حذف نوع التأشيرة بنجاح!','success');
            // Remove the table row
            $(`#row-${visaId}`).remove();
            closeModal('deleteVisaModal');
        }
    } catch (error) {
        handleError(error);
    }
});