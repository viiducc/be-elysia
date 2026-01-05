// import { SubtleCrypto } from 'bun';
import { subtle } from 'node:crypto';
import { z } from 'zod';
import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import { newShortId, randomNumberString } from '@/src/shared/utils/string';
import { VERIFICATION_CODE_EXPIRATION_TIME, VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_MAX_ATTEMPTS } from '../constants/verification-code.constant';
import { VerificationCodeType } from '../constants/verification-code.enum';

const verificationCodeSchema = z.object({
  id: z.string().length(22),
  userId: z.string().length(22),
  verificationType: z.enum(VerificationCodeType),
  codeHash: z.string().min(1),
  expiresAt: z.date(),
  consumedAt: z.date().nullable(),
  attempts: z.number().min(0).max(VERIFICATION_CODE_MAX_ATTEMPTS),
  createdAt: z.date(),
});

const ENCRYPTION_KEY = new Uint8Array(Array.from(Buffer.from('ahihi_do_ngox123')));

const encoder = new TextEncoder('utf-8');
const decoder = new TextDecoder('utf-8');

async function getKey(): Promise<CryptoKey> {
  try {
    // const lele = encoder.encode(ENCRYPTION_KEY);
    // const lele = crypto.getRandomValues(new Uint8Array(16));
    console.log(String.fromCharCode(...ENCRYPTION_KEY));
    const result = await subtle.importKey('raw', ENCRYPTION_KEY, 'AES-CBC', false, ['encrypt', 'decrypt']);
    if (!result) {
      throw new ServerError(ErrorCodes.VALIDATION_FAILED, 'Invalid encryption key');
    }
    return result;
  } catch (error: any) {
    console.log(error);
    throw new ServerError(ErrorCodes.VALIDATION_FAILED, 'Invalid encryption key');
  }
}

export class VerificationCode {
  public readonly id: string;
  public readonly userId: string;
  public readonly verificationType: VerificationCodeType;
  public readonly codeHash: string;
  public readonly expiresAt: Date;
  public consumedAt: Date | null;
  public attempts: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(verificationCode: Partial<VerificationCode>) {
    const hasher = new Bun.CryptoHasher('sha256');
    const now = new Date();

    this.id = newShortId();
    this.userId = verificationCode.userId ?? '';
    this.verificationType = verificationCode.verificationType ?? VerificationCodeType.EMAIL;
    this.codeHash = verificationCode.codeHash ?? hasher.update(randomNumberString(VERIFICATION_CODE_LENGTH)).digest('hex');
    this.expiresAt = new Date(now.getTime() + VERIFICATION_CODE_EXPIRATION_TIME);
    this.consumedAt = null;
    this.attempts = verificationCode.attempts ?? 0;
    this.createdAt = now;
    this.updatedAt = now;
  }

  static getCodeHash(code: string): string {
    const hasher = new Bun.CryptoHasher('sha256');
    return hasher.update(code).digest('hex');
  }

  async getToken(): Promise<string> {
    const jsonText = JSON.stringify({
      userId: this.userId,
      verificationType: this.verificationType,
      codeHash: this.codeHash,
    });
    const encrypted = await subtle.encrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, await getKey(), encoder.encode(jsonText));
    return Buffer.from(encrypted).toString('hex');
  }

  static async parseToken(token: string): Promise<{ userId: string; verificationType: VerificationCodeType; codeHash: string }> {
    try {
      const encrypted = Buffer.from(token, 'hex');
      const decrypted = await subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, await getKey(), encrypted);
      const jsonText = decoder.decode(decrypted);
      const { userId, verificationType, codeHash } = JSON.parse(jsonText);
      return { userId, verificationType, codeHash };
    } catch {
      throw new ServerError(ErrorCodes.VALIDATION_FAILED, 'Invalid verification token');
    }
  }

  validate(): string | null {
    const result = verificationCodeSchema.safeParse(this);
    if (!result.success) {
      return result.error?.issues[0]?.message || 'Invalid verification code';
    }
    return null;
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  public verify(codeHash: string): boolean {
    if (this.consumedAt !== null || this.isExpired()) {
      return false;
    }

    return this.codeHash === codeHash;
  }
}
