-- Tabel Movie
    CREATE TABLE Movie (
        id INT AUTO_INCREMENT NOT NULL,
        title TEXT NOT NULL,
        rating DOUBLE NOT NULL,
        directorId INT NOT NULL, -- Foreign key to Director
        approval_status BOOLEAN NOT NULL,
        countryId TEXT NOT NULL, -- Foreign key to Country table
        release_date TIMESTAMP NOT NULL,
        synopsis TEXT NOT NULL,
        poster_url TEXT NOT NULL, -- URL to the movie poster
        trailer_url TEXT NOT NULL, -- URL to the movie trailer
        PRIMARY KEY (id)
    );

    -- Tabel Series
    CREATE TABLE Series (
        id INT AUTO_INCREMENT NOT NULL,
        title TEXT NOT NULL,
        rating DOUBLE NOT NULL,
        directorId INT NOT NULL, -- Foreign key to Director
        approval_status BOOLEAN NOT NULL,
        countryId TEXT NOT NULL, -- Foreign key to Country table
        release_date TIMESTAMP NOT NULL,
        synopsis TEXT NOT NULL,
        seasons INTEGER NOT NULL, -- Number of seasons for series
        episodes INTEGER NOT NULL, -- Number of episodes for series
        poster_url TEXT NOT NULL, -- URL to the series poster
        trailer_url TEXT NOT NULL, -- URL to the series trailer
        PRIMARY KEY (id)
    );

    -- Tabel Director
    CREATE TABLE Director (
        id INT AUTO_INCREMENT NOT NULL,
        name TEXT NOT NULL,
        birthdate TIMESTAMP NOT NULL,
        countryId TEXT NOT NULL, -- Foreign key to Country table
        biography TEXT, -- Biography of the director
        PRIMARY KEY (id)
    );

    -- Tabel Actor
    CREATE TABLE Actor (
        id INT AUTO_INCREMENT NOT NULL,
        name TEXT NOT NULL,
        birthdate TIMESTAMP NOT NULL,
        countryId TEXT NOT NULL, -- Foreign key to Country table
        biography TEXT, -- Biography of the actor
        PRIMARY KEY (id)
    );

    -- Tabel Genre
    CREATE TABLE Genre (
        id INT AUTO_INCREMENT NOT NULL,
        name TEXT NOT NULL,
        PRIMARY KEY (id)
    );

        -- Tabel Country
        CREATE TABLE Country (
            countryId INT AUTO_INCREMENT NOT NULL, -- Menggunakan countryId sebagai primary key
            name TEXT NOT NULL, -- Nama negara
            PRIMARY KEY (countryId)
        );

    -- Tabel Award
    CREATE TABLE Award (
        id INT AUTO_INCREMENT NOT NULL,
        name TEXT NOT NULL,
        year INTEGER NOT NULL,
        countryId TEXT NOT NULL, -- Foreign key to Country table
        PRIMARY KEY (id)
    );

    -- Tabel MovieReview
    CREATE TABLE MovieReview (
        id INT AUTO_INCREMENT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        movieId INTEGER NOT NULL, -- Foreign key to Movie
        userId INTEGER NOT NULL, -- Foreign key to User
        PRIMARY KEY (id)
    );

    -- Tabel SeriesReview
    CREATE TABLE SeriesReview (
        id INT AUTO_INCREMENT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        seriesId INTEGER NOT NULL, -- Foreign key to Series
        userId INTEGER NOT NULL, -- Foreign key to User
        PRIMARY KEY (id)
    );

    -- Tabel Season
    CREATE TABLE Season (
        id INT AUTO_INCREMENT NOT NULL,
        seriesId INT NOT NULL, -- Foreign key to Series
        season_number INTEGER NOT NULL, -- Season number
        synopsis TEXT NOT NULL, -- Season synopsis
        poster_url TEXT NOT NULL, -- URL to the season poster
        trailer_url TEXT, -- URL to the season trailer (optional)
        PRIMARY KEY (id),
        FOREIGN KEY (seriesId) REFERENCES Series(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Episode
    CREATE TABLE Episode (
        id INT AUTO_INCREMENT NOT NULL,
        seasonId INT NOT NULL, -- Foreign key to Season
        episode_number INTEGER NOT NULL, -- Episode number
        title TEXT NOT NULL, -- Episode title
        synopsis TEXT NOT NULL, -- Episode synopsis
        release_date TIMESTAMP NOT NULL, -- Release date of the episode
        poster_url TEXT NOT NULL, -- URL to the episode poster
        trailer_url TEXT, -- URL to the episode trailer (optional)
        PRIMARY KEY (id),
        FOREIGN KEY (seasonId) REFERENCES Season(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel User
    CREATE TABLE User (
        id SERIAL NOT NULL,
        name TEXT NOT NULL, -- Full name of the user
        username TEXT NOT NULL, -- Unique username of the user
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar_path TEXT, -- Path to the user's avatar image
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp for account creation
        CONSTRAINT User_pkey PRIMARY KEY (id)
    );

    -- Tabel Many-to-Many Relasi Movie dengan Actor
    CREATE TABLE _MovieActors (
        A INTEGER NOT NULL, -- Foreign key to Actor
        B INTEGER NOT NULL, -- Foreign key to Movie
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Movie(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Movie dengan Genre
    CREATE TABLE _MovieGenres (
        A INTEGER NOT NULL, -- Foreign key to Genre
        B INTEGER NOT NULL, -- Foreign key to Movie
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Genre(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Movie(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Series dengan Actor
    CREATE TABLE _SeriesActors (
        A INTEGER NOT NULL, -- Foreign key to Actor
        B INTEGER NOT NULL, -- Foreign key to Series
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Series(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Series dengan Genre
    CREATE TABLE _SeriesGenres (
        A INTEGER NOT NULL, -- Foreign key to Genre
        B INTEGER NOT NULL, -- Foreign key to Series
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Genre(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Series(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Movie dengan Award
    CREATE TABLE _MovieAwards (
        A INTEGER NOT NULL, -- Foreign key to Award
        B INTEGER NOT NULL, -- Foreign key to Movie
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Award(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Movie(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Series dengan Award
    CREATE TABLE _SeriesAwards (
        A INTEGER NOT NULL, -- Foreign key to Award
        B INTEGER NOT NULL, -- Foreign key to Series
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Award(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Series(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Award dengan Actor
    CREATE TABLE _AwardActors (
        A INTEGER NOT NULL, -- Foreign key to Award
        B INTEGER NOT NULL, -- Foreign key to Actor
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Award(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Actor(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Tabel Many-to-Many Relasi Award dengan Director
    CREATE TABLE _AwardDirectors (
        A INTEGER NOT NULL, -- Foreign key to Award
        B INTEGER NOT NULL, -- Foreign key to Director
        UNIQUE (A, B),
        FOREIGN KEY (A) REFERENCES Award(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (B) REFERENCES Director(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Create necessary indexes
    CREATE INDEX _MovieActors_B_index ON _MovieActors(B);
    CREATE INDEX _MovieGenres_B_index ON _MovieGenres(B);
    CREATE INDEX _SeriesActors_B_index ON _SeriesActors(B);
    CREATE INDEX _SeriesGenres_B_index ON _SeriesGenres(B);