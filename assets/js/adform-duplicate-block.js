

$(window).on('load', function() {
    const date = new Date();
    const expDate = date.getTime() + 1000 * 60 * 60 * 24; // Ustawienie wygaśnięcia na 24 godziny od teraz

    let storedValue = JSON.parse(localStorage.getItem('isVisited')); // Pobranie wartości z localStorage
    const currentTime = new Date().getTime(); // Bieżący czas w milisekundach
    if (storedValue && (currentTime < storedValue.expDate)) {
        // Jeśli zapis istnieje i nie minęło 24 godziny, blokuj dalsze wykonywanie
    } else {
        // Jeśli zapis nie istnieje lub minęło 24 godziny, ustaw nowy zapis
        localStorage.setItem('isVisited', JSON.stringify({
            value: true,
            expDate: expDate
        }));
    }
});

