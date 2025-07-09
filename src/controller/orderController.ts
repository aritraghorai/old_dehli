import { Address, Pincode, Zone } from '@/entities/address.entity.js';
import {
  BillingAddress,
  ORDER_STATUS_ENUM,
  Order,
  OrderAddress,
  OrderItem,
  PAYMENT_GATEWAY,
  PAYMENT_STATUS,
  RazorpayPayment,
} from '@/entities/order.entity.js';
import { ProductItem } from '@/entities/product.entity.js';
import { CartItem, User, UserCart } from '@/entities/user.entiry.js';
import {
  createOrderRazerPay,
  validateSignature,
} from '@/services/payment/razorpay.service.js';
import whatshapp from '@/services/whatshapp/index.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { QueryPageType } from '@/validator/common.validator.js';
import {
  OrderBody,
  UpdateOrderBody,
  payemntSuccessBodyType,
} from '@/validator/order.validator.js';
import { NextFunction, Request, Response } from 'express';
import orderPdfService from '@/services/pdf/order.pdf.service.js';
import plunkService from '@/services/email/plunk.service.js';
import { render } from '@react-email/render';
import Order_Email from 'emails/order/index.js';
import { it } from 'node:test';
import { Like } from 'typeorm';

declare module 'express' {
  interface Request {
    deliveryCharge?: number;
    isAllIndia?: boolean;
  }
}

const sendOrderStatusEmail = async (
  email: string[],
  order: Order,
  status: string,
) => {
  email.forEach(async e => {
    try {
      await plunkService.sendEmail(
        e,
        `Order ${status} Successfully`,
        render(Order_Email({ order, status })),
      );
    } catch (e) {
      console.log(e);
    }
  });
};

const getCheckOutDetails = catchAsync(
  async (req: Request<any, any, OrderBody>, res: Response) => {
    const deliveryCharge = req.deliveryCharge;
    return res.status(200).json({
      status: true,
      data: {
        deliveryCharge,
      },
      isAllIndia: req.isAllIndia,
    });
  },
);

const checkDeliveryPossibleOrNot = catchAsync(
  async (
    req: Request<any, any, OrderBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user as User;
    await myDataSource.transaction(async trx => {
      const addressRepo = trx.getRepository(Address);
      const { addressId } = req.body;
      const address = await addressRepo.findOne({
        where: { id: addressId },
      });
      if (!address) {
        throw new AppError('Address not found', 404);
      }

      //user has item in the card
      const userCardRepo = trx.getRepository(UserCart);

      const userCart = await userCardRepo.findOne({
        where: {
          user: { id: user.id },
        },
        relations: {
          cardItems: {
            productItem: {
              product: {
                allowZones: {
                  pincodes: true,
                },
              },
            },
          },
        },
      });

      const totalAmount = userCart.cardItems.reduce((acc, item) => {
        return acc + item.count * item.productItem.price;
      }, 0);

      const deliverPossibleItem = await userCardRepo.findOne({
        where: {
          user: { id: user.id },
          cardItems: {
            productItem: {
              product: {
                allowZones: [
                  {
                    pincodes: {
                      id: address.pincode.id,
                    },
                  },
                  {
                    name: Like('%All India%'),
                  },
                ],
              },
            },
          },
        },
        relations: {
          cardItems: {
            productItem: {
              product: {
                allowZones: {
                  pincodes: true,
                },
              },
            },
          },
        },
      });

      if (!userCart || !userCart.cardItems.length) {
        throw new AppError('No item in the cart', 400);
      }

      if (!deliverPossibleItem?.cardItems) {
        return res.status(400).json({
          status: false,
          message: 'No item is deliverable',
          data: userCart.cardItems,
        });
      }

      const notDeliverableItems = userCart.cardItems.filter(
        item =>
          !deliverPossibleItem?.cardItems.find(
            i => i.productItem.id === item.productItem.id,
          ),
      );
      // if some thing is not deliverable
      if (notDeliverableItems.length) {
        return res.status(400).json({
          status: false,
          message: 'Some items are not deliverable',
          data: notDeliverableItems,
        });
      }

      const zoneRepo = trx.getRepository(Zone);

      let deliveryCharge = 0;
      let isAllIndia = false;

      let zone = await zoneRepo.findOne({
        where: {
          pincodes: {
            id: address.pincode.id,
          },
        },
      });
      if (zone) {
        deliveryCharge = zone.deliveryCharges;
        if (zone.minOrderValue) {
          if (zone.minOrderValue > totalAmount) {
            return res.status(400).json({
              status: false,
              message: `User need to order minimum of ${zone.minOrderValue} to deliver to the pincode ${address.pincode.pincode}`,
            });
          }
        }
      } else {
        zone = await zoneRepo.findOne({
          where: {
            name: 'All India',
          },
        });
        isAllIndia = true;
        //calculate delivery charge by weight
        for (const item of userCart.cardItems) {
          deliveryCharge +=
            item.productItem.weight * zone.deliveryCharges ?? 10 * item.count;
        }
      }

      req.deliveryCharge = deliveryCharge;
      req.isAllIndia = isAllIndia;

      next();
    });
  },
);

