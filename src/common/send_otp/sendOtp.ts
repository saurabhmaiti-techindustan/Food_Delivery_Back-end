export class SendOtp {
  generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }
  optExpiry(): Date {
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return otpExpiry;
  }
}
