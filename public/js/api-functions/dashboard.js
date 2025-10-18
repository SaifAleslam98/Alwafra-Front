$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('d', {}, authorizedHeader);
        if (response) {
            const myData = response
            $('#sumOfVisas').text(myData.clients.result + ' تأشيرة');
            $('#clientsMoneySum').text(formatNumber(myData.clientsMoneySum));
            $('#sumOfPermits').text(myData.permits.result + ' إقامة');
            $('#permitsMoneySum').text(formatNumber(myData.permitsMoneySum));
            $('#ClientsInsuranceSum').text(formatNumber(myData.clientsInsuranceSum));
            $('#ClientsRefunSum').text(formatNumber(myData.refundSum));
            setClientsIntoTable({ clientsDocuments: [] }, 'daily-alerts-table-body');
            setClientsIntoTable(myData.clients, 'clients-table-body');
            setupPagination(myData.clients, 'pagination-links');
        }


    } catch (error) {
        handleError(error)
    }
});

$('#filterOption').on('change', async function () {
    $('#sumOfVisas').text('');
    $('#clientsMoneySum').text('');
    $('#permitsMoneySum').text('');
    $('#sumOfPermits').text('');
    $('#ClientsInsuranceSum').text('');
    $('#ClientsRefunSum').text('');
    const filterObj = filterOption($(this).val(), 'createdAt');
    try {
        const response = await sendGetRequest(`d${filterObj}`, {}, authorizedHeader);
        const myData = response;
        $('#sumOfVisas').text(myData.clients.result + ' تأشيرة');
        $('#clientsMoneySum').text(formatNumber(myData.clientsMoneySum));
        $('#sumOfPermits').text(myData.permits.result + ' إقامة');
        $('#permitsMoneySum').text(formatNumber(myData.permitsMoneySum));
        $('#ClientsInsuranceSum').text(formatNumber(myData.clientsInsuranceSum));
        $('#ClientsRefunSum').text(formatNumber(myData.refundSum));
    } catch (error) {
        handleError(error)
    }
});

$('#visaFilterOption').on('change', async function () {
    $('#clients-table-body').html('');
    const filter = $(this).val();
    let filterObj;
    if (filter === "today" || "last7days" || "last30days") {
        filterObj = filterOption(filter, 'createdAt')
    } if (filter === "finishing") {
        filterObj = filterOption(filter, 'visa_finished_date')
    } if (filter === "refunding") {
        filterObj = filterOption(filter, 'refund')
    } if (filter === "finished") {
        filterObj = filterOption(filter, 'visa_finished_date')
    } if (filter === "out") {
        filterObj = filterOption(filter, 'visa_finished_date')
    }
    try {
        const response = await sendGetRequest(`d${filterObj}`, {}, authorizedHeader);
        if (response) {
            const myClients = response.clients;
            setClientsIntoTable(myClients, 'clients-table-body')
        }
    } catch (error) {
        handleError(error)
    }
});

function setupPagination(data, paginationLinksId) {
    const pagination = data.clientPagination;
    let links = '';

    for (let i = 0; i < pagination.numberOfPages; i++) {
        if (i + 1 === pagination.currentPage) {
            links += `<a href="#" class="link active">${i + 1}</a>`;
        } else {
            links += `<a href="#" class="link">${i + 1}</a>`;
        }
    }
    $(`#${paginationLinksId}`).append(links);

}