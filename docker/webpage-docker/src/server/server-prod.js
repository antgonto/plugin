'use strict';

import path from 'path';
import express from 'express';
import onLoad from '../js/log4us';

global.log4us = onLoad;


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')

global.log4us.print("Server started Succesfully");

app.use(express.static(DIST_DIR))
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	log4us.print(`Server started on port: ${PORT}`);
});