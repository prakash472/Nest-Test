import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';
import { CreateCatDto, UpdateCatDto } from './dtos';


@Injectable()
export class CatService {
    constructor(
        @InjectModel(Cat.name)
        private readonly catModel: Model<CatDocument>,
    ) { }

    async create(createCatDto: CreateCatDto): Promise<Cat> {
        const createdCat = await this.catModel.create(createCatDto);
        return createdCat;
    }

    async findAll(): Promise<Cat[]> {
        return this.catModel.find()
    }

    async findOne(id: string): Promise<Cat> {
        const cat = await this.catModel.findById(id);
        if (!cat) {
            throw new NotFoundException(`Cat with id ${id} not found`);
        }
        return cat;
    }

    async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
        const existingCat = await this.catModel.findByIdAndUpdate(
            id,
            updateCatDto,
            { new: true },
        );
        if (!existingCat) {
            throw new NotFoundException(`Cat with id ${id} not found`);
        }
        return existingCat;
    }

    async remove(id: string): Promise<Cat> {
        const deletedCat = await this.catModel.findByIdAndDelete(id);
        if (!deletedCat) {
            throw new NotFoundException(`Cat with id ${id} not found`);
        }
        return deletedCat;
    }

}
