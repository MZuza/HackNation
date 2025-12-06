const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware do parsowania JSON z frontendu
app.use(bodyParser.json());

// Endpoint, który odbiera dane z formularza Angulara
app.post('/api/found-items', (req, res) => {
  const foundItem = req.body;
  console.log('Otrzymano nowe zgłoszenie:', foundItem);

  if (!foundItem || !foundItem.name || !foundItem.category) {
    return res.status(400).send({ message: 'Brak wymaganych pól.' });
  }

  // Konwersja danych z formularza na strukturę XML zgodną z XSD
  const xmlData = convertToHarvesterXml(foundItem);

  // Definicja ścieżki zapisu pliku dla harvestera
  const harvesterDir = path.join(__dirname, '..', '..', 'harvester_data');
  const fileName = `zgloszenie-${Date.now()}.xml`;
  const filePath = path.join(harvesterDir, fileName);

  // Upewnij się, że folder docelowy istnieje
  if (!fs.existsSync(harvesterDir)) {
    fs.mkdirSync(harvesterDir, { recursive: true });
  }

  // Zapisz plik XML
  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.error('Błąd podczas zapisu pliku XML:', err);
      return res.status(500).send({ message: 'Błąd serwera podczas zapisu pliku.' });
    }

    console.log(`Pomyślnie zapisano plik dla harvestera: ${fileName}`);
    res.status(201).send({ message: 'Zgłoszenie zostało pomyślnie zapisane.' });
  });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
  console.log('Gotowy do przyjmowania zgłoszeń z formularza.');
});

/**
 * Konwertuje obiekt z formularza na XML zgodny ze schematem harvestera.
 * @param {object} item - Dane z formularza.
 * @returns {string} - Ciąg znaków w formacie XML.
 */
function convertToHarvesterXml(item) {
  const now = new Date().toISOString();
  const extId = `item-${Date.now()}`; // Unikalny identyfikator zewnętrzny

  // Użyj ID kategorii przesłanego z formularza
  const categoryId = item.category;

  const escapeXml = (unsafe) =>
    String(unsafe).replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  return `<?xml version="1.0" encoding="UTF-8" ?>
<datasets xmlns="urn:otwarte-dane:harvester:1.0-rc1">
  <dataset status="published">
    <extIdent>${extId}</extIdent>
    <title>
      <polish>${escapeXml(item.name)}</polish>
    </title>
    <description>
      <polish>${escapeXml(item.placeDescription)}</polish>
    </description>
    <updateFrequency>notApplicable</updateFrequency>
    <categories>${categoryId}</categories>
    <resources>
      <resource status="published">
        <extIdent>${extId}-resource</extIdent>
        <url>http://example.com/item/${extId}</url>
        <title><polish>${escapeXml(item.name)}</polish></title>
        <description><polish>Zgłoszenie znalezionego przedmiotu.</polish></description>
        <dataDate>${item.foundDate}</dataDate>
        <lastUpdateDate>${now}</lastUpdateDate>
      </resource>
    </resources>
    <tags><tag lang="pl">${escapeXml(item.county)}</tag><tag lang="pl">${escapeXml(item.municipality)}</tag><tag lang="pl">${escapeXml(item.contactOffice)}</tag></tags>
    <lastUpdateDate>${now}</lastUpdateDate>
  </dataset>
</datasets>`;
}
