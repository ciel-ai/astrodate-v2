import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';
import {
  REVENUECAT_API_KEY_ANDROID,
  REVENUECAT_API_KEY_IOS,
  REVENUECAT_PRODUCT_IDS,
  type RevenueCatPlanSlug,
} from './iap-products';
import { getMembershipOrFree } from './subscription';
import { supabase } from './supabase';

export type PaymentStatus = 'idle' | 'pending' | 'active' | 'failed';

export interface StartPaymentOptions {
  userId?: string;
  planSlug?: RevenueCatPlanSlug;
  planName: string;
}

export interface UseSubscriptionPaymentReturn {
  paymentStatus: PaymentStatus;
  paymentError: string | null;
  startPayment: (options: StartPaymentOptions) => Promise<void>;
  resetPayment: () => void;
  restorePurchases: () => Promise<boolean>;
}

let _rcConfigured = false;
let _rcActive = false;

export async function ensureRevenueCatConfigured() {
  if (_rcConfigured) return;

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

  if (!apiKey) {
    console.warn('[RevenueCat] API key missing — in-app purchases disabled.');
    _rcConfigured = true;
    _rcActive = false;
    return;
  }

  Purchases.configure({ apiKey });
  _rcConfigured = true;
  _rcActive = true;
}

function getRevenueCatPlanSlug(options: StartPaymentOptions): RevenueCatPlanSlug | null {
  if (options.planSlug) return options.planSlug;
  if (options.planName.toLowerCase().includes('astrox')) return 'astro_x';
  if (options.planName.toLowerCase().includes('astro+')) return 'astro_plus';
  return null;
}

function isPurchaseCancelled(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function useSubscriptionPayment(): UseSubscriptionPaymentReturn {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const startPayment = useCallback(async (options: StartPaymentOptions) => {
    if (!isMountedRef.current) return;
    setPaymentError(null);
    setPaymentStatus('pending');

    try {
      const planSlug = getRevenueCatPlanSlug(options);
      if (!planSlug) {
        throw new Error('This subscription plan is not available for purchase yet.');
      }

      await ensureRevenueCatConfigured();

      if (!_rcActive) {
        throw new Error(
          'In-app purchases are not available in this build. ' +
          'Please install from TestFlight or the Play Store to subscribe.'
        );
      }

      if (options.userId) {
        try { await Purchases.logIn(options.userId); } catch { /* non-fatal */ }
      }

      const productId = REVENUECAT_PRODUCT_IDS[planSlug];
      const offerings = await Purchases.getOfferings();
      const allPackages = Object.values(offerings.all).flatMap((o) => o.availablePackages);

      if (allPackages.length === 0) {
        throw new Error(
          'In-app purchases are not available yet. ' +
          'Please try again after the app is published to the store.'
        );
      }

      const selectedPackage = allPackages.find(
        (pkg) => pkg.product.identifier === productId
      );

      if (!selectedPackage) {
        throw new Error('This subscription plan is not available right now. Please try again later.');
      }

      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      if (!customerInfo.activeSubscriptions.includes(productId)) {
        throw new Error('Purchase completed, but no active subscription was returned.');
      }

      const entitlementRpc = Platform.OS === 'ios' ? 'sync_ios_subscription' : 'sync_android_subscription';
      const { error: syncError } = await supabase.rpc(entitlementRpc as any, {
        entitlement_id: planSlug,
      });
      if (syncError) {
        console.warn('[useSubscriptionPayment] sync error:', syncError.message);
      }

      if (isMountedRef.current) {
        setPaymentStatus('active');
        setPaymentError(null);
      }
    } catch (error) {
      if (isPurchaseCancelled(error)) {
        if (isMountedRef.current) { setPaymentStatus('idle'); setPaymentError(null); }
        return;
      }
      if (isMountedRef.current) {
        setPaymentStatus('failed');
        setPaymentError(getErrorMessage(error));
      }
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    await ensureRevenueCatConfigured();
    if (!_rcActive) return false;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try { await Purchases.logIn(user.id); } catch { /* non-fatal */ }
    }

    const customerInfo = await Purchases.restorePurchases();
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);

    if (activeEntitlements.length > 0) {
      const membership = await getMembershipOrFree();
      return membership.is_active === true;
    }

    return false;
  }, []);

  const resetPayment = useCallback(() => {
    setPaymentStatus('idle');
    setPaymentError(null);
  }, []);

  return { paymentStatus, paymentError, startPayment, resetPayment, restorePurchases };
}
