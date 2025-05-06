const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.get('/', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
});


