import express from 'express';
import cors from 'cors';
import {configDotenv} from 'dotenv';
import axios from 'axios';
configDotenv();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.post('/add', async(req, res) => {
    try {
        const { name, desc, start, due } = req.body;

        const apiUrl = `https://api.trello.com/1/cards?idList=${process.env.LISTID}&key=${process.env.API_KEY}&token=${process.env.TOKEN}&name=${
            name
        }&desc=${desc}&due=${
            due
        }&start=${start}`;

        const response = await axios.post(apiUrl);
        return res.status(201).json({ message: "Trello card created successfully!", data: response.data });

    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: error.message });
    }
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})