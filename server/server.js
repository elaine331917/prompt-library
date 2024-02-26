const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const app = express()
const port = 3000
const { v1: uuidv1 } = require('uuid');

const morgan = require('morgan')

app.use(cors());
app.use(express.json())
app.use(morgan('combined'))

// Mock user data
const users = [
  { id: 1, username: 'admin', password: 'uncfa2023', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
];

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'http://dynamodb:8000'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, 'secret-key');

  res.json({ token });
});

// Admin route
app.get('/admin', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
}

/* Retrieve all prompts */
app.get('/prompts', (req, res) => {
  const params = {
    TableName: 'prompts',
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error("Error retrieving prompts: ", err);
      res.status(500).json({ error: "An error occurred while retrieving prompts." });
    } else {
      const prompts = data.Items;
      res.json(prompts);
    }
  });
})

/* Retrieve prompt from id */
app.get('/prompts/:id', (req, res) => {

  const id = req.params.id

  const params = {
    TableName: 'prompts',
    Key: { id: id },
  };

  dynamodb.get(params, (err, data) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to retrieve item from DynamoDB' });
    } else {
      res.send(data.Item);
    }
  });
})

/* Get all categories */
app.get('/categories', (req, res) => {
  const params = {
    TableName: 'prompts',
    ProjectionExpression: 'category',
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning DynamoDB table:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const categoriesSet = new Set();

      data.Items.forEach((item) => {
        if (item.category) {
          categoriesSet.add(item.category);
        }
      });

      const categories = Array.from(categoriesSet);

      res.json({ categories });
    }
  });
})

/* Get all tags */
app.get('/tags', (req, res) => {
  const params = {
    TableName: 'prompts',
    ProjectionExpression: 'tags',
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning DynamoDB table:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const tagsSet = new Set();

      data.Items.forEach(prompt => {
        if (prompt.tags) {
          prompt.tags.forEach(tag => {
            tagsSet.add(tag);
          });
        }
      });

      const tags = Array.from(tagsSet);

      res.json({ tags });
    }
  });
})

/* Get prompts by category */
app.get('/prompts/categories/:category', (req, res) => {
  const category = req.params.category;

  const params = {
    TableName: 'prompts',
    FilterExpression: '#category = :category',
    ExpressionAttributeNames: {
      '#category': 'category',
    },
    ExpressionAttributeValues: {
      ':category': category,
    },
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning DynamoDB table:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(data.Items);
    }
  });
})

/* Create new prompt */
app.post('/prompts', (req, res) => {
  const newPrompt = req.body

  const newPromptData = {
    TableName: 'prompts',
    Item: {
      id: uuidv1(),
      header: newPrompt.header,
      content: newPrompt.content,
      category: newPrompt.category,
      tags: newPrompt.tags,
      example: newPrompt.example,
      created: new Date().toISOString(),
      votes: 0,
      usage: 0,
    },
  };

  dynamodb.put(newPromptData, (err, data) => {
    if (err) {
      console.error('Error creating a new prompt:', err);
      res.status(500).json({ error: 'Failed to create a new prompt' });
    } else {
      const createdPromptId = newPromptData.Item.id;
      console.log('New prompt created:', data);
      res.status(201).json({
        message: 'Prompt created successfully',
        id: createdPromptId,
      });
    }
  });
})

/* Delete prompt from id */
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id


  const params = {
    TableName: 'prompts',
    Key: {
      id: id ,
    },
  };

  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error('Error deleting prompt:', err);
      res.status(500).json({ error: 'Failed to delete' });
    } else {
      console.log(`Deleted prompt with ID: ${id}`);
      return res.json({ message: `Deleted prompt with ID: ${id}` });
    }
  })
})

/* TODO: create general edit prompt endpoint */
/* Update vote count */
app.put('/prompts/:id/edit/vote', (req, res) => {
  const id = req.params.id
  const newData = req.body;

  const params = {
    TableName: 'prompts',
    Key: { id: id },
    UpdateExpression: 'set #votes = :votes',
    ExpressionAttributeNames: {
      '#votes': 'votes'
    },
    ExpressionAttributeValues: {
      ':votes': parseInt(newData.votes)
    },
    ReturnValues: 'UPDATED_NEW',
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error('Error updating prompt:', err);
      return res.status(500).json({ error: 'Failed to update prompt' });
    } else {
      console.log(`Updated prompt with ID: ${id}`);
      return res.json({ message: `Updated prompt with ID: ${id}` });
    }
  });
})

/* Update usage count */
app.put('/prompts/:id/edit/usage', (req, res) => {
  const id = req.params.id
  const newData = req.body;

  const params = {
    TableName: 'prompts',
    Key: { id: id },
    UpdateExpression: 'set #usage = :usage',
    ExpressionAttributeNames: {
      '#usage': 'usage'
    },
    ExpressionAttributeValues: {
      ':usage': parseInt(newData.usage)
    },
    ReturnValues: 'UPDATED_NEW',
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error('Error updating prompt:', err);
      return res.status(500).json({ error: 'Failed to update prompt' });
    } else {
      console.log(`Updated prompt with ID: ${id}`);
      return res.json({ message: `Updated prompt with ID: ${id}` });
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
