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