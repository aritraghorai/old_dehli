import { Address } from '@/entities/address.entity.js';
import {
  ORDER_STATUS_ENUM,
  Order,
  OrderAddress,
  OrderItem,
  PAYMENT_GATEWAY,
  PAYMENT_STATUS,
} from '@/entities/order.entity.js';
import { ProductItem } from '@/entities/product.entity.js';
import { CartItem, User, UserCart } from '@/entities/user.entiry.js';
import { createOrderRazerPay } from '@/services/payment/razorpay.service.js';
import whatshapp from '@/services/whatshapp/index.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { QueryPageType } from '@/validator/common.validator.js';
import { OrderBody, UpdateOrderBody } from '@/validator/order.validator.js';
import { Request, Response } from 'express';

const createOrder = catchAsync(
  async (req: Request<any, any, OrderBody>, res: Response) => {
    const user = req.user as User;
    await myDataSource.transaction(async trx => {
      const addressRepo = trx.getRepository(Address);
      const address = await addressRepo.findOne({
        where: { id: req.body.addressId },
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
          cardItems: true,
        },
      });
      if (!userCart || !userCart.cardItems.length) {
        throw new AppError('No item in the cart', 400);
      }
      const orderAddressRepor = trx.getRepository(OrderAddress);
      // create order address
      const newOrderAddress = orderAddressRepor.create({
        ...address,
        id: undefined,
      });
      await orderAddressRepor.save(newOrderAddress);

      //calculate total amount
      const totalAmount = userCart.cardItems.reduce((acc, item) => {
        return acc + item.productItem.price * item.count;
      }, 0);
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
        // send sms
        // send email
        // send notification
        await whatshapp.sendMessage(
          `${user.name}, your order has been placed successfully.
 Your order id is ${newOrder.id} and total amount is ${newOrder.grandTotal}.
 Our delivery executive will contact you soon. Thank you for shopping with us.`,
          user.phoneNumber,
        );
        return res.status(201).json({
          status: true,
          message: 'Order created successfully',
          data: newOrder,
        });
      }
      // razorpay payment
      // create razorpay order
      // create razorpay payment
      const razorpayOrder = await createOrderRazerPay(totalAmount, user.name, {
        orderId: newOrder.id,
        userId: user.id,
      });
      //update order with razorpay order id
      newOrder.orderId = razorpayOrder.id;
      await orderRepo.save(newOrder);
      return res.status(201).json({
        status: true,
        message: 'Order created successfully',
        data: {
          order: newOrder,
          razorpayOrder,
        },
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
        orderAddress: true,
        orderItems: {
          productItem: {
            images: true,
          },
        },
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
      orderAddress: true,
      orderItems: {
        productItem: true,
      },
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
    const order = await orderRepo.findOne({ where: { id: req.params.id } });
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await orderRepo.save(order);
    return res.status(200).json({
      status: true,
      message: 'Order updated successfully',
      data: order,
    });
  },
);

export default { createOrder, getOrders, getAllOrdersAdmin, updateOrder };
