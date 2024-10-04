require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const countryRoutes = require('./routes/countryRoutes');
const actorRoutes = require('./routes/actorRoutes');
const directorRoutes = require('./routes/directorRoutes');
const seriesRoutes = require('./routes/seriesRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.use(movieRoutes);
app.use(genreRoutes);
app.use(countryRoutes);
app.use(actorRoutes);
app.use(directorRoutes);
app.use(seriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
