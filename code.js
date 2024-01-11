// Declare rooms object
const roomData = {
    'Room 101': {
        description: 'Luxury Suite',
        available: true,
        booked: false,
        booking: { startDate: null, endDate: null, guests: null, email: null }
    },
    'Room 102': {
        description: 'Single Room',
        available: true,
        booked: false,
        booking: { startDate: null, endDate: null, guests: null, email: null }
    },
    'Room 103': {
        description: 'Double Room',
        available: true,
        booked: false,
        booking: { startDate: null, endDate: null, guests: null, email: null }
    },
    'Room 104': {
        description: 'Business Suite',
        available: true,
        booked: false,
        booking: { startDate: null, endDate: null, guests: null, email: null }
    },
    'Room 105': {
        description: 'Standard Suite',
        available: true,
        booked: false,
        booking: { startDate: null, endDate: null, guests: null, email: null }
    },
    'Room 106': {
        description: 'The Venom Complex',
        available: true,
        booked: false,
        booking: { startDate: null, endDate: null, guests: null, email: null }
    },
};

// Store variables
const availableRooms = document.getElementById('rooms');
let selectedStartDate = "";
let selectedEndDate = "";

// Load data from localStorage
window.addEventListener('load', function () {
    const storedRoomData = JSON.parse(localStorage.getItem('roomData'));

    if (storedRoomData) {
        for (const roomName in storedRoomData) {
            if (storedRoomData.hasOwnProperty(roomName) && roomData.hasOwnProperty(roomName)) {
                roomData[roomName] = { ...roomData[roomName], ...storedRoomData[roomName] };
            }
        }
        // Update the room availability display
        checkAvailability();
    }
});

// Function to create a pop-up
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = content;

    document.body.appendChild(modal);

    return modal;
}

// Function to remove the pop-up
function removeModal(modal) {
    document.body.removeChild(modal);
}

// Set minimum date for check-in and check-out
document.getElementById('checkin-date').setAttribute('min', getCurrentDate());
document.getElementById('checkout-date').setAttribute('min', getCurrentDate());

// Update minimum date for check-out based on check-in selection
function updateCheckOutMinDate() {
    const checkInDateElement = document.getElementById('checkin-date');
    const checkOutDateElement = document.getElementById('checkout-date');

    const checkInDate = checkInDateElement.value;

    // Validate check-in date against the current date
    if (checkInDate < getCurrentDate()) {
        alert('Please select a valid check-in date.');
        checkInDateElement.value = getCurrentDate();
    }

    // Update minimum date for check-out
    checkOutDateElement.setAttribute('min', checkInDate);
}

// Function to get the current date
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buttonAvailability() {
    const checkInDate = document.getElementById('checkin-date').value;
    const checkOutDate = document.getElementById('checkout-date').value;
    // Check if check-in and check-out dates are selected
    if (!checkInDate || !checkOutDate) {
        alert('Please select check-in and check-out dates.');
        return;
    } else {
        availableRooms.style.display = 'block';
        checkAvailability();
    }
}

// Function to handle availability check and booking
function checkAvailability() {
    const checkInDate = document.getElementById('checkin-date').value;
    const checkOutDate = document.getElementById('checkout-date').value;

    // Store entered dates globally
    selectedStartDate = checkInDate;
    selectedEndDate = checkOutDate;    

    // Display available rooms    
    availableRooms.innerHTML = '<h2 class="text-2xl font-bold">Available rooms</h2><div id="rooms-list" class="flex gap-5"></div>';
    const roomsList = document.getElementById('rooms-list');
    roomsList.innerHTML = ''; // Clear previous content

    // Loop through roomData object
    for (const roomName in roomData) {
        if (roomData.hasOwnProperty(roomName)) {
            const room = roomData[roomName];

            const roomElement = document.createElement('div');
            roomElement.className = 'room-item';

            // Check if the room is booked for the selected dates
            const isRoomBooked =
                room.booked &&
                (selectedStartDate >= room.booking.startDate && selectedStartDate <= room.booking.endDate ||
                 selectedEndDate >= room.booking.startDate && selectedEndDate <= room.booking.endDate ||
                 selectedStartDate <= room.booking.startDate && selectedEndDate >= room.booking.endDate);

            roomElement.innerHTML = `
                <p>${roomName}</p>
                <p>${room.description}</p>
                <p>${isRoomBooked ? 'Booked' : (room.available ? 'Available' : 'Not Available')}</p>
            `;

            // Set background color based on availability
            roomElement.style.backgroundColor = isRoomBooked ? '#FF7F7F' : (room.available ? '#8FEE87' : '#FF7F7F');
            // Set cursor style based on availability
            roomElement.style.cursor = isRoomBooked ? 'default' : (room.available ? 'pointer' : 'default');

            // Handle click event to show booking form
            if (room.available && !isRoomBooked) {
                roomElement.addEventListener('click', function () {
                    showBookingForm(roomName);
                });
            }

            roomsList.appendChild(roomElement);
        }
    }
}

