// Function to fetch and parse the CSV file
async function fetchCSVData() {
  try {
    const response = await fetch('data.csv');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true });
    
    // Log any CSV parsing errors for debugging
    if (parsedData.errors.length > 0) {
      console.error("CSV Parsing Errors:", parsedData.errors);
    }
    
    return parsedData.data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Function to calculate color based on returns (higher returns = greener)
function getReturnColor(value) {
  const returnValue = parseFloat(value);

  if (isNaN(returnValue)) return ''; // If it's not a number, return nothing

  // Map the return values to a color range (Green for positive, Yellow for lower returns)
  if (returnValue >= 25) {
    return '#4CAF50'; // Green for higher returns
  } else if (returnValue >= 15) {
    return '#8BC34A'; // Light Green for moderate returns
  } else if (returnValue >= 5) {
    return '#FFC107'; // Yellow for moderate returns
  } else {
    return '#F44336'; // Red for low returns
  }
}

// Function to update the table based on the selected month
async function updateTable() {
  const selectedMonth = document.getElementById('month').value;
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = ''; // Clear existing data

  const data = await fetchCSVData();
  
  if (!data) return;

  // Filter data by the selected month
  const filteredData = data.filter(row => row.month === selectedMonth);

  let rowsHTML = '';
  filteredData.forEach(row => {
    // Get the highest return to color the entire row
    const returns = [
      parseFloat(row.sip_1.replace('%', '')),
      parseFloat(row.sip_12.replace('%', '')),
      parseFloat(row.sip_24.replace('%', '')),
      parseFloat(row.sip_60.replace('%', '')),
      parseFloat(row.lumpsum_1.replace('%', '')),
      parseFloat(row.lumpsum_12.replace('%', '')),
      parseFloat(row.lumpsum_24.replace('%', '')),
      parseFloat(row.lumpsum_60.replace('%', ''))
    ];

    const maxReturn = Math.max(...returns);
    const rowColor = getReturnColor(maxReturn);

    rowsHTML += `
      <tr class="scheme-row" style="background-color: ${rowColor}">
        <td style="color: white;">${row.scheme_name || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.sip_1)}">${row.sip_1 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.sip_12)}">${row.sip_12 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.sip_24)}">${row.sip_24 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.sip_60)}">${row.sip_60 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.lumpsum_1)}">${row.lumpsum_1 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.lumpsum_12)}">${row.lumpsum_12 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.lumpsum_24)}">${row.lumpsum_24 || 'N/A'}</td>
        <td style="background-color: ${getReturnColor(row.lumpsum_60)}">${row.lumpsum_60 || 'N/A'}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHTML; // Add the rows to the table
}

// Function to load the saved month from localStorage
function loadSelectedMonth() {
  const savedMonth = localStorage.getItem('selectedMonth');
  if (savedMonth) {
    document.getElementById('month').value = savedMonth;
  }
}

// Function to save the selected month in localStorage
function saveSelectedMonth() {
  const selectedMonth = document.getElementById('month').value;
  localStorage.setItem('selectedMonth', selectedMonth);
}

// Add event listener to update the table when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadSelectedMonth();  // Load saved month on page load
  updateTable();         // Update the table with the loaded month
});

// Optionally, update the table when the month is changed from the dropdown
document.getElementById('month').addEventListener('change', () => {
  saveSelectedMonth();  // Save the selected month
  updateTable();        // Update the table with the new month
});
