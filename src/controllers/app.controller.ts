import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import BoxModel from '../models/Box.model';
import { AppService } from '../services/app.service';

@ApiHeader({
  name: 'Authorization',
  description: 'Token header returned on login',
})
@Controller('/player/box')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Boxes')
  @ApiParam({ name: 'id', description: 'Box Id to get details' })
  @ApiResponse({ status: 200, type: BoxModel })
  @Get('/closedbox/:id')
  async getBoxDetail(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      const box = await this.appService.findBoxDetailById(
        response.locals.walletId,
        id,
      );

      response.status(200).json({
        Box: box,
      });
    } catch {
      return response.status(500).json({
        errors: ['Error could not return box'],
      });
    }
  }

  @ApiTags('Boxes')
  @ApiParam({ name: 'id', description: 'Box Id' })
  @ApiResponse({ status: 200, type: BoxModel })
  @Post('/:id')
  async openBox(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const box = await this.appService.openBox(id);

      res.status(200).json({
        Box: box,
      });
    } catch (e) {
      return res.status(500).json({
        errors: ['Could not open box'],
      });
    }
  }
}
