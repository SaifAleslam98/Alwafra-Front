/** Base Api URL 
 * http://localhost:3000/api/v1
 https://alwafra-api.onrender.com
*/
const Api_URL = 'https://alwafra-api.onrender.com/api/v1';

//axios.defaults.timeout = 15000;
function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 15000);
    return abortController.signal;
}

// Header with Token
const authorizedHeader = {
    'Authorization': `Bearer ${JSON.parse(getCookie('token'))}`
}

// Header with Token
const multiPartAuthorizedHeader = {
    'Authorization': `Bearer ${JSON.parse(getCookie('token'))}`,
    'Content-Type': 'multipart/form-data'
}


//Function to Set Cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ';secure=' + true + ";SameSite=" + "None";
}

//Function to Get Cookie Value
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/** Alert Message Function */
function alertMsg(msg, type) {


    $.notify({
        icon: 'pe-7s-mail',
        message: msg

    }, {
        type: type,
        timer: 4000,
        placement: {
            from: 'top',
            align: 'left'
        }
    });
}


//Handle Error Function
function handleError(error) {
    switch (error.code) {
        case 'ECONNABORTED':
            alertMsg('Request timeout', 'danger')
            break;
        case 'ERR_CANCELED':
            alertMsg('Request canceled, took long time', 'danger')
            break;
        case 'ERR_BAD_REQUEST':
            alertMsg(error.response.data.message, 'danger')
            break;
        case 'ERR_BAD_RESPONSE':
            alertMsg(error.response.data.message, 'danger')
            break;
        default:
            alertMsg(error.message, 'danger')
            break;
    }

}

/** Function to send GET requist */
async function sendGetRequest(url, body, header) {
    try {
        const response = await axios.get(`${Api_URL}/${url}`, {
            headers: header,
            signal: newAbortSignal()
        });
        const myData = response.data;
        if (response.status == 200) {
            return myData;
        }
        alertMsg(response.data.message, 'warning')
    } catch (error) {
        handleError(error)
    }
}

/** Function to send DELETE requist */
async function sendDeleteRequest(url, body, header) {
    try {
        const response = await axios.delete(`${Api_URL}/${url}`, { headers: header, });
        const myData = response.data;
        if (response.status == 200) {
            return myData;
        }
        alertMsg(response.data.message, 'warning')
    } catch (error) {
        handleError(error)
    }
}

/** Function to send POST requist */
async function sendPostRequest(url, body, header) {
    try {
        const response = await axios.post(`${Api_URL}/${url}`, body, {
            headers: header,
            signal: newAbortSignal(15000)
        });
        const myData = response.data;
        if (response.status == 201 || 200) {
            return myData;
        }
        alertMsg(response.data.message, 'warning')
    } catch (error) {
        handleError(error)
    }
}

/** Function to send PATCH requist */
async function sendPatchRequest(url, body, header) {
    try {

        const response = await axios.patch(`${Api_URL}/${url}`, body, {
            headers: header,
            signal: newAbortSignal(15000)
        });
        const myData = response.data;
        if (response.status == 201 || 200) {
            return myData;
        }
        alertMsg(response.data.message, 'warning')
    } catch (error) {
        handleError(error)
    }
}

// Query filter functions
function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const val = new Date(`${yyyy}-${mm}-${dd}`).toISOString()
    return val;
}
function filterOption(filterValue, filed) {
    let filterObj;
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    // Calulate last week start
    const lastSevenDays = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    //Calculate last 30 days
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    // Calulate next seven days
    const nextSevenDays = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    // Calculate a one year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    if (filterValue === "all") {
        filterObj = '';
    } if (filterValue === "today") {
        filterObj = `?${filed}[gte]=${yesterday.toISOString()}&${filed}[lte]=${today.toISOString()}`;
    } if (filterValue === "last7days") {
        filterObj = `?${filed}[gte]=${formatDate(lastSevenDays)}&${filed}[lte]=${today.toISOString()}`;
    } if (filterValue === "last30days") {
        filterObj = `?${filed}[gte]=${formatDate(lastMonth)}&${filed}[lte]=${today.toISOString()}`;
    } if (filterValue === "finishing") {
        filterObj = `?${filed}[gte]=${today.toISOString()}&${filed}[lte]=${formatDate(nextSevenDays)}`;
    } if (filterValue === "refunding") {
        filterObj = `?${filed}[lte]=0`;
    } if (filterValue === "finished") {
        filterObj = `?${filed}[lte]=${today.toISOString()}`;
    } if (filterValue === "out") {
        filterObj = `?${filed}[lte]=${formatDate(oneYearAgo)}`;
    }
    return filterObj;
}


function setClientsIntoTable(client, tableId) {
    const clients = client;
    const clientsDocs = clients.clientsDocuments;
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = ''; // Clear existing rows
    let tableRows = '';
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    if (clientsDocs.length > 0) {
        for (let listsCounter = 0; listsCounter < clientsDocs.length; listsCounter++) {

            // Create date objects
            const enteredDateObj = new Date(clientsDocs[listsCounter].createdAt);
            const createDateObj = new Date(clientsDocs[listsCounter].visa_created_date);
            const finishDateObj = new Date(clientsDocs[listsCounter].visa_finished_date);
            let formattedClientEnteranceDate;

            // Format the date to Arabic format
            const formattedEnteredDate = enteredDateObj.toLocaleDateString('ar-EG', options);
            const formattedCreateDate = createDateObj.toLocaleDateString('ar-EG', options);
            const formattedFinishedDate = finishDateObj.toLocaleDateString('ar-EG', options);
            if (clientsDocs[listsCounter].client_enterance_date) {
                const client_enternace_dateObj = new Date(clientsDocs[listsCounter].client_enterance_date);
                formattedClientEnteranceDate = client_enternace_dateObj.toLocaleDateString('ar-EG', options);
            } else {
                formattedClientEnteranceDate = '---';
            }
            tableRows += `
                            <tr id="view-client" data-id="${clientsDocs[listsCounter]._id}" >
                                <td>${listsCounter + 1}</td>
                                <td class="">${clientsDocs[listsCounter].passport_no}</td>
                                <td>${clientsDocs[listsCounter].slug_ar}</td>
                                <td>${clientsDocs[listsCounter].slug_en}</td>
                                <td>${clientsDocs[listsCounter].visa_type}</td>
                                <td>${formattedEnteredDate}</td>
                                <td>${formattedCreateDate}</td>
                                <td>${formattedFinishedDate}</td>
                                
                                <td>${formattedClientEnteranceDate}</td>
                            </tr>

                    `;

        }
        $(`#${tableId}`).append(tableRows);
    }
    // Optionally, you can add a message if no clients are found
    if (clientsDocs.length <= 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="8" class="text-center">لا يوجد بيانات</td>
                `;
        tableBody.appendChild(row);
    }
}

