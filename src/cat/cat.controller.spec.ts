import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CreateCatDto, UpdateCatDto } from './dtos';
import { Cat } from './schemas/cat.schema';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('CatController', () => {
  let controller: CatController;
  let service: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        {
          provide: CatService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatController>(CatController);
    service = module.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat and return that', async () => {
      const catDto: CreateCatDto = { name: 'Test', age: 4, breed: 'Mixed' };
      const catId = new Types.ObjectId()
      const result: Cat = {
        _id: catId,
        name: 'Test',
        age: 4,
        breed: 'Mixed',
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(catDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const catId = new Types.ObjectId()
      const result: Cat[] = [
        { _id: catId, name: 'Test', age: 4, breed: 'Mixed' }
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single cat', async () => {
      const catId = new Types.ObjectId()
      const cat: Cat = { _id: catId, name: 'Test', age: 4, breed: 'Mixed' };

      jest.spyOn(service, 'findOne').mockResolvedValue(cat);

      expect(await controller.findOne(catId.toString())).toBe(cat);
    });

    it('should throw NotFoundException if the cat is not found', async () => {
      const catId = new Types.ObjectId()
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(catId.toString())).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const catId = new Types.ObjectId()
      const cat: Cat = { _id: catId, name: 'Updated Name', age: 4, breed: 'Mixed' };
      const updateCatDto: UpdateCatDto = { name: 'Updated Name' };

      jest.spyOn(service, 'update').mockResolvedValue(cat);

      expect(await controller.update(catId.toString(), updateCatDto)).toBe(cat);
    });
  });

  describe('remove', () => {
    it('should delete a cat', async () => {
      const catId = new Types.ObjectId()
      const cat: Cat = { _id: catId, name: 'Test', age: 4, breed: 'Mixed' };

      jest.spyOn(service, 'remove').mockResolvedValue(cat);

      expect(await controller.remove('someid')).toBe(cat);
    });
  });
});
