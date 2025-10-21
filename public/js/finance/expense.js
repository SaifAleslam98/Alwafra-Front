$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('expense', {}, authorizedHeader);
        if (response) {
            const expense = response.data;
            const tableBody = document.getElementById('expenseTableBody');
            tableBody.innerHTML = ''; // Clear existing rows
            let tableRows = '';
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            if(expense.length > 0){
                for(let listsCounter = 0; listsCounter < expense.length; listsCounter++){
                    const expenseCreatedDateObj = new Date(expense[listsCounter].createdAt);
                    const formattedExpenseCreatedDate = expenseCreatedDateObj.toLocaleDateString('ar-EG', options);
                    tableRows += `
                            <tr>
                                <td>${listsCounter + 1}</td>
                                <td id="title-${expense[listsCounter]._id}">${expense[listsCounter].title}</td>
                                <td>${expense[listsCounter].category}</td>
                                <td id="amount-${expense[listsCounter]._id}">${formatNumber(expense[listsCounter].amount)}</td>
                                <td>${formattedExpenseCreatedDate}</td>
                                <td>${expense[listsCounter].comment}</td>

                            </tr>    
                            `;
                }
            }
            $('#expenseTableBody').append(tableRows);
            if (expense.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="6" class="text-center">لا يوجد منصرفات مدخلة الى الآن.</td>
                `;
                tableBody.appendChild(row);
            }
        }

    } catch (error) {
        console.log(error)
        alertMsg('حدث خطأ أثناء جلب البيانات.', 'danger');
    }
});

// New Expense Button Click
$('#expense-save').on('click', async function(){
    const title = $('#title').val();
    const category = $('#category').val();
    const amount = $('#amount').val();
    const comment = $('#comment').val();
    if(!title || !category|| !amount || !comment){
        return alertMsg('الرجاء ملء جميع الحقول المطلوبة', 'warning');
    }
    const expenseData = {title,category,amount,comment}
    try {
        const response = await sendPostRequest(`expense`, expenseData, authorizedHeader);
        if (response) {
            alertMsg('تمت تسجيل المنصرف بنجاح', 'success')
            setTimeout(location.reload(), 2000)
        }
    } catch (error) {
        handleError(error)
    }
})