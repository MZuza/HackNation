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
  categories = [
    { id: 'electronics', name: 'Elektronika (telefony, laptopy, etc.)' },
    { id: 'documents', name: 'Dokumenty i portfele' },
    { id: 'keys', name: 'Klucze' },
    { id: 'clothing', name: 'Ubrania i akcesoria' },
    { id: 'bags', name: 'Torby, plecaki, walizki' },
    { id: 'jewelry', name: 'Biżuteria i zegarki' },
    { id: 'pets', name: 'Zwierzęta' },
    { id: 'books', name: 'Książki i materiały biurowe' },
    { id: 'cards', name: 'Karty (płatnicze, miejskie, etc.)' },
    { id: 'toys', name: 'Zabawki i artykuły dziecięce' },
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
      // Endpoint na backendzie, który przyjmuje dane i tworzy plik XML
      const apiUrl = '/api/found-items';

      this.http.post(apiUrl, foundItem).subscribe({
        next: () => {
          console.log('Dane zostały pomyślnie wysłane na serwer.');
          // Opcjonalnie: zresetuj formularz lub pokaż komunikat o sukcesie
        },
        error: err => console.error('Wystąpił błąd podczas wysyłania danych:', err),
      });
    }
  }
}
