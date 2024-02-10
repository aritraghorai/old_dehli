import Razorpay from 'razorpay';
import crypto from 'crypto';
import _l from 'lodash';
import env from '@/utils/env.js';

const RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID;
const RAZOR_PAY_KEY_SECRET = env.RAZOR_PAY_KEY_SECRET;

console.log(RAZORPAY_KEY_ID, RAZOR_PAY_KEY_SECRET);

export const instance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZOR_PAY_KEY_SECRET,
});

export const createOrderRazerPay = async (
  amount: number,
  receipt: string,
  notes: { [key: string]: string | number } = {},
  partial_payment = false,
  currency = 'INR',
) => {
  const res = await instance.orders.create({
    amount: _l.parseInt(String(amount)),
    currency,
    receipt,
    partial_payment: partial_payment,
    notes: notes,
  });
  return res;
};
export const fetchDetailByOrderId = async (orderId: string) => {
  const res = await instance.orders.fetch(orderId);
  return res;
};

export const createPlan = async ({
  name,
  description,
  amount,
}: {
  name: string;
  description: string;
  amount: number;
}) => {
  const newPlan = await instance.plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: name,
      description: description,
      amount: _l.parseInt(toString(amount * 100)),
      currency: 'INR',
    },
    notes: {
      notes_key_1: 'This is for mounthluy subcription',
    },
  });
  return newPlan.id;
};
export const createNewSubcription = async ({
  planId,
  phoneNo,
}: {
  planId: string;
  phoneNo: string;
}) => {
  const subcription = await instance.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 12,
    start_at: Math.floor(Date.now() / 1000) + 60 * 60,
    //  notify_info: {
    //   notify_phone:phoneNo ,
    //   notify_email: "aritra1521@gmail.com"
    // }
  });
  return subcription.id;
};

export const validateSignature = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
): boolean => {
  const hmac = crypto.createHmac('sha256', RAZOR_PAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  let generateSignaturee = hmac.digest('hex');
  return razorpay_signature === generateSignaturee;
};

export const validateSignatureSubcription = (
  razorpay_subcription_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
): boolean => {
  const hmac = crypto.createHmac('sha256', RAZOR_PAY_KEY_SECRET);
  hmac.update(razorpay_payment_id + '|' + razorpay_subcription_id);
  let generateSignaturee = hmac.digest('hex');
  return razorpay_signature === generateSignaturee;
};
