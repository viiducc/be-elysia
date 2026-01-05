import { sql } from 'drizzle-orm';
import { SqlRepository } from '@/src/infrastructure/sql-repository';
import type { VerificationCodeType } from '../constants/verification-code.enum';
import type { VerificationCode } from '../domain/verification-code';

export class VerificationCodeRepository extends SqlRepository<VerificationCode> {
  async findByCodeHash(codeHash: string): Promise<VerificationCode | null> {
    return super.findOne({
      where: sql`code = ${codeHash}`,
    });
  }

  async findByUserId(userId: string, verificationType?: VerificationCodeType): Promise<VerificationCode | null> {
    return super.findOne({
      where: sql`user_id = ${userId}
        AND consumed_at IS NULL
        AND expires_at > now()
        ${verificationType ? sql`AND verification_type = ${verificationType}` : sql``}
      `,
      orderBy: sql`created_at DESC`,
    });
  }
}
