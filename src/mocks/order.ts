import { OrderStatus } from '../utils/common-utils';

export const mockOrder = {
  id: 1,
  userId: 1,
  status: OrderStatus.ACTIVE
};

export const mockOrderProduct = {
  id: 1,
  quantity: 10,
  orderId: '1',
  productId: '1'
};

export const mockOrderProducts = [
  {
    id: 1,
    quantity: 10,
    orderId: '1',
    productId: '1'
  },
  {
    id: 1,
    quantity: 200,
    orderId: '1',
    productId: '2'
  },
  {
    id: 1,
    quantity: 5,
    orderId: '1',
    productId: '3'
  },
  {
    id: 1,
    quantity: 50,
    orderId: '1',
    productId: '4'
  },
  {
    id: 1,
    quantity: 1,
    orderId: '1',
    productId: '5'
  },
  {
    id: 1,
    quantity: 100,
    orderId: '1',
    productId: '6'
  }
];

export const mockUpdatedOrderStatus = OrderStatus.COMPLETE;
