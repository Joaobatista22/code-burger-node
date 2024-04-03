import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { admin: isAdmin } = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Only admins can create products' });
    }

    const { filename: path } = req.file;
    const { name, price, category_id, offer } = req.body;

    try {
      const existingProduct = await Product.findOne({ where: { name } });
      if (existingProduct) {
        return res.status(400).json({ error: 'Product with this name already exists.' });
      }

      const product = await Product.create({
        name,
        price,
        category_id,
        path,
        offer,
      });
      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product. Please try again later.');
    }
  }

  async index(req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });
      return res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products. Please try again later.');
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { admin: isAdmin } = await User.findByPk(req.userId);
      if (!isAdmin) {
        return res.status(401).json({ error: 'Only admins can update products' });
      }

      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let path;
      if (req.file) {
        path = req.file.filename;
      } else {
        path = product.path;
      }

      const { name, price, category_id, offer } = req.body;

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        { where: { id } },
      );

      return res.status(200).json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product. Please try again later.');
    }
  }
}

export default new ProductController();
