'use client';
import { useOrderStore } from '@/core/store/order.store';
import OrderDetailPage from '@/features/order-detail-page/order.detail.page';

const OrderDetail = () => {
  const id = useOrderStore((state) => state.id);
  return (
    <OrderDetailPage
      params={{
        id: String(id),
      }}
    />
  );
};

export default OrderDetail;
