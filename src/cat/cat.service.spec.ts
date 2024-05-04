import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from './cat.service';
import { Cat } from './schemas/cat.schema';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dtos';

describe('CatService', () => {
  let catService: CatService;
  let catModel: Model<Cat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getModelToken(Cat.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    catService = module.get<CatService>(CatService);
    catModel = module.get<Model<Cat>>(getModelToken(Cat.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(catService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cat', async () => {
      const catDto: CreateCatDto = {
        name: 'Whiskers',
        age: 5,
        breed: 'Persian',
      };

      const cat: Cat = {
        ...catDto,
        _id: new Types.ObjectId(),
      };

      catModel.create = jest.fn().mockResolvedValue(cat);

      const result = await catService.create(catDto);

      expect(result).toEqual(cat);
      expect(catModel.create).toHaveBeenCalledWith(catDto);
    });
  });

  describe('findAll', () => {
    it('should return all cats', async () => {
      const cats = [
        { _id: new Types.ObjectId(), name: 'Whiskers', age: 5, breed: 'Persian' },
        { _id: new Types.ObjectId(), name: 'Fluffy', age: 3, breed: 'Maine Coon' },
      ];

      jest.spyOn(catModel, 'find').mockResolvedValue(cats);

      const result = await catService.findAll();

      expect(result).toEqual(cats);
      expect(catModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cat by id', async () => {
      const catId = new Types.ObjectId();
      const cat = { _id: catId, name: 'Whiskers', age: 5, breed: 'Persian' };

      jest.spyOn(catModel, 'findById').mockResolvedValue(cat);

      const result = await catService.findOne(catId.toString());

      expect(result).toEqual(cat);
      expect(catModel.findById).toHaveBeenCalledWith(catId.toString());
    });

    it('should throw a NotFoundException if cat is not found', async () => {
      jest.spyOn(catModel, 'findById').mockResolvedValue(null);

      await expect(catService.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const catId = new Types.ObjectId();
      const updateCatDto: UpdateCatDto = { name: 'Updated Name' };
      const updatedCat = { _id: catId, name: 'Updated Name', age: 5, breed: 'Persian' };

      jest.spyOn(catModel, 'findByIdAndUpdate').mockResolvedValue(updatedCat);

      const result = await catService.update(catId.toString(), updateCatDto);

      expect(result).toEqual(updatedCat);
      expect(catModel.findByIdAndUpdate).toHaveBeenCalledWith(catId.toString(), updateCatDto, { new: true });
    });

    it('should throw a NotFoundException if cat to update is not found', async () => {
      jest.spyOn(catModel, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(catService.update('invalid-id', {} as UpdateCatDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a cat', async () => {
      const catId = new Types.ObjectId();
      const deletedCat = { _id: catId, name: 'Whiskers', age: 5, breed: 'Persian' };

      jest.spyOn(catModel, 'findByIdAndDelete').mockResolvedValue(deletedCat);

      const result = await catService.remove(catId.toString());

      expect(result).toEqual(deletedCat);
      expect(catModel.findByIdAndDelete).toHaveBeenCalledWith(catId.toString());
    });

    it('should throw a NotFoundException if cat to delete is not found', async () => {
      jest.spyOn(catModel, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(catService.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
