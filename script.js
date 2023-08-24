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
        onChange: function(selectedDates, dateStr, instance) {
            //console.log(reformatDate(dateStr));       // This is a string representation of the selected date(s)
            
            fetchFlightDataAndPopulateDatalist(reformatDate(dateStr));
            // Your custom logic when a date is selected
        }
    });

    

    document.getElementById('inputForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        // Gather data from the form
        const date = reformatDate(document.getElementById('dateTimePicker').value);
        const flightNumber = document.getElementById('flightNumber').value;
        const passenger1 = document.getElementById('passenger1').value;
        const passenger2 = document.getElementById('passenger2').value;
        const email = document.getElementById('email').value;
    
        // Construct the POST data
        const postData = {
            slot: `${date.replace(/\-/g, '')}0500`,
            namen: [passenger1],
            email: email,
            flightno: flightNumber,
            slotStart: `${date.split('.').reverse().join('-')}T05:00:00+02:00`,
            slotEnd: `${date.split('.').reverse().join('-')}T21:00:00+02:00`,
            lang: 'DE'
        };

        console.log(postData);
    
        // Add the second passenger if provided
        if (passenger2) {
            postData.namen.push(passenger2);
        }
    
        // Send the POST request
        const response = await fetch('https://magnificent-mochi-cb1f04.netlify.app/.netlify/functions/book_slot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
    
        const responseData = await response.json();
        console.log(responseData);
    
        // Handle the response as needed, e.g., show a success message, redirect, etc.
    });
});
    

// Function to fetch flight data and populate the datalist
async function fetchFlightDataAndPopulateDatalist(date) {
    try {
        // Make the GET request
        const response = await fetch('https://magnificent-mochi-cb1f04.netlify.app/.netlify/functions/get_flights?date='+date);
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
        datalist.innerHTML="";
        flightNumbers.forEach(flightNumber => {
            const option = document.createElement('option');
            option.value = flightNumber;
            datalist.appendChild(option);
        });

    } catch (error) {
        console.error('Failed to fetch flight data:', error);
    }
}



function reformatDate(inputDate) {
    // Split the date by "."
    const parts = inputDate.split(".");
  
    // Re-arrange the date parts and join with "-"
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  
    return formattedDate;
  }
  