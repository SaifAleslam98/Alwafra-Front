$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('d', {}, authorizedHeader);
        if (response) {
            const myData = response
            $('#sumOfVisas').text(myData.clients.result + ' تأشيرة');
            $('#clientsMoneySum').text(parseFloat(myData.clientsMoneySum) + ' درهم');
            $('#sumOfPermits').text(myData.permits.result + ' إقامة');
            $('#permitsMoneySum').text(parseFloat(myData.permitsMoneySum) + ' درهم');
            $('#ClientsInsuranceSum').text(myData.clientsInsuranceSum + ' درهم');
            $('#ClientsRefunSum').text(myData.refundSum + ' درهم');
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
    $('#ClientsInsuranceSum').text('');
    $('#ClientsRefunSum').text('');
    const filterObj = filterOption($(this).val(), 'createdAt');
    try {
        const response = await sendGetRequest(`d${filterObj}`, {}, authorizedHeader);
        const clients = response.clients;
        $('#sumOfVisas').text(clients.result + ' تأشيرة');
        $('#clientsMoneySum').text(parseFloat(clients.clientsMoneySum) + ' درهم');
        $('#ClientsInsuranceSum').text(clients.clientsInsuranceSum + ' درهم');
        $('#ClientsRefunSum').text(clients.refundSum + ' درهم');
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