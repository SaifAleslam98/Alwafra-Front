$(window).on('load', async function () {
    // You can add any initialization code here if needed
    try {
        const supplierResponse = await sendGetRequest('supplier', {}, authorizedHeader);
        if (supplierResponse) {
            const suppliers = supplierResponse.data;
            const supplierTableBody = document.getElementById('supplier-table-body');
            supplierTableBody.innerHTML = ''; // Clear existing rows
            let rows = '';
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            if (suppliers.length > 0) {
                for (let listsCounter = 0; listsCounter < suppliers.length; listsCounter++) {

                    $('#supplier').append(new Option(suppliers[listsCounter].supplierName, suppliers[listsCounter]._id));
                    $('#updatedSupplier').append(new Option(suppliers[listsCounter].supplierName, suppliers[listsCounter]._id));

                    const enteredDate = new Date(suppliers[listsCounter].createdAt);
                    // Format the date to Arabic format
                    const formattedEnteredDate = enteredDate.toLocaleDateString('ar-EG', options);
                    rows += `
                    <tr id="row-${suppliers[listsCounter]._id}">
                        <td>${listsCounter + 1}</td>
                        <td id="name-${suppliers[listsCounter]._id}">${suppliers[listsCounter].supplierName}</td>
                        <td id="phone-${suppliers[listsCounter]._id}">${suppliers[listsCounter].supplierPhone}</td>
                        <td id="insurance-${suppliers[listsCounter]._id}">${suppliers[listsCounter].insuranceAmount}</td>
                        <td>${formattedEnteredDate}</td>
                        <td>
                            <button type="button" class="button updateSupplierModal" id="${suppliers[listsCounter]._id}">تعديل</button>
                            <button type="button" class="button deleteSupplierModal" id="${suppliers[listsCounter]._id}">حذف</button>
                        </td>
                    </tr>
                `;
                }

                $('#supplier-table-body').append(rows);
            }
            // Optionally, you can add a message if no clients are found
            if (suppliers.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" class="text-center">لا يوجد موردين</td>
                `;
                supplierTableBody.appendChild(row);
            }
        }
        const visaResponse = await sendGetRequest('visa', {}, authorizedHeader);
        if (visaResponse) {
            const visas = visaResponse.data;
            const tableBody = document.getElementById('visas-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            let category = '';
            if (visas.length > 0) {
                for (let listsCounter = 0; listsCounter < visas.length; listsCounter++) {
                    if (visas[listsCounter].category === 'child') {
                        category = 'أطفال';
                    } else if (visas[listsCounter].category === 'adult') {
                        category = 'كبار';
                    } else {
                        category = visas[listsCounter].category;
                    }
                    tableRows += `
                            <tr id="row-${visas[listsCounter]._id}">
                                <td>${listsCounter + 1}</td>
                                <td id="visa-${visas[listsCounter]._id}">${visas[listsCounter].visa}</td>
                                <td id="amount-${visas[listsCounter]._id}">${visas[listsCounter].amount}</td>
                                <td>${visas[listsCounter].currency}</td>
                                <td id="category-${visas[listsCounter]._id}">${category}</td>
                                <td id="supplier-${visas[listsCounter]._id}" data-id="${visas[listsCounter].supplier._id}">${visas[listsCounter].supplier.supplierName}</td>
                                <td id="insurance-${visas[listsCounter]._id}">${visas[listsCounter].supplier.insuranceAmount}</td>
                                <td>
                                <button type="button" class="button openModal" id="${visas[listsCounter]._id}">تعديل</button>
                                <button type="button" class="button openDeleteVisaModal" id="${visas[listsCounter]._id}">حذف</button>
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
                    <td colspan="8" class="text-center">لا يوجد تأشيرات</td>
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
                                <button type="button" class="button openPermitUpdateModal" id="${permit[listsCounter]._id}">تعديل</button>
                                <button type="button" class="button openPermitDeleteModal" id="${permit[listsCounter]._id}">حذف</button>
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
        handleError(error);
    }
});

/** ******************** Supplier ******************** */
// New Supplier Save Button Click
$('#save-supplier-button').on('click', async function () {
    const supplierName = $('#supplierName').val();
    const supplierPhone = $('#supplierPhone').val();
    const insuranceAmount = $('#insuranceAmount').val();

    if (!supplierName || !insuranceAmount || !supplierPhone) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const supplierData = {
        supplierName, insuranceAmount, supplierPhone
    };

    try {
        const response = await sendPostRequest('supplier', supplierData, authorizedHeader);
        if (response) {
            alertMsg('تمت إضافة المورد بنجاح!', 'success');
            closeModal('newSupplyModal');
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        handleError(error);
    }
});

// Edit Supplier Button click
$(document).on('click', '.updateSupplierModal', async function () {
    openModal('updateSupplierModal');
    const supplierId = $(this).attr('id');
    const supplierName = $(`#name-${supplierId}`).text();
    const supplierInsuranceAmount = $(`#insurance-${supplierId}`).text();
    const supplierPhone = $(`#phone-${supplierId}`).text();
    document.getElementById("supplier-id").value = supplierId;
    document.getElementById("edit-supplierName").value = supplierName;
    document.getElementById("edit-insuranceAmount").value = supplierInsuranceAmount;
    document.getElementById("edit-supplierPhone").value = supplierPhone;

});

// Update supplier Button Click
$('#edit-Supplier-button').on('click', async function () {
    const supplierId = $('#supplier-id').val();
    const supplierName = $('#edit-supplierName').val();
    const supplierInsuranceAmount = $('#edit-insuranceAmount').val();
    const supplierPhone = $('#edit-supplierPhone').val();

    if (!supplierName || !supplierInsuranceAmount || !supplierPhone) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const updatedData = {
        supplierName, insuranceAmount: supplierInsuranceAmount, supplierPhone
    };

    try {
        const response = await sendPatchRequest(`supplier/${supplierId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث نوع التأشيرة بنجاح!', 'success');
            // Update the table row with new data
            $(`#name-${supplierId}`).text(supplierName);
            $(`#insurance-${supplierId}`).text(supplierInsuranceAmount);
            $(`#phone-${supplierId}`).text(supplierPhone);
            closeModal('updateSupplierModal');
        }
    } catch (error) {
        handleError(error);
    }
});


// Delete Supplier Button Click
$(document).on('click', '.deleteSupplierModal', async function () {
    openModal('deleteSupplierModal');
    const deleteSupplierId = $(this).attr('id');
    document.getElementById("delete-supplier-id").value = deleteSupplierId;
});

// Confirm Delete Supplier Button Click
$('#confirm-delete-supplier-button').on('click', async function () {
    const supplierId = $('#delete-supplier-id').val();

    try {
        const response = await sendDeleteRequest(`supplier/${supplierId}`, {}, authorizedHeader);
        if (response) {
            alertMsg('تم حذف نوع التأشيرة بنجاح!', 'success');
            // Remove the table row
            $(`#row-${supplierId}`).remove();
            closeModal('deleteSupplierModal');
        }
    } catch (error) {
        handleError(error);
    }
});


/** ******************** Visa ******************** */
// New Visa Save Button Click
$('#save-visa-button').on('click', async function () {
    const visaType = $('#visa').val();
    const amount = $('#amount').val();
    const supplier = $('#supplier').val();
    const category = $('#category').val();
    const currency = 'AED'; // Assuming currency is fixed as AED

    if (!visaType || !amount || !currency || !supplier || !category) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const visaData = {
        visa: visaType,
        amount: amount,
        currency: currency,
        supplier: supplier,
        category: category,
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

// Edit Visa Button Click
$(document).on('click', '.openModal', async function () {
    openModal('updateVisaModal');
    const visaId = $(this).attr('id');
    const visaType = $(`#visa-${visaId}`).text();
    const visaAmount = $(`#amount-${visaId}`).text();
    const visaCategory = $(`#category-${visaId}`).text();
    const visaSupplier = $(`#supplier-${visaId}`).attr('data-id');
    // Set the values in the modal inputs
    if (visaCategory === 'أطفال') {
        $('#edit-visa-category').val('child');
    } else if (visaCategory === 'كبار') {
        $('#edit-visa-category').val('adult');
    } else {
        $('#edit-visa-category').val(visaCategory);
    }

    $('#updatedSupplier').val(visaSupplier);
    document.getElementById("visa-id").value = visaId;
    document.getElementById("edit-visa-type").value = visaType;
    document.getElementById("edit-visa-amount").value = visaAmount;

});

// Update Visa Button Click
$('#edit-visa-button').on('click', async function () {
    const visaId = $('#visa-id').val();
    const updatedVisaType = $('#edit-visa-type').val();
    const updatedAmount = $('#edit-visa-amount').val();
    const updatedCategory = $('#edit-visa-category').val();
    const updatedSupplier = $('#updatedSupplier').val();
    const updatedSupplierName = $('#updatedSupplier option:selected').text();
    const updatedInsurance = $('#edit-visa-insurance').val();

    if (!updatedVisaType || !updatedAmount || !updatedCategory || !updatedSupplier) {
        alertMsg('الرجاء ملء جميع الحقول.', 'warning');
        return;
    }

    const updatedData = {
        visa: updatedVisaType,
        amount: updatedAmount,
        category: updatedCategory,
        supplier: updatedSupplier,
    };

    try {
        const response = await sendPatchRequest(`visa/${visaId}`, updatedData, authorizedHeader);
        if (response) {
            alertMsg('تم تحديث نوع التأشيرة بنجاح!', 'success');
            // Update the table row with new data
            $(`#visa-${visaId}`).text(updatedVisaType);
            $(`#amount-${visaId}`).text(updatedAmount);
            if (updatedCategory === 'child') {
                $(`#category-${visaId}`).text('أطفال');
            } else if (updatedCategory === 'adult') {
                $(`#category-${visaId}`).text('كبار');
            } else {
                $(`#category-${visaId}`).text(updatedCategory);
            }
            $(`#supplier-${visaId}`).text(updatedSupplierName);
            $(`#insurance-${visaId}`).text(updatedInsurance);
            closeModal('updateVisaModal');
        }
    } catch (error) {
        handleError(error);
    }
});

// Delete Visa Button Click
$(document).on('click', '.openDeleteVisaModal', async function () {
    console.log('Delete button clicked');
    openModal('deleteVisasModal');
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
        permit, price
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
        permit, price
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

// Select Supplier Change
$('#supplier').on('change', async function () {
    // Inside this function, 'this' refers to the <select> element that triggered the change.
    var selectedValue = $(this).val(); // Get the value of the selected option
    try {
        const response = await sendGetRequest(`supplier/${selectedValue}`, {}, authorizedHeader);
        if (response) {
            const supplierDetails = response.data;
            $('#insurance').val(supplierDetails.insuranceAmount);

        }
    } catch (error) {
        handleError(error);
    }
});
// Select Edit Supplier Change

$('#updatedSupplier').on('change', async function () {
    // Inside this function, 'this' refers to the <select> element that triggered the change.
    var selectedValue = $(this).val(); // Get the value of the selected option
    try {
        const response = await sendGetRequest(`supplier/${selectedValue}`, {}, authorizedHeader);
        if (response) {
            const supplierDetails = response.data;
            $('#edit-visa-insurance').val(supplierDetails.insuranceAmount);

        }
    } catch (error) {
        handleError(error);
    }
});