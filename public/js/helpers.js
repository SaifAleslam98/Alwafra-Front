async function setVisas() {
    try {
        const response = await sendGetRequest('visa', {}, authorizedHeader);
        if (response) {
            const visas = response.data;

            for (const visa of visas) {
                $('#visasOptions').append(new Option(visa.visa, visa._id));
            }
        }
    } catch (error) {
        console.error('Error fetching visa types:', error);
        handleError(error)
    }
}

// Select Visa
$('#visasOptions').on('change', async function () {
    // Inside this function, 'this' refers to the <select> element that triggered the change.
    var selectedValue = $(this).val(); // Get the value of the selected option
    try {
        const response = await sendGetRequest(`visa/${selectedValue}`, {}, authorizedHeader);
        if (response) {
            const visaDetails = response.data;
            $('#visa_amount').val(visaDetails.amount);
            $('#deposit').val(visaDetails.supplier.insuranceAmount);
            $('#warranty').val('true');
            $('#category').val(visaDetails.category);
            const discount = $('#discount').val();
            if (discount === 0 || discount === '') {
                $('#total').val(visaDetails.amount);
                return;
            }
            const total = visaDetails.amount - discount;
            if (total < 0) {
                alertMsg('الخصم لا يمكن أن يكون أقل من صفر', 'warning');
                $('#discount').val(0);
                $('#total').val(visaDetails.amount);
                return;
            }
            $('#total').val(total);
        }
    } catch (error) {
        handleError(error);
    }
});

// add new client
$('#add-client').on('click', async function (e) {
    e.preventDefault();
    const arabicFirstName = $('#ar_first_name').val();
    const arabicSecondName = $('#ar_second_name').val();
    const arabicThirdName = $('#ar_third_name').val();
    const arabicFourthName = $('#ar_fourth_name').val();
    const englishFirstName = $('#en_first_name').val();
    const englishSecondName = $('#en_second_name').val();
    const englishThirdName = $('#en_third_name').val();
    const englishFourthName = $('#en_fourth_name').val();
    const birthDate = $('#birthDate').val();
    const visaType = $('#visasOptions').find('option:selected').text();
    const visaAmount = $('#visa_amount').val();
    const visaCurrency = 'AED'; // Default currency
    const deposit = $('#deposit').val();
    const discount = $('#discount').val() || 0;
    const total = $('#total').val() || visaAmount;
    const warranty = $('#warranty').val() || 'true';
    const category = $('#category').val();
    const gender = $('#gender').val();
    const phone = $('#phone').val();
    const passportNumber = $('#passport_no').val();
    const passport_created_date = $('#passport_created_date').val();
    const passport_finished_date = $('#passport_finished_date').val();
    const visaCreatedDate = $('#visa_created_date').val();
    const visaFinishedDate = $('#visa_finished_date').val();
    const clientEnteranceDate = $('#client_enterance_date').val();
    const visaImage = $('#visa_file')[0].files[0];
    const passportImage = $('#client_passport')[0].files[0];
    const clientImage = $('#client_photograph')[0].files[0];
    const permitImage = $('#permit')[0].files[0];

    // Basic validation
    if (!passportNumber || !passport_created_date || !passport_finished_date ||
        !arabicFirstName || !arabicSecondName || !arabicThirdName || !arabicFourthName || !birthDate ||
        !englishFirstName || !englishSecondName || !englishThirdName || !englishFourthName || !gender ||
        !phone || !visaType || !category || !visaAmount || !deposit || !discount || !total || !warranty ||
        !visaCreatedDate || !visaFinishedDate || !clientImage || !passportImage) {
        alertMsg('الرجاء ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    const formData = new FormData();
    formData.append('ar_first_name', arabicFirstName);
    formData.append('ar_second_name', arabicSecondName);
    formData.append('ar_third_name', arabicThirdName);
    formData.append('ar_fourth_name', arabicFourthName);
    formData.append('en_first_name', englishFirstName);
    formData.append('en_second_name', englishSecondName);
    formData.append('en_third_name', englishThirdName);
    formData.append('en_fourth_name', englishFourthName);
    formData.append('visa_type', visaType);
    formData.append('visa_amount', visaAmount);
    formData.append('visa_amount_currency', visaCurrency);
    formData.append('deposit', deposit);
    formData.append('passport_no', passportNumber);
    formData.append('birthDate', birthDate);
    formData.append('gender', gender);
    formData.append('phone', phone);
    formData.append('discount', discount);
    formData.append('total_amount', total);
    formData.append('warranty', warranty);
    formData.append('category', category);
    formData.append('passport_created_date', passport_created_date);
    formData.append('passport_finished_date', passport_finished_date);
    formData.append('visa_created_date', visaCreatedDate);
    formData.append('visa_finished_date', visaFinishedDate);
    formData.append('client_enterance_date', clientEnteranceDate);
    if (visaImage) {
        formData.append('visa_file', visaImage);
    }
    if (passportImage) {
        formData.append('client_passport', passportImage);
    }
    if (clientImage) {
        formData.append('client_photograph', clientImage);
    }
    if (permitImage) {
        formData.append('permit', permitImage);
    }


    try {

        const response = await sendPostRequest('client', formData, multiPartAuthorizedHeader);
        if (response) {
            alertMsg('تم إضافة العميل بنجاح', 'success');
            // Optionally, reset the form after successful submission
            $('#new-client-form')[0].reset();
        }
    } catch (error) {
        handleError(error);

    }




});

// Calculate total after discount
$('#discount').on('change', function () {
    const visaAmount = $('#visa_amount').val();
    const discount = $(this).val();
    const total = visaAmount - discount;
    if (total < 0) {
        alertMsg('الخصم لا يمكن أن يكون أكبر من مبلغ التأشيرة', 'warning');
        $(this).val(0);
        $('#total').val(visaAmount);
        return;
    }
    $('#total').val(total);
});


$('#warranty').on('change', async function () {
    const warranty = $(this).val();
    if (warranty === 'true') {
        const visaId = $('#visasOptions').val();
        if (!visaId) {
            alertMsg('الرجاء اختيار نوع التأشيرة أولاً', 'warning');
            $(this).val('');
            $('#deposit').val(0);
            return;
        }
        try {
            const response = await sendGetRequest(`visa/${visaId}`, {}, authorizedHeader);
            if (response) {
                const visaDetails = response.data;
                $('#deposit').val(visaDetails.supplier.insuranceAmount);
            }
        } catch (error) {
            handleError(error);
        }
    } else {
        $('#deposit').val(0);
    }
});

function formatNumber(number) {
    const formatter = new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency:'AED',
        minimumFractionDigits: 2, // Ensures at least two decimal places
        maximumFractionDigits: 2, // Ensures no more than two decimal places
    });
    return formatter.format(number);
}

