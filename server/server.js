const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Middleware
app.use(cors({
  origin: 'https://email-template-builder-phi.vercel.app/', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 1. Get Email Layout
app.get('/api/getEmailLayout', async (req, res) => {
  try {
    const template = await fs.readFile('./templates/layout.html', 'utf8');
    res.send(template);
  } catch (error) {
    console.error('Error reading template:', error);
    res.status(500).json({ error: 'Error reading template' });
  }
});

// 2. Upload Image
app.post('/api/uploadImage', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// 3. Save Email Configuration
app.post('/api/uploadEmailConfig', async (req, res) => {
  try {
    const config = req.body;
    await fs.writeFile(
      './data/emailConfig.json',
      JSON.stringify(config, null, 2)
    );
    res.json({ message: 'Configuration saved' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving configuration' });
  }
}); 

// 4. Generate and Download Template
app.post('/api/renderAndDownloadTemplate', async (req, res) => {
  try {
    const { content, sections } = req.body;
    let template = await fs.readFile('./templates/layout.html', 'utf8');

    const renderSection = (section) => {
      const getStyles = () => {
        const styles = [];
        if (content.isBold) styles.push('font-weight: bold');
        if (content.isItalic) styles.push('font-style: italic');
        if (content.color) styles.push(`color: ${content.color}`);
        if (content.alignment) styles.push(`text-align: ${content.alignment}`);
        if (content.fontSize) {
          const size = {
            small: '0.875rem',
            medium: '1rem',
            large: '1.25rem'
          }[content.fontSize] || '1rem';
          styles.push(`font-size: ${size}`);
        }
        return styles.join('; ');
      };

      switch(section) {
        case 'title':
          return `<h1 class="title" style="${getStyles()}">${content.title || ''}</h1>`;
        case 'content':
          return `<div class="content" style="${getStyles()}">${content.content || ''}</div>`;
        case 'image':
          return content.image ? 
            `<img src="${content.image}" alt="Content image" class="image">` : '';
        default:
          return '';
      }
    };

    const orderedContent = sections
      .map(section => renderSection(section))
      .join('\n');

    template = template.replace('{{orderedContent}}', orderedContent);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename=email-template.html');
    res.send(template);
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ error: 'Error generating template' });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  