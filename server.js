require('dotenv').config(); // ✅ Top of file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '10mb' })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));


const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
//const supplierRoutes = require('./routes/supplierRoutes'); 

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
//app.use('/api/suppliers', supplierRoutes);

// 👇 Add this debug line
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch(err => console.error('Connection error:', err));