// const Product = require('../models/Product');

// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to get products' });
//   }
// };

// exports.addProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, image } = req.body;
//     const userId = req.user?.userId;

//     if (!name || !userId) {
//       return res.status(400).json({ message: 'Product name and user ID are required' });
//     }

//     const newProduct = new Product({
//       name,
//       description,
//       price,
//       category,
//       image,
//       userId
//     });

//     await newProduct.save();

//     res.status(201).json({ message: 'Product added successfully', product: newProduct });
//   } catch (error) {
//     console.error('Add product error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const userId = req.user?.userId;

//     const product = await Product.findOne({ _id: productId, userId });
//     if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

//     await Product.deleteOne({ _id: productId });
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     console.error('Delete product error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const updates = req.body;
//     const userId = req.user?.userId;

//     const updated = await Product.findOneAndUpdate(
//       { _id: productId, userId },
//       updates,
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ message: 'Product not found or unauthorized' });

//     res.json(updated);
//   } catch (error) {
//     console.error('Update product error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const Product = require('../models/Product');

// Controller to get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Controller to add a product
exports.addProduct = async (req, res) => {
  try {
    // Check if request body exists
    if (!req.body) {
      return res.status(400).json({
        message: 'Request body is missing. Make sure to send Content-Type: application/json'
      });
    }

    const { name, description, price, category, buyerId } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Product name is required.' });
    }

    // Get image path if file was uploaded
    const imagePath = req.file ? req.file.path : null;

    // Create new product instance
    const newProduct = new Product({
      name,
      description: description || '',
      price: price || 0,
      category: category || 'Uncategorized',
      image: imagePath,
      userId: buyerId
    });

    // Save to database
    await newProduct.save();

    // Send success response
    return res.status(201).json({
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Add product error:', error);

    // Check for specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle other types of errors
    return res.status(500).json({
      message: 'Failed to add product',
      error: error.message
    });
  }
};


// Controller to delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user?.userId; // Get user ID from token

    const product = await Product.findOne({ _id: productId, userId: userId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or you are not authorized to delete it' });
    }

    // You might also want to delete the file from the server's 'uploads' folder here
    // const fs = require('fs');
    // fs.unlinkSync(product.image);

    await Product.deleteOne({ _id: productId });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    const userId = req.user?.userId;

    const product = await Product.findOneAndUpdate(
      { _id: productId, userId: userId }, // Condition
      updates,                           // The updates
      { new: true }                      // Options: return the updated document
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found or you are not authorized to update it' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};