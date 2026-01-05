import type { IMapper } from '@/src/infrastructure/sql-repository';
import { VerificationCodeType } from '../constants/verification-code.enum';
import { VerificationCode } from '../domain/verification-code';
import type { InsertVerificationCodeTable, SelectVerificationCodeTable } from './schema/verification-codes';

export class VerificationCodeMapper implements IMapper<VerificationCode> {
  toPersistence(domain: VerificationCode): InsertVerificationCodeTable {
    return {
      id: domain.id,
      userId: domain.userId,
      verificationType: domain.verificationType,
      code: domain.codeHash,
      expiresAt: domain.expiresAt,
    };
  }
  toDomain(dbResult: SelectVerificationCodeTable): VerificationCode {
    return new VerificationCode({
      id: dbResult.id,
      userId: dbResult.userId,
      verificationType: VerificationCodeType[dbResult.verificationType as keyof typeof VerificationCodeType],
      codeHash: dbResult.code,
      expiresAt: dbResult.expiresAt,
      consumedAt: dbResult.consumedAt,
      attempts: dbResult.attempts,
      createdAt: dbResult.createdAt,
    });
  }
  toDomainList(dbResults: SelectVerificationCodeTable[]): VerificationCode[] {
    return dbResults.map(this.toDomain);
  }
  toUpdatePersistence(domain: VerificationCode): InsertVerificationCodeTable {
    return {
      id: domain.id,
      userId: domain.userId,
      verificationType: domain.verificationType,
      code: domain.codeHash,
      expiresAt: domain.expiresAt,
      consumedAt: domain.consumedAt,
      attempts: domain.attempts,
      updatedAt: domain.updatedAt,
    };
  }
}
