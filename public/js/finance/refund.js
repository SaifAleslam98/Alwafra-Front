$(window).on('load', async function () {
    try {
        const response = await sendGetRequest('refund', {}, authorizedHeader);
        if (response) {
            const clients = response.data;
            refundDataTable(clients)
        }

    } catch (error) {
        console.log(error)
        alertMsg('حدث خطأ أثناء جلب بيانات التأمينات.', 'danger');
    }
});