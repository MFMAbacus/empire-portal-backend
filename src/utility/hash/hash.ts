import crypto from 'crypto';

export class Hash {
  public static make(value: string): string {
    return crypto.createHash('sha256')
        .update(value + salt)
        .digest('hex');
  }
}

const salt = 'empire-world';
