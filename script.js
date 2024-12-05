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

// Function to update the table based on the selected month
async function updateTable() {
  const selectedMonth = document.getElementById('month').value;
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = ''; // Clear existing data

  const data = await fetchCSVData();
  
  if (!data) return; // Return if no data is available

  // Filter data by the selected month
  const filteredData = data.filter(row => row.month === selectedMonth);

  // Prepare rows as HTML strings to batch append for performance
  let rowsHTML = '';
  filteredData.forEach(row => {
    rowsHTML += `
      <tr>
        <td>${row.scheme_name || 'N/A'}</td>
        <td>${row.sip_1 || 'N/A'}</td>
        <td>${row.sip_12 || 'N/A'}</td>
        <td>${row.sip_24 || 'N/A'}</td>
        <td>${row.sip_60 || 'N/A'}</td>
        <td>${row.lumpsum_1 || 'N/A'}</td>
        <td>${row.lumpsum_12 || 'N/A'}</td>
        <td>${row.lumpsum_24 || 'N/A'}</td>
        <td>${row.lumpsum_60 || 'N/A'}</td>
      </tr>
    `;
  });

  // Append all rows at once
  tbody.innerHTML = rowsHTML;
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
// Function to calculate color based on returns (higher returns = greener)
function getReturnColor(value) {
  const returnValue = parseFloat(value);

  if (isNaN(returnValue)) return ''; // If it's not a number, return nothing

  // Map the return values to a color range (Green for positive, Red for negative)
  if (returnValue >= 15) {
    return '#4CAF50'; // Green for high returns
  } else if (returnValue >= 5) {
    return '#8BC34A'; // Light green
  } else if (returnValue >= 0) {
    return '#FFC107'; // Yellow for moderate returns
  } else {
    return '#F44336'; // Red for negative returns
  }
}

// Update the table rows dynamically based on returns
async function updateTable() {
  const selectedMonth = document.getElementById('month').value;
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = ''; // Clear existing data

  const data = await fetchCSVData();
  
  if (!data) return;

  // Filter data by selected month
  const filteredData = data.filter(row => row.month === selectedMonth);

  let rowsHTML = '';
  filteredData.forEach(row => {
    // Color rows based on returns
    const sip1Color = getReturnColor(row.sip_1);
    const sip12Color = getReturnColor(row.sip_12);
    const sip24Color = getReturnColor(row.sip_24);
    const sip60Color = getReturnColor(row.sip_60);
    const lumpsum1Color = getReturnColor(row.lumpsum_1);
    const lumpsum12Color = getReturnColor(row.lumpsum_12);
    const lumpsum24Color = getReturnColor(row.lumpsum_24);
    const lumpsum60Color = getReturnColor(row.lumpsum_60);

    rowsHTML += `
      <tr class="scheme-row" style="background-color: ${sip1Color}">
        <td>${row.scheme_name || 'N/A'}</td>
        <td style="background-color: ${sip1Color}">${row.sip_1 || 'N/A'}</td>
        <td style="background-color: ${sip12Color}">${row.sip_12 || 'N/A'}</td>
        <td style="background-color: ${sip24Color}">${row.sip_24 || 'N/A'}</td>
        <td style="background-color: ${sip60Color}">${row.sip_60 || 'N/A'}</td>
        <td style="background-color: ${lumpsum1Color}">${row.lumpsum_1 || 'N/A'}</td>
        <td style="background-color: ${lumpsum12Color}">${row.lumpsum_12 || 'N/A'}</td>
        <td style="background-color: ${lumpsum24Color}">${row.lumpsum_24 || 'N/A'}</td>
        <td style="background-color: ${lumpsum60Color}">${row.lumpsum_60 || 'N/A'}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHTML; // Add the rows to the table
}
// Function to calculate color based on average return
function getOverallReturnColor(averageReturn) {
  if (averageReturn >= 15) {
    return '#4CAF50'; // Green for high returns
  } else if (averageReturn >= 5) {
    return '#8BC34A'; // Light green
  } else {
    return '#FFC107'; // Yellow for moderate to low returns
  }
}

// Function to update the table based on the selected month
async function updateTable() {
  const selectedMonth = document.getElementById('month').value;
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = ''; // Clear existing data

  const data = await fetchCSVData();
  if (!data) return;

  // Filter data by selected month
  const filteredData = data.filter(row => row.month === selectedMonth);

  let rowsHTML = '';
  filteredData.forEach(row => {
    const schemeReturns = [
      parseFloat(row.sip_1) || 0,
      parseFloat(row.sip_12) || 0,
      parseFloat(row.sip_24) || 0,
      parseFloat(row.sip_60) || 0,
      parseFloat(row.lumpsum_1) || 0,
      parseFloat(row.lumpsum_12) || 0,
      parseFloat(row.lumpsum_24) || 0,
      parseFloat(row.lumpsum_60) || 0,
    ];

    // Calculate average return for the scheme
    const averageReturn = schemeReturns.reduce((a, b) => a + b, 0) / schemeReturns.length;

    // Determine row color based on average return
    const rowColor = getOverallReturnColor(averageReturn);

    // Add row for the scheme with unified color for all returns
    rowsHTML += `
      <tr style="background-color: white; color: black; font-weight: bold;">
        <td>${row.scheme_name || 'N/A'}</td>
        <td colspan="8"></td>
      </tr>
      <tr style="background-color: ${rowColor}; color: black;">
        <td>${row.sip_1 || 'N/A'}</td>
        <td>${row.sip_12 || 'N/A'}</td>
        <td>${row.sip_24 || 'N/A'}</td>
        <td>${row.sip_60 || 'N/A'}</td>
        <td>${row.lumpsum_1 || 'N/A'}</td>
        <td>${row.lumpsum_12 || 'N/A'}</td>
        <td>${row.lumpsum_24 || 'N/A'}</td>
        <td>${row.lumpsum_60 || 'N/A'}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHTML; // Populate the table
}


