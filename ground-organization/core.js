// Load records from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRecords();

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toUpperCase();
        const rows = document.querySelectorAll('#atcTable tbody tr');

        rows.forEach(row => {
            const callsign = row.querySelector('td:first-child input').value.toUpperCase();
            if (callsign.includes(filter)) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    });
});

// Function to add a new record
function addRecord(callsign = "", runwayAction = "", atis = false, cleared = false, taxiing = false, handedOff = false) {
    const table = document.getElementById('atcTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const fields = [
        { type: 'text', value: callsign },     // Callsign
        { type: 'text', value: runwayAction }, // Runway/Action
        { type: 'checkbox', checked: atis },   // ATIS
        { type: 'checkbox', checked: cleared },// Cleared
        { type: 'checkbox', checked: taxiing },// Is Taxiing
        { type: 'checkbox', checked: handedOff }// Handed Off
    ];

    fields.forEach((field, index) => {
        let newCell = newRow.insertCell(index);
        if (field.type === 'checkbox') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = field.checked;
            checkbox.addEventListener('change', saveRecords); // Listen for change and save
            newCell.appendChild(checkbox);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = field.value;
            input.addEventListener('input', saveRecords); // Listen for input and save
            newCell.appendChild(input);
        }
    });

    // Add the delete button
    let deleteCell = newRow.insertCell(6);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() { deleteRecord(deleteBtn); };
    deleteCell.appendChild(deleteBtn);

    // Hide "No records" message
    document.getElementById('noRecordsMessage').style.display = 'none';

    // Add keyboard shortcut functionality when hovering over the strip
    newRow.addEventListener('mouseenter', function() {
        document.addEventListener('keydown', handleKeyPress);
    });

    newRow.addEventListener('mouseleave', function() {
        document.removeEventListener('keydown', handleKeyPress);
    });

    // Save the updated records
    saveRecords();
}

// Function to handle key presses while hovering
function handleKeyPress(event) {
    // Ignore keypress if a text input is focused
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
        return; // Exit if a text input is focused
    }

    const hoveredRow = document.querySelector('#atcTable tbody tr:hover');
    if (hoveredRow) {
        const atisCheckbox = hoveredRow.querySelector('td:nth-child(3) input');
        const clearedCheckbox = hoveredRow.querySelector('td:nth-child(4) input');
        const taxiingCheckbox = hoveredRow.querySelector('td:nth-child(5) input');
        const handedOffCheckbox = hoveredRow.querySelector('td:nth-child(6) input');

        switch (event.key.toLowerCase()) {
            case 'a': // Toggle ATIS
                atisCheckbox.checked = !atisCheckbox.checked;
                break;
            case 'c': // Toggle Cleared
                clearedCheckbox.checked = !clearedCheckbox.checked;
                break;
            case 't': // Toggle Taxiing
                taxiingCheckbox.checked = !taxiingCheckbox.checked;
                break;
            case 'h': // Toggle Handed Off
                handedOffCheckbox.checked = !handedOffCheckbox.checked;
                break;
            case '1': // Toggle ATIS
                atisCheckbox.checked = !atisCheckbox.checked;
                break;
            case '2': //Toggle Cleared
                clearedCheckbox.checked = !clearedCheckbox.checked;
                break;
            case '3': // Toggle Taxiing
                taxiingCheckbox.checked = !taxiingCheckbox.checked;
                break;
            case '4': // Toggle Handed Off
                handedOffCheckbox.checked = !handedOffCheckbox.checked;
                break;
        }

        // Save the updated records after toggling
        saveRecords();
    }
}

// Function to delete a record
function deleteRecord(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    saveRecords(); // Update the saved records after deletion

    // If no rows left, show "No records" message
    const table = document.getElementById('atcTable').getElementsByTagName('tbody')[0];
    if (table.rows.length === 0) {
        document.getElementById('noRecordsMessage').style.display = 'block';
    }
}

// Save records to localStorage
function saveRecords() {
    const rows = document.querySelectorAll('#atcTable tbody tr');
    const records = Array.from(rows).map(row => {
        const inputs = row.querySelectorAll('input');
        return {
            callsign: inputs[0].value,
            runwayAction: inputs[1].value,
            atis: inputs[2].checked,
            cleared: inputs[3].checked,
            taxiing: inputs[4].checked,
            handedOff: inputs[5].checked
        };
    });
    localStorage.setItem('atcRecords', JSON.stringify(records));
}

// Load records from localStorage
function loadRecords() {
    const savedRecords = JSON.parse(localStorage.getItem('atcRecords'));
    if (savedRecords && savedRecords.length > 0) {
        savedRecords.forEach(record => {
            addRecord(record.callsign, record.runwayAction, record.atis, record.cleared, record.taxiing, record.handedOff);
        });
    } else {
        document.getElementById('noRecordsMessage').style.display = 'block';
    }
}

// Function to confirm and delete all records
function confirmDeleteAll() {
    // Show a confirmation popup
    const confirmed = confirm("Are you sure you want to delete all records?");
    if (confirmed) {
        deleteAllRecords();
    }
}

// Function to delete all records
function deleteAllRecords() {
    // Remove all rows from the table
    const table = document.getElementById('atcTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    // Clear the localStorage records
    localStorage.removeItem('atcRecords');

    // Show "No records" message
    document.getElementById('noRecordsMessage').style.display = 'block';
}
