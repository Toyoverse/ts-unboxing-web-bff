import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import BoxModel from '../models/Box.model';
import ClosedBoxDetail from '../models/ClosedBoxDetail.model';
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
  @ApiResponse({ status: 200, type: ClosedBoxDetail })
  @Get('/closedbox/:id')
  async getBoxDetail(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      const box: BoxModel = await this.appService.findBoxDetailById(
        response.locals.walletId,
        id,
        response,
      );
      if (box && box.tokenId) {
        return response.status(200).json({
          toyoHash: box.toyoHash,
          toyoSignature: box.toyoSignature,
          tokenId: box.tokenId,
          typeId: box.typeId,
          isOpen: box.isOpen,
          objectId: id,
        });
      }
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
      const box = await this.appService.openBox(id, res);
      if (box) {
        return res.status(200).send({
          box,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errors: ['Could not open box'],
      });
    }
  }
}
