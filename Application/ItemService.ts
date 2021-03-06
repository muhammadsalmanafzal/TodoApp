// * packages
import { v1 as uuidv1 } from 'uuid';
import express from 'express';

// * Error Handlers
import { AppError } from '../Utils/AppError';

// * Utils
import Pagination from '../Utils/Pagination';

// * DDD
import { ItemEntity } from '../Domain/ItemEntity';
import ItemRepository from '../Infrastructure/Repositories/ItemRepository';

class ItemService {
  createItem = async (req: express.Request): Promise<ItemEntity> => {
    // * Utilize Entity
    // TODO Quesion linked to ItemEntity.js
    // const item = ItemEntity.fromAPI(
    //   req.session.user.userId,
    //   req.body.title,
    //   req.body.priority,
    //   req.body.description,
    //   req.body.dueDate
    // );

    const itemAPI = ItemEntity.fromAPI(req);
    itemAPI.setItemId(uuidv1());
    itemAPI.setUserId(req.session.user.userId);

    // * Utilize Repository
    const newItem = await ItemRepository.createItem(itemAPI);

    // * Utilize Entity
    const itemDB = ItemEntity.fromDB(newItem);

    return itemDB;
  };

  readItem = async (
    req: express.Request,
    next: express.NextFunction
  ): Promise<void | ItemEntity> => {
    // * Utilize Entity
    const itemAPI = ItemEntity.fromAPI(req);
    itemAPI.setItemId(req.params.id);
    itemAPI.setUserId(req.session.user.userId);

    // * Utilize Repository
    const item = await ItemRepository.readItem(itemAPI.itemId, itemAPI.userId);

    // * If no item found with id
    if (!item)
      return next(
        new AppError(
          `Item with itemId: ${req.params.id} for user with userId: ${req.session.user.userId} with cannot be found. Check Id again in URL`,
          404
        )
      );

    // * Utilize Entity
    const itemDB = ItemEntity.fromDB(item);

    return itemDB;
  };

  updateItem = async (
    req: express.Request,
    next: express.NextFunction
  ): Promise<void | ItemEntity> => {
    // * Utilize Entity
    const itemAPI = ItemEntity.fromAPI(req);
    itemAPI.setItemId(req.params.id);
    itemAPI.setUserId(req.session.user.userId);

    // * Utilize Repository
    const isUpdated = await ItemRepository.updateItem(
      itemAPI,
      itemAPI.itemId,
      itemAPI.userId
    );
    console.log(isUpdated);

    // * If no item found with id
    if (isUpdated[0] === 0)
      return next(
        new AppError(
          `Item with id: ${req.params.id} cannot be found. Check Id again in URL`,
          404
        )
      );

    // * Utilize Entity
    const item = await ItemRepository.readItem(itemAPI.itemId, itemAPI.userId);
    const itemDB = ItemEntity.fromDB(item);

    return itemDB;
  };

  deleteItem = async (
    req: express.Request,
    next: express.NextFunction
  ): Promise<number | void> => {
    // * Utilize Entity
    const itemAPI = ItemEntity.fromAPI(req);
    itemAPI.setItemId(req.params.id);
    itemAPI.setUserId(req.session.user.userId);

    // * Utilize Repository
    const item = await ItemRepository.deleteItem(
      itemAPI.itemId,
      itemAPI.userId
    );

    // * If no item found with id
    if (!item)
      return next(
        new AppError(
          `Item with id: ${req.params.id} cannot be found. Check Id again in URL`,
          404
        )
      );
    return item;
  };

  readAllItem = async (req: express.Request) => {
    // * Utilize Entity
    const itemAPI = ItemEntity.fromAPI(req);
    itemAPI.setUserId(req.session.user.userId);

    const pagination = new Pagination(
      req.query.limit ? +req.query.limit : 2,
      req.query.page ? +req.query.page : 1
    );

    // * Utilize Repository
    const allItems = await ItemRepository.readAllItem(
      itemAPI.userId,
      pagination
    );

    // * Utilize Entity
    const itemDB = allItems.data.map((el) => {
      return ItemEntity.fromDB(el);
    });

    console.log(allItems);
    return itemDB;
  };
}
export default new ItemService();
