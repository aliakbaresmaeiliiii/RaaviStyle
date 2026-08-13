export const messages = {
  brand: "راوی‌استایل",
  meta: {
    title: "راوی‌استایل",
    description: "فروشگاه پوشاک راوی‌استایل",
  },
  nav: {
    signIn: "ورود",
    account: "حساب کاربری",
  },
  home: {
    eyebrow: "به‌زودی",
    title: "لباسی که انگار برای شما دوخته شده",
    body: "فروشگاه با ورود از طریق شماره موبایل شروع می‌شود. کاتالوگ و پرداخت قدم‌های بعدی هستند.",
    signIn: "ورود",
  },
  login: {
    eyebrow: "راوی‌استایل",
    title: "ورود بدون رمز عبور",
    body: "شماره را بدهید، کد را وارد کنید، تمام.",
    formTitle: "ورود",
    formBody: "شماره موبایل را وارد کنید تا کد برایتان ارسال شود.",
    phoneLabel: "شماره موبایل",
    phonePlaceholder: "۰۹۱۲ ۱۲۳ ۴۵۶۷",
    phoneHint: "مثل ۹۱۲ ۱۲۳ ۴۵۶۷",
    privacy: "شماره فقط برای ورود استفاده می‌شود.",
    continue: "دریافت کد",
    sending: "در حال ارسال...",
    verifying: "در حال بررسی...",
    otpLabel: "کد تأیید",
    verifyTitle: "کد پیامک‌شده را وارد کنید",
    verifyBody: (phone: string) => `کد ۶ رقمی به ${phone} ارسال شد.`,
    changeNumber: "ویرایش شماره",
    resend: "ارسال دوباره",
    resendIn: (seconds: number) =>
      `ارسال دوباره تا ${seconds.toLocaleString("fa-IR")} ثانیه`,
    stepPhone: "شماره",
    stepCode: "کد تأیید",
    trustFast: "ورود سریع، بدون رمز",
    trustAuto: "اگر حساب ندارید، همین‌جا ساخته می‌شود",
    panelKicker: "فروشگاه پوشاک",
    panelTitle: "زیبایی در سادگی گرم",
    panelBody: "ورود در چند ثانیه، بدون رمز. بعد از آن، کمد شما اینجاست.",
    collection: "مجموعه ۱۴۰۵",
    devHint: "در محیط توسعه، کد در ترمینال بک‌اند چاپ می‌شود.",
  },
  account: {
    eyebrow: "حساب کاربری",
    title: "وارد شدید",
    phone: "شماره موبایل",
    name: "نام",
    signOut: "خروج",
  },
  notFound: {
    title: "صفحه پیدا نشد",
    body: "این آدرس وجود ندارد یا جابه‌جا شده است.",
    home: "بازگشت به خانه",
  },
  error: {
    title: "مشکلی پیش آمد",
    body: "لطفاً دوباره تلاش کنید.",
    retry: "تلاش دوباره",
  },
  errors: {
    invalidPhone: "شماره موبایل معتبر وارد کنید.",
    invalidOtp: "کد تأیید نامعتبر است.",
    otpExpired: "کد تأیید منقضی شده است.",
    otpRequired: "کد ۶ رقمی را وارد کنید.",
    requestNewOtp: "ابتدا یک کد جدید درخواست کنید.",
    sendFailed: "ارسال کد ممکن نشد. دوباره تلاش کنید.",
    verifyFailed: "تأیید کد ممکن نشد. دوباره تلاش کنید.",
    userNotFound: "حسابی با این شماره یافت نشد.",
    generic: "مشکلی پیش آمد. دوباره تلاش کنید.",
    missingPublishableKey:
      "کلید انتشار فروشگاه تنظیم نشده است. آن را از پنل ادمین مدوسا در تنظیمات کلیدهای انتشار کپی کنید.",
  },
} as const;

const errorMatchers: Array<{ test: (message: string) => boolean; text: string }> =
  [
    {
      test: (message) => message.includes("valid mobile"),
      text: messages.errors.invalidPhone,
    },
    {
      test: (message) => message.includes("6-digit"),
      text: messages.errors.otpRequired,
    },
    {
      test: (message) => message.includes("expired") || message.includes("منقضی"),
      text: messages.errors.otpExpired,
    },
    {
      test: (message) =>
        message.includes("invalid otp") || message.includes("نامعتبر"),
      text: messages.errors.invalidOtp,
    },
    {
      test: (message) =>
        message.includes("request a new otp") || message.includes("کد جدید"),
      text: messages.errors.requestNewOtp,
    },
    {
      test: (message) => message.includes("could not send"),
      text: messages.errors.sendFailed,
    },
    {
      test: (message) => message.includes("could not verify"),
      text: messages.errors.verifyFailed,
    },
    {
      test: (message) =>
        message.includes("does not exist") || message.includes("یافت نشد"),
      text: messages.errors.userNotFound,
    },
    {
      test: (message) => message.includes("publishable"),
      text: messages.errors.missingPublishableKey,
    },
  ];

export function translateError(message: string): string {
  const lower = message.toLowerCase();
  const match = errorMatchers.find((item) => item.test(lower));

  if (match) {
    return match.text;
  }

  if (/[\u0600-\u06FF]/.test(message)) {
    return message;
  }

  return messages.errors.generic;
}