const createOrder = catchAsync(
  async (req: Request<any, any, OrderBody>, res: Response) => {
    const user = req.user as User;
    await myDataSource.transaction(async trx => {
      const addressRepo = trx.getRepository(Address);
      const {
        addressId,
        billingAddress,
        deliveryDate,
        paymentMethod,
        endingDeliveryTime,
        startingDeliveryTime,
      } = req.body;
      const address = await addressRepo.findOne({
        where: { id: addressId },
      });
      if (!address) {
        throw new AppError('Address not found', 404);
      }

      //user has item in the card
      const userCardRepo = trx.getRepository(UserCart);

      const userCart = await userCardRepo.findOne({
        where: {
          user: { id: user.id },
        },
        relations: {
          cardItems: {
            productItem: {
              product: {
                allowZones: {
                  pincodes: true,
                },
              },
            },
          },
        },
      });

      if (!userCart || !userCart.cardItems.length) {
        throw new AppError('No item in the cart', 400);
      }

      // create billing address
      const billingAddressRepo = trx.getRepository(BillingAddress);

      const pincodeRepo = trx.getRepository(Pincode);

      const pincode = await pincodeRepo.findOne({
        where: { id: billingAddress.pincode },
      });

      if (!pincode) {
        throw new AppError('Billing address Pincode not found', 404);
      }

      const newBillingAddress = billingAddressRepo.create({
        name: billingAddress.name,
        pincode: pincode,
        locality: billingAddress.locality,
        address: billingAddress.address,
        landmark: billingAddress.landmark,
        city: billingAddress.city,
        state: billingAddress.state,
      });

      // save billing address
      await billingAddressRepo.save(newBillingAddress);

      // check stock
      const orderAddressRepo = trx.getRepository(OrderAddress);
      // create time slot

      startingDeliveryTime.setMinutes(0);
      startingDeliveryTime.setSeconds(0);
      endingDeliveryTime.setMinutes(0);
      endingDeliveryTime.setSeconds(0);

      // create order address
      const newOrderAddress = orderAddressRepo.create({
        name: address.name,
        mobile: address.mobile,
        alternatePhone: address.alternatePhone,
        pincode: address.pincode,
        locality: address.locality,
        address: address.address,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        id: undefined,
        deliveryDate: deliveryDate,
        startTime: startingDeliveryTime,
        endTime: endingDeliveryTime,
      });
      await orderAddressRepo.save(newOrderAddress);

      //calculate total amount
      const totalAmount =
        userCart.cardItems.reduce((acc, item) => {
          return acc + item.productItem.price * item.count;
        }, 0) + req.deliveryCharge;
      // create order items
      const orderRepo = trx.getRepository(Order);
      const newOrder = orderRepo.create({
        user: user,
        paymentGateway:
          req.body.paymentMethod === PAYMENT_GATEWAY.CASH_ON_DELIVERY
            ? PAYMENT_GATEWAY.CASH_ON_DELIVERY
            : PAYMENT_GATEWAY.RAZORPAY,
        status: ORDER_STATUS_ENUM.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        orderAddress: newOrderAddress,
        grandTotal: totalAmount,
        deliveryCharge: req.deliveryCharge,
        billingAddress: newBillingAddress,
      });
      await orderRepo.save(newOrder);
      // create order items
      const orderItemRepo = trx.getRepository(OrderItem);
      const newOrderItems = orderItemRepo.create(
        userCart.cardItems.map(item => ({
          order: newOrder,
          productItem: item.productItem,
          price: item.productItem.price,
          quantity: item.count,
        })),
      );
      await orderItemRepo.save(newOrderItems);
      // update productitem stock
      const productItemRepo = trx.getRepository(ProductItem);
      for (const item of userCart.cardItems) {
        await productItemRepo.update(
          { id: item.productItem.id },
          { stock: item.productItem.stock - item.count },
        );
      }
      // delete user cart
      const userCardItemRepo = trx.getRepository(CartItem);
      await userCardItemRepo.delete({ cart: userCart });
      if (req.body.paymentMethod === PAYMENT_GATEWAY.CASH_ON_DELIVERY) {
        newOrder.orderItems = newOrderItems;
        // send sms
        // send email
        // send notification
        await sendOrderStatusEmail([user.email], newOrder, 'Placed');
        return res.status(201).json({
          status: true,
          message: 'Order created successfully',
          data: newOrder,
          isAllIndia: req.isAllIndia,
        });
      }

      const razorpayRepo = trx.getRepository(RazorpayPayment);
      // razorpay payment
      // create razorpay order
      // create razorpay payment
      console.log(totalAmount + 'totalAmount');
      const razorpayOrder = await createOrderRazerPay(totalAmount, user.name, {
        orderId: newOrder.id,
        userId: user.id,
      });
      //update order with razorpay order id
      newOrder.orderId = razorpayOrder.id;

      const razorpayPayment = razorpayRepo.create({
        orderId: razorpayOrder.id,
      });
      await razorpayRepo.save(razorpayPayment);

      newOrder.razorpayPayment = razorpayPayment;

      await orderRepo.save(newOrder);
      return res.status(201).json({
        status: true,
        message: 'Order created successfully',
        data: {
          order: newOrder,
          razorpayOrder,
        },
        isAllIndia: req.isAllIndia,
      });
    });
  },
);
const getOrders = catchAsync(
  async (req: Request<any, any, any, QueryPageType>, res: Response) => {
    const user = req.user as User;
    const { page, limit } = req.query;
    const orderRepo = myDataSource.getRepository(Order);
    const [orders, count] = await orderRepo.findAndCount({
      where: { user: { id: user.id } },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        orderAddress: {
          pincode: true,
        },
        orderItems: {
          productItem: {
            images: true,
          },
        },
        billingAddress: {
          pincode: true,
        },
        razorpayPayment: true,
      },
    });
    return res.status(200).json({
      status: true,
      data: orders,
      totalPage: Math.ceil(count / limit),
      page,
      limit,
    });
  },
);

