# HackNation

Ten projekt to aplikacja internetowa zbudowana przy użyciu Angulara z włączonym renderowaniem po stronie serwera (SSR).

## Struktura Projektu

Główny kod aplikacji Angular znajduje się w katalogu `/project`. Wszystkie poniższe komendy należy wykonywać z wnętrza tego katalogu.

## Wymagania wstępne

Przed rozpoczęciem upewnij się, że masz zainstalowane następujące narzędzia:

-   Node.js (zalecana wersja LTS)
-   Angular CLI

## Instalacja

1.  Sklonuj repozytorium na swój lokalny komputer.

2.  Przejdź do katalogu z aplikacją:
    ```bash
    cd project
    ```

3.  Zainstaluj wszystkie wymagane zależności:
    ```bash
    npm install
    ```

## Uruchamianie serwera deweloperskiego

Aby uruchomić aplikację w trybie deweloperskim z automatycznym przeładowywaniem, wykonaj poniższą komendę w katalogu `project`:

```bash
npm start
```

LUB

```bash
ng serve
```

Otwórz przeglądarkę i przejdź pod adres `http://localhost:4200/`.

## Budowanie projektu

Aby zbudować projekt w wersji produkcyjnej, użyj komendy:

```bash
ng build
```

Pliki wynikowe zostaną umieszczone w katalogu `dist/project/`.
