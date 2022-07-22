import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { BoxService } from '../../services/box.service';

describe('BoxService', () => {
  let boxService: BoxService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BoxService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BACK4APP_APPLICATION_ID') {
                return 'p1H4phT2DnK6hMmTtY2XjLQo8RR3GohzzsS5wnpa';
              }
              if (key === 'BACK4APP_JAVASCRIPT_KEY') {
                return 'EtUKrt6NF82kwxV9IDHDxKNOmFLqfQnLdPxd8zZ8';
              }

              if (key === 'BACK4APP_MASTER_KEY') {
                return 'ufZu0D3ZfZuaJaul1k0DOM7wkTa2F9NMMn3oRKQz';
              }

              if (key === 'BACK4APP_SERVER_URL') {
                return 'https://parseapi.back4app.com/';
              }

              return null;
            }),
          },
        },
      ],
    }).compile();

    boxService = module.get<BoxService>(BoxService);
  });

  describe('openBox', () => {
    it('should return the box opened with the toyo info', async () => {
      const boxId = 'GQr8bKE2xa';

      const result = await boxService.openBox(boxId);
      expect(result).toHaveProperty('toyo');
    });
  });
});
