import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class OtpService {
  generateSecret() {
    return authenticator.generateSecret();
  }

  generateUri(label: string, secret: string, issuer = 'Obrato LMS') {
    return authenticator.keyuri(label, issuer, secret);
  }

  verify(token: string, secret: string) {
    return authenticator.verify({ token, secret });
  }
}
