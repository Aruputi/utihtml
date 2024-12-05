async function fetchCSVData() {
  const response = await fetch('data.csv');
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true }).data;
}

async function updateTable() {
  const selectedMonth = document.getElementById('month').value;
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';

  const data = await fetchCSVData();
  const filteredData = data.filter(row => row.month === selectedMonth);

  filteredData.forEach(row => {
    const rowElement = document.createElement('tr');
    rowElement.innerHTML = `
      <td>${row.scheme_name}</td>
      <td>${row.sip_1}</td>
      <td>${row.sip_12}</td>
      <td>${row.sip_24}</td>
      <td>${row.sip_60}</td>
      <td>${row.lumpsum_1}</td>
      <td>${row.lumpsum_12}</td>
      <td>${row.lumpsum_24}</td>
      <td>${row.lumpsum_60}</td>
    `;
    tbody.appendChild(rowElement);
  });
}

document.addEventListener('DOMContentLoaded', updateTable);
