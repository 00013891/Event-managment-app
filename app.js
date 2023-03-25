const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Example events for testing
const events = [
  {
    _id: 1,
    name: 'Birthday Party',
    description: 'Come celebrate my birthday with me!',
    date: '2023-04-01'
  },
  {
    _id: 2,
    name: 'Company Retreat',
    description: 'Join us for a weekend of team-building activities.',
    date: '2023-05-12'
  },
];

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Event Management System', events });
});

app.get('/events/new', (req, res) => {
  res.render('new', { title: 'Create New Event' });
});

app.post('/events', 
  // Add validation rules using express-validator
  body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
  body('date').isISO8601().withMessage('Date must be in ISO8601 format.'),

  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newEvent = {
      _id: events.length + 1,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date
    };
    events.push(newEvent);
    res.redirect('/');
  }
);

app.get('/events/:id/edit', (req, res) => {
    const event = events.find(e => e._id === parseInt(req.params.id));
    res.render('edit', { title:` Edit ${event.name}`, event });
    });
    
    app.put('/events/:id', (req, res) => {
    const event = events.find(e => e._id === parseInt(req.params.id));
    event.name = req.body.name;
    event.description = req.body.description;
    event.date = req.body.date;
    res.redirect('/');
    });
    
    app.delete('/events/:id', (req, res) => {
    const index = events.findIndex(e => e._id === parseInt(req.params.id));
    events.splice(index, 1);
    res.redirect('/');
    });
    
    // Start the server
    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });
