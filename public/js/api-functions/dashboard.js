$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('d', {}, authorizedHeader);
        if (response) {
            const myClients = response.clients
            $('#sumOfVisas').text(myClients.result + ' تأشيرة');
            $('#clientsMoneySum').text(parseFloat(myClients.clientsMoneySum) + ' درهم');
            $('#ClientsInsuranceSum').text(myClients.clientsInsuranceSum + ' درهم');
            $('#ClientsRefunSum').text(myClients.refundSum + ' درهم');
            setClientsIntoTable(myClients, 'clients-table-body')
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
    } if(filter === "refunding"){
        filterObj = filterOption(filter, 'refund')
    } if(filter === "finished"){
        filterObj = filterOption(filter, 'visa_finished_date')
    }if(filter === "out"){
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
