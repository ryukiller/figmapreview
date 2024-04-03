const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = './Comuni2.csv'; // Replace with your CSV file path
const jsonFilePath = './Comuni.json'; // Replace with desired JSON output file path

csv(
    { delimiter: ";" }
)
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        // Assuming the format of your CSV file, you might need to transform jsonObj here
        const transformedData = transformData(jsonObj);

        fs.writeFile(jsonFilePath, JSON.stringify(transformedData, null, 2), (err) => {
            if (err) {
                console.error('An error occurred:', err);
                return;
            }
            console.log('CSV file successfully converted to JSON and saved to', jsonFilePath);
        });
    });

function transformData(data) {
    const provincesData = [];
    const comunesData = {};

    data.forEach(row => {
        console.log(row)
        const provincia = row["Denominazione provincia Lunga"].trim() !== '-' ? row["Denominazione provincia Lunga"].trim() + ' (' + row["Denominazione provincia Codice"].trim() + ')' : row["Denominazione Città metropolitana"].trim() + ' (' + row["Denominazione provincia Codice"].trim() + ')';
        const comune = row["Denominazione in italiano"].trim();

        if (!provincesData.includes(provincia)) {
            provincesData.push(provincia);
            comunesData[provincia] = [];
        }

        comunesData[provincia].push(comune);
    });

    return comunesData; // Adjust based on your needs
}
