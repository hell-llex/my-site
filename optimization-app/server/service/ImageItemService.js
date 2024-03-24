import ImgItem from '../ImageItem.js';
class ImageItemService {
  async create(item) {
    const createdItem = await ImgItem.create(item);
    return createdItem;
  }
  async getAll() {
    const items = await ImgItem.find();
    return items;
  }
  async getOne(id) {
    if (!id) {
      throw new Error('id not specified!')
    }
    const item = await ImgItem.findById(id)
    return item;
  }
  async updateOne(item) {
    if (!item._id) {
      throw new Error('id not specified!')
    }
    const updatedItem = await ImgItem.findByIdAndUpdate(item._id, item, { new: true })
    return updatedItem;
  }
  async deleteOne(id) {
    if (!id) {
      throw new Error('id not specified!')
    }
    const item = await ImgItem.findByIdAndDelete(id)
    return item;
  }
}

export default new ImageItemService();