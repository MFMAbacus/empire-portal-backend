const crypto = require("crypto");

export class Generator {
  protected static _randomString(length = 8): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * 100) % stringSource.length;
      result = result + stringSource[index];
    }
    return result;
  }

  protected static _randomDigits(length = 4): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * 100) % digitsSource.length;
      result = result + digitsSource[index];
    }
    return result;
  }

  public static shortToken(): string {
    return Generator._randomString(16);
  }

  public static id(prefix: string | null = null): string {
    if (prefix === null) {
      return Generator._randomDigits(6);
    }
    return `${prefix}-${Generator._randomDigits(6)}`;
  }

  public static otp(): string {
    return Generator._randomDigits(4);
  }

  public static uuid(prefix: string): string {
    let uuid = crypto.randomUUID().toString().substring(0, 15);
    return `${prefix}-${uuid}`;
  }
}

const stringSource = `\
abcdefghijklmnopqrstuvwxyz\
ABCDEFGHIJKLMNOPQRSTUVWXYZ\
0123456789`;

const digitsSource = "0123456789";
