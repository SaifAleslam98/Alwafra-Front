$(window).on('load', async function () {
    // You can add any initialization code here if needed
    try {
        const visaResponse = await sendGetRequest('visa', {}, authorizedHeader);
        if (visaResponse) {
            const visas = visaResponse.data;
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
                                <td>
                                <button type="button" class="btn btn-primary openModal" id="${visas[listsCounter]._id}">تعديل</button>
                                <button type="button" class="btn btn-danger openDeleteModal" id="${visas[listsCounter]._id}">حذف</button>
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
                    <td colspan="5" class="text-center">لا يوجد تأشيرات</td>
                `;
                tableBody.appendChild(row);
            }
        }
        const permResponse = await sendGetRequest('perm', {}, authorizedHeader);
        if (permResponse) {
            const permit = permResponse.data;
            const tableBody = document.getElementById('permit-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            if (permit.length > 0) {
                for (let listsCounter = 0; listsCounter < permit.length; listsCounter++) {
                    tableRows += `
                            <tr id="row-${permit[listsCounter]._id}">
                                <td>${listsCounter + 1}</td>
                                <td id="permit-${permit[listsCounter]._id}">${permit[listsCounter].permit}</td>
                                <td id="price-${permit[listsCounter]._id}">${permit[listsCounter].price}</td>
                                <td>
                                <button type="button" class="btn btn-primary openPermitUpdateModal" id="${permit[listsCounter]._id}">تعديل</button>
                                <button type="button" class="btn btn-danger openPermitDeleteModal" id="${permit[listsCounter]._id}">حذف</button>
                                </td>
                            </tr>

                    `;

                }
                $('#permit-table-body').append(tableRows);
            }
            // Optionally, you can add a message if no clients are found
            if (permit.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="4" class="text-center">لا يوجد إقامات</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {

    }
});

/** ******************** Visa ******************** */
// New Visa Save Button Click
$('#save-visa-button').on('click', async function () {
    const visaType = $('#visa').val();
    const amount = $('#amount').val();
    const currency = 'AED'; // Assuming currency is fixed as AED

    if (!visaType || !amount || !currency) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
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
            alertMsg('تمت إضافة صنف التأشيرة بنجاح!', 'success');
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
$('#edit-visa-button').on('click', async function () {
    const visaId = $('#visa-id').val();
    const updatedVisaType = $('#edit-visa-type').val();
    const updatedAmount = $('#edit-visa-amount').val();

    if (!updatedVisaType || !updatedAmount) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const updatedData = {
        visa: updatedVisaType,
        amount: updatedAmount
    };

    try {
        const response = await sendPatchRequest(`visa/${visaId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث نوع التأشيرة بنجاح!', 'success');
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
$('#confirm-delete-visa-button').on('click', async function () {
    const visaId = $('#delete-visa-id').val();

    try {
        const response = await sendDeleteRequest(`visa/${visaId}`, {}, authorizedHeader);
        if (response) {
            alertMsg('تم حذف نوع التأشيرة بنجاح!', 'success');
            // Remove the table row
            $(`#row-${visaId}`).remove();
            closeModal('deleteVisaModal');
        }
    } catch (error) {
        handleError(error);
    }
});

/** ******************** Permit ******************** */
// New Permit Save Button Click
$('#save-permit-button').on('click', async function () {
    const permit = $('#permit').val();
    const price = $('#price').val();

    if (!permit || !price) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const permitData = {
        permit,price
    };

    try {
        const response = await sendPostRequest('perm', permitData, authorizedHeader);
        if (response) {
            alertMsg('تمت إضافة صنف الإقامة بنجاح!', 'success');
            closeModal('newPermitModal');
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        handleError(error);
    }
});

// Edit Permit Modal
$(document).on('click', '.openPermitUpdateModal', async function () {
    openModal('updatePermitModal');
    const permitId = $(this).attr('id');
    const permit = $(`#permit-${permitId}`).text();
    const price = $(`#price-${permitId}`).text();
    document.getElementById("permit-id").value = permitId;
    document.getElementById("edit-permit-type").value = permit;
    document.getElementById("edit-permit-price").value = price;

});

// Update Permit Button Click
$('#edit-permit-button').on('click', async function () {
    const permitId = $('#permit-id').val();
    const permit = $('#edit-permit-type').val();
    const price = $('#edit-permit-price').val();

    if (!permit || !price) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const updatedData = {
        permit,price
    };

    try {
        const response = await sendPatchRequest(`perm/${permitId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث نوع الإقامة بنجاح!', 'success');
            // Update the table row with new data
            $(`#permit-${permitId}`).text(permit);
            $(`#price-${permitId}`).text(price);
            closeModal('updatePermitModal');
        }
    } catch (error) {
        handleError(error);
    }
});

// Delete Permit Modal
$(document).on('click', '.openPermitDeleteModal', async function () {
    openModal('deletePermitModal');
    const deletePermitId = $(this).attr('id');
    document.getElementById("delete-permit-id").value = deletePermitId;
});

// Confirm Delete Permit Button Click
$('#confirm-delete-permit-button').on('click', async function () {
    const permitId = $('#delete-permit-id').val();

    try {
        const response = await sendDeleteRequest(`perm/${permitId}`, {}, authorizedHeader);
        if (response) {
            alertMsg('تم حذف نوع الإقامة بنجاح!', 'success');
            // Remove the table row
            $(`#row-${permitId}`).remove();
            closeModal('deletePermitModal');
        }
    } catch (error) {
        handleError(error);
    }
});