// Function to show booking form
function showBookingForm(roomName) {
    const formContent = `
        <form id="booking-form">
            <label for="start-date">Start Date:</label>
            <input type="date" id="start-date" name="start-date" required value="${selectedStartDate}">

            <label for="end-date">End Date:</label>
            <input type="date" id="end-date" name="end-date" required value="${selectedEndDate}">

            <label for="guests">Number of Guests:</label>
            <select id="guests" name="guests" required>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>

            <label for="email">Your Email:</label>
            <input type="email" id="email" name="email" required>

            <button type="button" onclick="confirmBooking('${roomName}')">Confirm Booking</button>
        </form>
    `;

    // Create a modal and add the form content
    const modal = createModal(formContent);

    // Style the modal
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    // Remove the modal when clicking outside the form
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            removeModal(modal);
        }
    });
}

// Function to confirm booking
function confirmBooking(roomName) {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const guests = document.getElementById('guests').value;
    const email = document.getElementById('email').value;

    if (!startDate || !endDate || !guests || !email) {
        alert('Please fill all the fields in the form');
        return;
    }

    // Update roomData object with booking details
    roomData[roomName].booked = true;
    roomData[roomName].booking.startDate = startDate;
    roomData[roomName].booking.endDate = endDate;
    roomData[roomName].booking.guests = guests;
    roomData[roomName].booking.email = email;

    // Update localStorage with the latest roomData
    localStorage.setItem('roomData', JSON.stringify(roomData));

    // Remove the modal after confirming booking
    const modal = document.querySelector('.modal');
    if (modal) {
        removeModal(modal);
    }

    // Update the room availability display
    checkAvailability();
}

function showAdmin() {
    // Create content for the admin tools modal
    const adminContent = `
        <div id="adminModalContent" class="modal-content">
            <div id="bookingData"></div>
            <button class="mt-3" onclick="wipeLocalStorage()">Wipe localStorage</button>
        </div>
    `;

    // Create a new modal for admin tools
    const adminModal = createModal(adminContent);

    // Fetch and display the booking data in the admin tools modal
    var bookingData = getBookingData();
    var bookingDataElement = document.getElementById("bookingData");
    bookingDataElement.innerHTML = bookingData;

    // Style the admin tools modal
    adminModal.style.display = 'flex';
    adminModal.style.alignItems = 'center';
    adminModal.style.justifyContent = 'center';
    adminModal.style.position = 'fixed';
    adminModal.style.top = '0';
    adminModal.style.left = '0';
    adminModal.style.width = '100%';
    adminModal.style.height = '100%';
    adminModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    // Remove the admin tools modal when clicking outside the content
    adminModal.addEventListener('click', function (event) {
        if (event.target === adminModal) {
            removeModal(adminModal);
        }
    });
}

// Function to wipe localStorage
function wipeLocalStorage() {
    localStorage.clear();
    alert('LocalStorage wiped.');
    location.reload();
}

function getBookingData() {
    // Retrieve stored room data from localStorage
    const storedRoomData = JSON.parse(localStorage.getItem('roomData'));

    if (!storedRoomData) {
        return "No booking data available.";
    }

    let bookingDataHTML = '<ul>';

    // Iterate over each room in the stored room data
    for (const roomName in storedRoomData) {
        if (storedRoomData.hasOwnProperty(roomName) && storedRoomData[roomName].booked) {
            const booking = storedRoomData[roomName].booking;
            const bookingInfo = `
                <li>
                    <strong>${roomName}</strong><br> Booked for ${booking.guests} guests<br> From ${booking.startDate} to ${booking.endDate}<br> Contact: ${booking.email}
                </li>
            `;
            bookingDataHTML += bookingInfo;
        }
    }

    bookingDataHTML += '</ul>';
    return bookingDataHTML;
}