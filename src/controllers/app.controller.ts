import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import BoxModel from 'src/models/Box.model';
import { AppService } from '../services/app.service';

@ApiHeader({
  name: 'Authorization',
  description: 'Token header returned on login',
})
@Controller('/toyo')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Boxes')
  @ApiParam({ name: 'id', description: 'Box Id to get details' })
  @ApiResponse({ status: 200, type: BoxModel })
  @Get('closedbox/:id')
  async getBoxDetail(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ){
    try {

    }catch(e){
      return response.status(500).json({ 
        erros: ['Error could not return box'],
      });
    }
  }

}
