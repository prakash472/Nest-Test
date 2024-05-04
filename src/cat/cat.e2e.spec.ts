import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { CatModule } from './cat.module';
import { Cat } from './schemas/cat.schema';

describe('CatController (e2e)', () => {
    let app: INestApplication;
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CatModule,
                MongooseModule.forRoot(uri),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await mongod.stop();
    });

    it('/POST cats', async () => {
        const catDto = { name: 'Test Cat', age: 3, breed: 'Test Breed' };
        return request(app.getHttpServer())
            .post('/cats')
            .send(catDto)
            .expect(201)
            .expect(({ body }: { body: Cat }) => {
                expect(body.name).toEqual(catDto.name);
                expect(body.age).toEqual(catDto.age);
                expect(body.breed).toEqual(catDto.breed);
            });
    });

    it('/GET cats', async () => {
        const response = await request(app.getHttpServer())
            .get('/cats')
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('/GET cats/:id', async () => {
        const catDto = { name: 'Test Cat2', age: 4, breed: 'Test Breed2' };
        const createResponse = await request(app.getHttpServer())
            .post('/cats')
            .send(catDto);
        const catId = createResponse.body._id;

        return request(app.getHttpServer())
            .get(`/cats/${catId}`)
            .expect(200)
            .expect(({ body }: { body: Cat }) => {
                expect(body._id).toEqual(catId);
                expect(body.name).toEqual(catDto.name);
                expect(body.age).toEqual(catDto.age);
                expect(body.breed).toEqual(catDto.breed);
            });
    });

    it('/PUT cats/:id', async () => {
        const catDto = { name: 'Test Cat3', age: 5, breed: 'Test Breed3' };
        const updateCatDto = { name: 'Updated Cat3' };
        const createResponse = await request(app.getHttpServer())
            .post('/cats')
            .send(catDto);
        const catId = createResponse.body._id;

        return request(app.getHttpServer())
            .put(`/cats/${catId}`)
            .send(updateCatDto)
            .expect(200)
            .expect(({ body }: { body: Cat }) => {
                expect(body.name).toEqual(updateCatDto.name);
            });
    });

    it('/DELETE cats/:id', async () => {
        const catDto = { name: 'Test Cat4', age: 6, breed: 'Test Breed4' };
        const createResponse = await request(app.getHttpServer())
            .post('/cats')
            .send(catDto);
        const catId = createResponse.body._id;

        return request(app.getHttpServer())
            .delete(`/cats/${catId}`)
            .expect(200)
            .expect(({ body }: { body: Cat }) => {
                expect(body._id).toEqual(catId);
            });
    });
});
