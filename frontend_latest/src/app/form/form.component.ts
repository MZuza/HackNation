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
    { id: 1, name: 'Category.PublicAdministration' },
    { id: 2, name: 'Category.BusinessAndEconomy' },
    { id: 3, name: 'Category.BudgetAndPublicFinance' },
    { id: 136, name: 'Category.Security' },
    { id: 135, name: 'Category.Culture' },
    { id: 4, name: 'Category.ScienceAndEducation' },
    { id: 5, name: 'Category.WorkAndSocialAssistance' },
    { id: 138, name: 'Category.RegionsAndCities' },
    { id: 6, name: 'Category.Agriculture' },
    { id: 7, name: 'Category.Society' },
    { id: 8, name: 'Category.SportAndTourism' },
    { id: 9, name: 'Category.Environment' },
    { id: 137, name: 'Category.Health' },
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
