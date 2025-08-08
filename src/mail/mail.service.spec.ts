import { MailerService } from './mailer.service';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    service = new MailerService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
