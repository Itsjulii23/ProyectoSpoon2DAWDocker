async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function obtenerHtml(url) {
    const response = await fetch(url)
    return response.text();
}

async function obtenerJson(url) {
    const response = await fetch(url)
    return response.json();
}

async function obtenerXml(url) {
    let response = await fetch(url);
    return new DOMParser().parseFromString(await response.text(), 'text/xml');
}