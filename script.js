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

// Add event listener to update the table when the document is fully loaded
document.addEventListener('DOMContentLoaded', updateTable);

// Optionally, update the table when the month is changed from the dropdown
document.getElementById('month').addEventListener('change', updateTable);
