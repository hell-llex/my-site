// import ImgItem from '../ImageItem.js';
import ImageItemService from '../service/ImageItemService.js';

class ImageItemController {
  async create(req, res) {
    try {
      const createdItem = await ImageItemService.create(req.body);
      res.json(createdItem);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getAll(req, res) {
    try {
      const items = await ImageItemService.getAll();
      return res.json(items);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getOne(req, res) {
    try {
      const item = await ImageItemService.getOne(req.params.id)
      return res.json(item);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async updateOne(req, res) {
    try {
      const updatedItem = await ImageItemService.updateOne(req.body)
      return res.json(updatedItem);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
  async deleteOne(req, res) {
    try {
      const item = await ImageItemService.deleteOne(req.params.id)
      return res.json(item);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new ImageItemController();