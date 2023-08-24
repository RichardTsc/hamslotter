document.addEventListener('DOMContentLoaded', function() {
    // Initialize flatpickr for date-time picker
    flatpickr("#dateTimePicker", {
        enableTime: false,
        minDate: "today",
        maxDate: new Date().fp_incr(7),
        dateFormat: "d.m.Y",
        defaultHour: 6,
        defaultMinute: 30,
        minuteIncrement: 15,
    });

    fetchFlightDataAndPopulateDatalist();

    document.getElementById('inputForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const response = await fetch('YOUR_POST_URL', {
            method: 'POST',
            body: formData
        });

        const returnCode = await response.text();
        alert(`Return Code: ${returnCode}`);
    });
});


// Function to fetch flight data and populate the datalist
async function fetchFlightDataAndPopulateDatalist() {
    try {
        // Make the GET request
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://slotandfly.cloud.ham.aero/api/flugdaten/2023-08-23');
        const data = await response.json();

        // Function to parse flight numbers
        function parseFlightNumbers(data) {
            let flightNumbers = [];

            data.forEach(item => {
                // Add the main flight number
                if (item.flightnumber) {
                    flightNumbers.push(item.flightnumber);
                }

                // Add code share flight numbers
                if (item.codeShareInfoFlightnumber && Array.isArray(item.codeShareInfoFlightnumber)) {
                    flightNumbers = flightNumbers.concat(item.codeShareInfoFlightnumber);
                }
            });

            return flightNumbers;
        }

        // Parse the flight numbers
        const flightNumbers = parseFlightNumbers(data);

        // Add flight numbers to the datalist
        const datalist = document.getElementById('flightNumbersList');
        flightNumbers.forEach(flightNumber => {
            const option = document.createElement('option');
            option.value = flightNumber;
            datalist.appendChild(option);
        });

    } catch (error) {
        console.error('Failed to fetch flight data:', error);
    }
}
