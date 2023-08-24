let fetch;

import('node-fetch').then(module => {
    fetch = module.default;
});

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiUrl = 'https://slotandfly.cloud.ham.aero/api/flugdaten/'+event.queryStringParameters.date;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Pragma':'no-cache',
                'Accept':'application/json, text/plain, */*',
                'Sec-Fetch-Site':'same-origin',
                'Accept-Language':'en-GB,en;q=0.9',
                'Accept-Encoding':'gzip, deflate, br',
                'Sec-Fetch-Mode':'cors',
                'Cache-Control':'no-cache',
                'Host':'slotandfly.cloud.ham.aero',
                'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Safari/605.1.15',
                'Referer':'https://slotandfly.cloud.ham.aero/',
                'Connection':'keep-alive',
                'Sec-Fetch-Dest':'empty',
                'source':'Slola GUI'
                // Add any other headers if required by the foreign API
            }
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};

