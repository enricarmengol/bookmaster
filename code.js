function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Set minimum date for check-in and check-out
document.getElementById('checkin-date').setAttribute('min', getCurrentDate());
document.getElementById('checkout-date').setAttribute('min', getCurrentDate());

// Update minimum date for check-out based on check-in selection
function updateCheckOutMinDate() {
    const checkInDate = document.getElementById('checkin-date').value;
    document.getElementById('checkout-date').setAttribute('min', checkInDate);
}

// Function to handle availability check
function checkAvailability() {
    const checkInDate = document.getElementById('checkin-date').value;
    const checkOutDate = document.getElementById('checkout-date').value;
    const guests = document.getElementById('guests').value;

    // Add your backend logic here to check availability based on the selected dates and number of guests
    // Example:
    alert(`Availability Check\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nGuests: ${guests}`);
}