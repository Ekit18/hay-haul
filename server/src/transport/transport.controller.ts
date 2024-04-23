import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { UserRole } from 'src/user/user.entity';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier)
@Controller('transport')
export class TransportController {
    constructor(private readonly transportService: TransportService) { }

    @Post('/carrier/:carrierId')
    async createTransport(@Body() createTransportDto: CreateTransportDto, @Param('carrierId') carrierId: string) {
        return await this.transportService.create(createTransportDto, carrierId);
    }

    @Delete(':id')
    async deleteTransport(@Param('id') id: string) {
        return await this.transportService.delete(id);
    }

    @Put(':id')
    async updateTransport(@Param('id') id: string, @Body() updateTransportDto: CreateTransportDto) {
        return await this.transportService.update(id, updateTransportDto);
    }

    @Get('carrier/:carrierId')
    async getTransportsByCarrierId(@Param(':carrierId') carrierId: string) {
        return await this.transportService.getTransportsByCarrierId(carrierId);
    }

    @Get(':id')
    async getTransportById(@Param('id') id: string) {
        return await this.transportService.getTransportById(id);
    }
}
