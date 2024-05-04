import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto, UpdateCatDto } from './dtos';
import { Cat } from './schemas/cat.schema';

@Controller('cats')
export class CatController {
    constructor(private readonly catService: CatService) { }

    @Post()
    async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
        return this.catService.create(createCatDto);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cat> {
        return this.catService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto): Promise<Cat> {
        return this.catService.update(id, updateCatDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Cat> {
        return this.catService.remove(id);
    }
}
