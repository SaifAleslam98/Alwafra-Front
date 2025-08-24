/** Base Api URL */
const Api_URL = 'http://localhost:3000/api/v1';

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


//Function to Set Cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ';secure=' + true;
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
    if(error.response.status === 403){
        alertMsg('ليس لديك صلاحية للدخول', 'danger')
        return;
    }
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
        const response = await axios.delete(`${Api_URL}/${url}`,{
            data:body,
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