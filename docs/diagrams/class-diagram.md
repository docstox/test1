# Architettura OOP - LibriVicini

Di seguito è riportato lo schema UML delle classi per l'applicazione LibriVicini.
Lo schema evidenzia le entità principali, le loro proprietà (attributi) e i loro comportamenti (metodi).

## Diagramma delle Classi (Mermaid)

```mermaid
classDiagram
    %% Definizione delle relazioni
    Profile "1" -- "*" Library : possiede >
    Profile "1" -- "*" LibraryBook : gestisce >
    Profile "1" -- "*" Message : invia / riceve >
    Library "1" -- "*" LibraryBook : contiene >
    Book "1" -- "*" LibraryBook : descrive >
  

    %% Classe Profile (Utente)
    class Profile {
        +UUID id
        +String email
        +String nickname
        +String phone
        +Date created_at
        +registraNuovoUtente(email, password)$ Profile
        +aggiornaProfilo(datiNuovi)
        +creaLibreria(nome, posizione)
        +inviaMessaggio(destinatario, testo)
    }

    %% Classe Library (La libreria fisica/virtuale)
    class Library {
        +UUID id
        +UUID user_id
        +String name
        +String location_text
        +Geography location
        +Boolean is_public
        +Date created_at
        +calcolaDistanzaDallUtente(lat, lng) float
        +aggiungiLibroFisico(Book) LibraryBook
        +rendiPrivata()
    }

    %% Classe Book (Il Catalogo Globale Astratto)
    class Book {
        +UUID id
        +String isbn
        +String title
        +String author
        +String publisher
        +Int published_year
        +String cover_url
        +Date created_at
        +ottieniRiassunto() String
        +validaISBN() Boolean
    }

    %% Classe LibraryBook (La specifica copia di un libro posseduta da qualcuno)
    class LibraryBook {
        +UUID id
        +UUID library_id
        +UUID book_id
        +UUID user_id
        +String status
        +String review_text
        +Boolean review_is_public
        +Date created_at
        +cambiaStato(nuovoStato)
        +scriviRecensione(testo, pubblica)
    }

    %% Classe Message (Messaggistica interna)
    class Message {
        +UUID id
        +UUID sender_id
        +UUID receiver_id
        +String content
        +Date created_at
        +segnaComeLetto()
    }