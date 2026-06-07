const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Create a connection to the SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the tasks table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER DEFAULT 0
        )`);
    }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoints

// to get all the tasks
app.get('/api/get', (req, res) => {
	const sqlGet = 'SELECT * FROM tasks';
	db.all(sqlGet, [], (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
		    res.send(result);
        }
	});
});

// to add a new task
app.post('/api/post', (req, res) => {
	const { title, description } = req.body;
	const completed = req.body.completed || 0; 
	const sqlInsert =
		'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)';
	db.run(sqlInsert, [title, description, completed], function(error) {
		if (error) {
			res.status(500).json({ error: 'Internal server error' });
		} else {
            res.send({ id: this.lastID, title, description, completed });
        }
	});
});

// to remove a task
app.delete('/api/remove/:id', (req, res) => {
	const { id } = req.params;
	const sqlRemove = 'DELETE FROM tasks WHERE id = ?';
	db.run(sqlRemove, id, function(error) {
		if (error) {
			console.log(error);
            res.status(500).json({ error: 'Internal server error' });
		} else {
            res.send({ success: true });
        }
	});
});

// to get a task by id
app.get('/api/get/:id', (req, res) => {
	const { id } = req.params;
	const sqlGet = 'SELECT * FROM tasks where id = ?';
	db.get(sqlGet, id, (error, result) => {
		if (error) {
			console.log(error);
            res.status(500).json({ error: 'Internal server error' });
		} else {
		    res.send([result]); // send as array to match original behavior
        }
	});
});

// to update a task
app.put('/api/update/:id', (req, res) => {
	const { id } = req.params;
	const { title, description, completed } = req.body;
	const sqlUpdate =
		'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
	db.run(sqlUpdate, [title, description, completed, id], function(error) {
		if (error) {
			console.log(error);
            res.status(500).json({ error: 'Internal server error' });
		} else {
		    res.send({ success: true });
        }
	});
});

// to update the checkbox for completed task
app.put('/api/updateCompleted/:id', (req, res) => {
	const { id } = req.params;
	const { completed } = req.body;
	const sqlUpdate = 'UPDATE tasks SET completed = ? WHERE id = ?';
	db.run(sqlUpdate, [completed, id], function(error) {
		if (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' });
		} else {
			res.send({ success: true });
		}
	});
});

app.get('/', (req, res) => {
	res.send('Server is running');
});

app.listen(5000, () => {
	console.log('running on port 5000');
});
