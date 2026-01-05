import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import { VerificationCode } from '../domain/verification-code';
import type { VerificationCodeRepository } from '../infrastructure/verification-code.repository';

export class VerifyVerificationCodeUseCase {
  constructor(private readonly verificationCodeRepository: VerificationCodeRepository) {}

  async execute(token: string): Promise<VerificationCode> {
    const { userId, verificationType, codeHash } = await VerificationCode.parseToken(token);
    const verificationCode = await this.verificationCodeRepository.findByCodeHash(codeHash);
    if (!verificationCode) {
      throw new ServerError(ErrorCodes.VALIDATION_FAILED, 'Invalid verification token');
    }

    if (verificationCode.userId !== userId || verificationCode.verificationType !== verificationType) {
      throw new ServerError(ErrorCodes.VALIDATION_FAILED, 'Invalid verification token');
    }

    if (!verificationCode.verify(codeHash)) {
      throw new ServerError(ErrorCodes.VALIDATION_FAILED, 'Invalid verification token: Token was already used or expired');
    }

    verificationCode.consumedAt = new Date();
    await this.verificationCodeRepository.update(verificationCode);

    return verificationCode;
  }
}
