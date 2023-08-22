// Initialize flatpickr for date-time picker
flatpickr("#dateTimePicker", {
    enableTime: true,
    minDate: "tomorrow",
    defaultHour: 6,
    defaultMinute: 30,
    minuteIncrement: 15,
});

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