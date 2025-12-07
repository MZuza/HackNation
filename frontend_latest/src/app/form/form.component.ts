import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoundItem } from './models/foundItem.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, HttpClientModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  itemForm!: FormGroup;

  // Kategorie przedmiotów
  categories = [
    { id: 'electronics', name: 'Elektronika' },
    { id: 'documents', name: 'Dokumenty' },
    { id: 'keys', name: 'Klucze' },
    { id: 'clothing', name: 'Ubrania' },
    { id: 'other', name: 'Inne' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      county: ['', Validators.required],
      municipality: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      foundDate: ['', Validators.required],
      placeDescription: ['', Validators.required],
      contactOffice: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const foundItem: FoundItem = this.itemForm.value;

      // Generujemy XML w strukturze "Otwartych Danych"
      this.downloadAsXml(foundItem);

      // Opcjonalne wysłanie na backend
      /*
      const apiUrl = '/api/found-items';
      this.http.post(apiUrl, foundItem).subscribe(...);
      */
    }
  }

  private downloadAsXml(item: FoundItem): void {
    // Generowanie unikalnych identyfikatorów (symulacja)
    const timestamp = new Date().getTime();
    // extIdent dla całego zbioru (dataset) - np. identyfikator urzędu
    const datasetExtIdent = `urzad_${this.escapeXml(item.county)}_${this.escapeXml(item.municipality)}`.toLowerCase().replace(/\s/g, '_');
    // extIdent dla konkretnego zasobu (resource) - czyli tego zgłoszenia
    const resourceExtIdent = `zgloszenie_${timestamp}`;

    const year = new Date().getFullYear();

    // Mapowanie danych przedmiotu na strukturę XML Otwartych Danych
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<ns2:datasets xmlns:ns2="urn:otwarte-dane:harvester:1.13" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dataset status="published">
    <extIdent>${datasetExtIdent}</extIdent>
    <title>
      <polish>Rejestr rzeczy znalezionych: ${this.escapeXml(item.county)} ${this.escapeXml(item.municipality)}</polish>
      <english>Register of found items: ${this.escapeXml(item.county)} ${this.escapeXml(item.municipality)}</english>
    </title>
    <description>
      <polish>Zbiór danych o przedmiotach znalezionych w powiecie ${this.escapeXml(item.county)}.</polish>
      <english>Dataset of items found in county ${this.escapeXml(item.county)}.</english>
    </description>
    <updateFrequency>daily</updateFrequency>
    <hasDynamicData>false</hasDynamicData>
    <hasHighValueData>false</hasHighValueData>
    <hasHighValueDataFromEuropeanCommissionList>false</hasHighValueDataFromEuropeanCommissionList>
    <hasResearchData>false</hasResearchData>
    <categories>
      <category>SOCI</category>
    </categories>
    <resources>
      <resource status="published">
        <extIdent>${resourceExtIdent}</extIdent>
        <url>https://urzad.example.pl/znalezione/${resourceExtIdent}</url>
        <title>
          <polish>${this.escapeXml(item.name)} (${this.escapeXml(item.category)}) - ${item.foundDate}</polish>
          <english>${this.escapeXml(item.name)} (${this.escapeXml(item.category)}) - ${item.foundDate}</english>
        </title>
        <description>
          <polish>Przedmiot: ${this.escapeXml(item.name)}. Kategoria: ${this.escapeXml(
      item.category,
    )}. Miejsce znalezienia: ${this.escapeXml(item.placeDescription)}. Kontakt: ${this.escapeXml(item.contactOffice)}.</polish>
          <english>Item: ${this.escapeXml(item.name)}. Category: ${this.escapeXml(item.category)}. Place found: ${this.escapeXml(
      item.placeDescription,
    )}. Contact: ${this.escapeXml(item.contactOffice)}.</english>
        </description>
        <availability>local</availability>
        <dataDate>${item.foundDate}</dataDate>
        <specialSigns>
          <specialSign>X</specialSign>
        </specialSigns>
        <hasDynamicData>false</hasDynamicData>
        <hasHighValueData>false</hasHighValueData>
        <hasHighValueDataFromEuropeanCommissionList>false</hasHighValueDataFromEuropeanCommissionList>
        <hasResearchData>false</hasResearchData>
        <containsProtectedData>false</containsProtectedData>
      </resource>
    </resources>
    <tags>
      <tag lang="pl">Rzeczy znalezione</tag>
      <tag lang="pl">${this.escapeXml(item.category)}</tag>
    </tags>
  </dataset>
</ns2:datasets>`;

    // Tworzenie i pobieranie pliku
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `found_item_${resourceExtIdent}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Funkcja czyszcząca znaki specjalne
  private escapeXml(unsafe: any): string {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
