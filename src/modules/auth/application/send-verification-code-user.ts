import { appConfig } from '@/config/app.config';
import type { IEmailService } from '@/src/infrastructure/email-service';
import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import { VERIFICATION_CODE_MAX_ATTEMPTS } from '../constants/verification-code.constant';
import { VerificationCodeType } from '../constants/verification-code.enum';
import type { User } from '../domain/user';
import { VerificationCode } from '../domain/verification-code';
import { UserRegistrationEmail } from '../infrastructure/email-templates/user-registration-email';
import type { VerificationCodeRepository } from '../infrastructure/verification-code.repository';

export class SendVerificationCodeUseCase {
  constructor(
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly emailService: IEmailService,
  ) { }

  async execute(user: User): Promise<Error | undefined> {
    if (user.isVerified) {
      return new ServerError(ErrorCodes.INVALID_INPUT, 'User already verified');
    }

    let attempts = 0;
    // Check if user has a verification code
    const verificationCode = await this.verificationCodeRepository.findByUserId(user.id, VerificationCodeType.EMAIL);
    if (verificationCode && verificationCode.consumedAt === null) {
      attempts = verificationCode.attempts + 1;
    }

    if (attempts > VERIFICATION_CODE_MAX_ATTEMPTS) {
      return new ServerError(ErrorCodes.VALIDATION_FAILED, 'Too many attempts. Please try again later.');
    }

    const newVerificationCode = new VerificationCode({
      userId: user.id,
      verificationType: VerificationCodeType.EMAIL,
      attempts,
    });

    const error = newVerificationCode.validate();
    if (error) {
      throw new ServerError(ErrorCodes.VALIDATION_FAILED, error);
    }

    await this.verificationCodeRepository.create(newVerificationCode);

    if (user.email) {
      // Send verification code to user via email
      await this.emailService.sendToUserWithTemplate(user, '[AGRIPOS] Account email verification', UserRegistrationEmail, {
        name: user.displayName,
        verificationToken: await newVerificationCode.getToken(),
        publicUrl: appConfig.publicUrl,
      });
    }
  }
}
