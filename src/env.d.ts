/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_POCKETBASE_URL?: string;
  readonly PUBLIC_POSTHOG_KEY?: string;
  readonly PUBLIC_POSTHOG_HOST?: string;
  readonly PUBLIC_PAYSTACK_FULL_PAYMENT_URL?: string;
  readonly PUBLIC_PAYSTACK_INSTALLMENT_PAYMENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
