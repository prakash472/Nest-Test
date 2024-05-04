import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CatService } from '../../cat.service';
import { Cat,CatSchema } from '../../schemas/cat.schema';
import mongoose, { Connection, Model,connect } from 'mongoose';

describe('CatService Integration Tests', () => {
    let service: CatService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let catModel: Model<Cat>;

    beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    catModel = mongoConnection.model(Cat.name, CatSchema);

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
                MongooseModule.forRoot(uri),
            ],
            providers: [CatService],
        }).compile();

        service = module.get<CatService>(CatService);
        catModel = module.get<Model<Cat>>(getModelToken(Cat.name));
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await mongoConnection.dropDatabase();
    });

    it('should create a new cat', async () => {
        const createCatDto = { name: 'Test Cat', age: 3, breed: 'Test Breed' };
        const cat = await service.create(createCatDto);
        expect(cat.name).toBe(createCatDto.name);
        expect(cat.age).toBe(createCatDto.age);
        expect(cat.breed).toBe(createCatDto.breed);
    });

    it('should find all cats', async () => {
        await service.create({ name: 'Test Cat1', age: 4, breed: 'Test Breed1' });
        await service.create({ name: 'Test Cat2', age: 5, breed: 'Test Breed2' });

        const cats = await service.findAll();
        expect(cats.length).toBe(2);
    });

    it('should find one cat by id', async () => {
        const cat = await service.create({ name: 'Test Cat', age: 3, breed: 'Test Breed' });
        const foundCat = await service.findOne(cat._id.toString());
        expect(foundCat._id.toString()).toEqual(cat._id.toString());
    });

    it('should update a cat', async () => {
        const cat = await service.create({ name: 'Test Cat', age: 3, breed: 'Test Breed' });
        const updatedCat = await service.update(cat._id.toString(), { name: 'Updated Cat' });
        expect(updatedCat.name).toBe('Updated Cat');
    });

    it('should remove a cat', async () => {
        const cat = await service.create({ name: 'Test Cat', age: 3, breed: 'Test Breed' });
        const removedCat = await service.remove(cat._id.toString());
        expect(removedCat._id.toString()).toEqual(cat._id.toString());
    });
});