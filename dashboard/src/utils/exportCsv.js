export const exportToCSV = (filename, rows, headers) => {
  const csvContent = [
    headers.join(","), // header row
    ...rows.map((row) =>
      headers.map((h) => row[h]).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