// Function to set deposit data
function depositDataTable(data) {
    const clients = data
    const tableBody = document.getElementById('depositTableBody');
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
            let refundStatus = '';
            let payButton = '';
            // Ckeck the payment status
            if (clients[listsCounter].paidDeposit <= 0 && clients[listsCounter].refundStatus === 'pending') {
                refundStatus = '<div class="process-status pending">لم يسدد</div>'
                payButton = `<button class="button openModal" id="${clients[listsCounter]._id}">سداد</button>`
            } else if (clients[listsCounter].refundStatus === 'not_required') {
                refundStatus = '<div class="process-status purple">غير مطلوب</div>'
                
            } else if (clients[listsCounter].paidDeposit < clients[listsCounter].deposit) {
                refundStatus = '<div class="process-status partial">جزئي</div>'
                payButton = `<button class="button openModal" id="${clients[listsCounter]._id}">سداد</button>`
            } else if (clients[listsCounter].paidDeposit = clients[listsCounter].deposit) {
                refundStatus = '<div class="process-status completed">تم السداد</div>'
            }
            const visaCreatedDateObj = new Date(clients[listsCounter].visa_created_date);
            const formattedVisaCreatedDate = visaCreatedDateObj.toLocaleDateString('ar-EG', options);
            tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td id="serial-${clients[listsCounter]._id}">${clients[listsCounter].serialNumber}</td>
                                    <td>${clients[listsCounter].slug_ar}</td>
                                    <td>${clients[listsCounter].visa_type}</td>
                                    <td>${formattedVisaCreatedDate}</td>
                                    <td id="dueAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].deposit)}</td>
                                    <td id="paid-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].paidDeposit)}</td>
                                    <td id="refundedAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].refundedAmount)}</td>
                                    <td>${refundStatus}</td>
                                    <td>
                                        ${payButton}
                                    </td>
                                </tr>
                            `;
        }
    } $('#depositTableBody').append(tableRows);
    if (clients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="10" class="text-center">لا يوجد بيانات.</td>
                `;
        tableBody.appendChild(row);
    }
}

// Function to set refunds data
function refundDataTable(data) {
    const clients = data
    const tableBody = document.getElementById('refundsTableBody');
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
            
            const visaCreatedDateObj = new Date(clients[listsCounter].createdAt);
            const formattedVisaCreatedDate = visaCreatedDateObj.toLocaleDateString('ar-EG', options);
            tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td id="serial-${clients[listsCounter]._id}">${clients[listsCounter].serialNumber}</td>
                                    <td>${clients[listsCounter].serviceId.slug_ar}</td>
                                    <td>${clients[listsCounter].serviceId.visa_type}</td>
                                    <td>${formattedVisaCreatedDate}</td>
                                    <td id="dueAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].serviceId.deposit)}</td>
                                    <td id="paid-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].serviceId.paidDeposit)}</td>
                                    <td id="refundedAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].serviceId.refundedAmount)}</td>
                                    
                                </tr>
                            `;
        }
    } $('#refundsTableBody').append(tableRows);
    if (clients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="10" class="text-center">لا يوجد بيانات.</td>
                `;
        tableBody.appendChild(row);
    }
}

// Function to set deposit back data
function depositBackDataTable(data) {
    const clients = data
    const tableBody = document.getElementById('depositBackTableBody');
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
            let depositStatus='';

            const visaCreatedDateObj = new Date(clients[listsCounter].visa_created_date);
            const formattedVisaCreatedDate = visaCreatedDateObj.toLocaleDateString('ar-EG', options);
            tableRows += `
                                <tr>
                                    <td>${listsCounter + 1}</td>
                                    <td id="serial-${clients[listsCounter]._id}">${clients[listsCounter].serialNumber}</td>
                                    <td id="name-${clients[listsCounter]._id}">${clients[listsCounter].slug_ar}</td>
                                    <td>${clients[listsCounter].visa_type}</td>
                                    <td>${formattedVisaCreatedDate}</td>
                                    <td id="dueAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].deposit)}</td>
                                    <td id="paid-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].paidDeposit)}</td>
                                    <td id="refundedAmount-${clients[listsCounter]._id}">${formatNumber(clients[listsCounter].refundedAmount)}</td>
                                    <td><div class="process-status pending">لم يسترد</div></td>
                                    <td>
                                        <button class="button openModal" id="${clients[listsCounter]._id}">إسترداد</button>
                                    </td>
                                </tr>
                            `;
        }
    } $('#depositBackTableBody').append(tableRows);
    if (clients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="10" class="text-center">لا يوجد بيانات.</td>
                `;
        tableBody.appendChild(row);
    }
}