const getAllOrdersAdmin = catchAsync(async (req: Request, res: Response) => {
  const orderRepo = myDataSource.getRepository(Order);
  const orders = await orderRepo.find({
    relations: {
      orderAddress: {
        pincode: true,
      },
      orderItems: {
        productItem: true,
      },
      user: {
        profile: true,
      },
      razorpayPayment: true,
      billingAddress: {
        pincode: true,
      },
    },
    order: {
      createdAt: 'DESC',
    },
  });
  return res.status(200).json({
    status: true,
    data: orders,
  });
});

const updateOrder = catchAsync(
  async (req: Request<{ id: string }, any, UpdateOrderBody>, res: Response) => {
    const orderRepo = myDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { id: req.params.id },
      relations: {
        user: true,
        orderItems: {
          productItem: true,
        },
        orderAddress: {
          pincode: true,
        },
        billingAddress: {
          pincode: true,
        },
      },
    });
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await orderRepo.save(order);
    console.log(order.user.email);
    if (order?.user?.email)
      await sendOrderStatusEmail([order.user.email], order, req.body.status);
    return res.status(200).json({
      status: true,
      message: 'Order updated successfully',
      data: order,
    });
  },
);

const makeOrderPaymentSuccess = catchAsync(
  async (
    req: Request<{ id: string }, any, any, payemntSuccessBodyType>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { razorpay_order_id, razorpay_signature, razorpay_payment_id } =
      req.body;

    const orderRepo = myDataSource.getRepository(Order);

    const order = await orderRepo.findOne({
      where: { id },
      relations: {
        razorpayPayment: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (
      !validateSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      )
    ) {
      throw new AppError('Invalid signature', 400);
    }

    if (order.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      throw new AppError('Payment already done', 400);
    }

    const razorpayRepo = myDataSource.getRepository(RazorpayPayment);

    const razorpayPayment = await razorpayRepo.findOne({
      where: { id: order.razorpayPayment.id },
    });

    if (!razorpayPayment) {
      throw new AppError('Razorpay payment not found', 404);
    }

    razorpayPayment.paymentId = razorpay_payment_id;
    await razorpayRepo.save(razorpayPayment);

    order.paymentStatus = PAYMENT_STATUS.SUCCESS;

    await orderRepo.save(order);

    return res.status(200).json({
      status: true,
      message: 'Payment success',
      data: order,
    });
  },
);

const getOrderInVoice = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const orderRepo = myDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { id },
      relations: {
        orderItems: {
          productItem: {
            productConfig: {
              optionValue: true,
              option: true,
            },
          },
        },
        orderAddress: {
          pincode: true,
        },
        billingAddress: {
          pincode: true,
        },
        user: true,
      },
    });
    const pdf = orderPdfService.createInvoice(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice.pdf`);
    pdf.pipe(res);
    pdf.end();
  },
);

export default {
  createOrder,
  getOrders,
  getAllOrdersAdmin,
  updateOrder,
  getCheckOutDetails,
  checkDeliveryPossibleOrNot,
  makeOrderPaymentSuccess,
  getOrderInVoice,
};
