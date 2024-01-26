# Table of Contents

- [Table of Contents](#table-of-contents)
  - [Informacje wstępne](#informacje-wstępne)
    - [Opis aplikacji](#opis-aplikacji)
    - [Cele testowania](#cele-testowania)
    - [Środowisko testowe](#środowisko-testowe)
    - [Zakres testowania](#zakres-testowania)
  - [Plan testowania manualnego](#plan-testowania-manualnego)
  - [Plan testowania automatycznego](#plan-testowania-automatycznego)

## Informacje wstępne

### Opis aplikacji

Aplikacja jest narzędziem do tworzenia drzew genealogicznych.
Została napisana w języku TypeScript, z wykorzystaniem frameworka Svelte.
Posiada minimalistyczny UI, który jest łatwy w obsłudze. Głównym obszarem testowania będzie funkcjonalność aplikacji.

### Cele testowania

1. Sprawdzenie poprawności działania aplikacji zgodnie z jej specyfikacją.
2. Umożliwienie bezpiecznego refactoringu poszczególnych aplikacji w oparciu o testy automatyczne.
3. Umożliwienie bezpiecznego dodawania nowych funkcjonalności w oparciu o testy automatyczne.
4. Znalezienie istniejących błędów w aplikacji.
5. Zaliczenie laboratorôw z Testowania Oprogramowania i satysfakcja prowadzącego :).

### Środowisko testowe

Do przetestowania aplikacji zostanie wykorzystana przeglądarka Google Chrome oraz Safari.
Testy automatyczne będą przeprowadzane z wykorzystaniem frameworka Vitest.

### Zakres testowania

Testy będą obejmowały funkcjonalność aplikacji, w tym:

- dodawanie osób
- łączenie osób w małżeństwa
- dodawanie dzieci do rodziny
- usuwanie dzieci z rodziny
- usuwanie osób
- usuwanie małżeństw
- edycja osób
- edycja małżeństw
- poprawny wygląd drzewa, rendering elementów html-owych

Na podstawie aktualnej struktury projektu, zostaną przetestowane komponenty znajdujące się w
`src/components/` oraz `src/store/`.

## Plan testowania manualnego

Testowanie manualne ograniczy się do przejścia przez flow aplikacji, w celu sprawdzenia czy wszystkie funkcjonalności działają poprawnie.
TODO: dodać ze dwa-trzy przebiegi przeklikania

## Plan testowania automatycznego

Komponenty znajdujące się w `src/components` zostaną przetestowane pod kątem poprawności wyświetlania danych oraz poprawności wyświetlania elementów html-owych.

Komponenty znajdujące się w `scr/store` zostaną przetestowane pod kątem poprawności zapisywania danych, logiki biznesowej oraz spójności z oczekiwaniami użytkownika.
