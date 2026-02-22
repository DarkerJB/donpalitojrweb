import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';
import { IVA_RATE, CONTACT_INFO } from '../utils/constants';

const SHIPPING_COST = 10000;
const promotions = [
  { code: 'BIENVENIDO10', discountPercent: 10, active: true },
  { code: 'PALITO15', discountPercent: 15, active: true },
];

import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyCart from '../components/cart/EmptyCart';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Cart = () => {
  const { items, subtotal, totalItems } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [includeShipping, setIncludeShipping] = useState(false);

  // IVA ya está incluido en el precio del producto
  // Desglose: base = precio * (1 - IVA_RATE), iva = precio * IVA_RATE
  const couponDiscount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.discountPercent / 100))
    : 0;
  const discountedSub = subtotal - couponDiscount;
  const iva = Math.round(discountedSub * IVA_RATE);
  const baseWithoutIva = discountedSub - iva;
  const shipping = includeShipping ? SHIPPING_COST : 0;
  const total = discountedSub + shipping;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const promo = promotions.find(
      (p) => p.code === code && p.active === true
    );

    if (promo) {
      setAppliedCoupon(promo);
      setCouponError('');
      toast.success(`Cupón "${promo.code}" aplicado: ${promo.discountPercent}% de descuento`);
    } else {
      setCouponError('Cupón inválido o expirado');
      toast.error('Cupón inválido o expirado');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    toast.info('Cupón removido');
  };

  const buildWhatsAppMessage = () => {
    let msg = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';
    items.forEach((item) => {
      const price = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      msg += `- ${item.product.name} x${item.quantity} = ${formatCurrency(price * item.quantity)}\n`;
    });
    msg += `\nSubtotal (sin IVA): ${formatCurrency(baseWithoutIva)}`;
    if (appliedCoupon) {
      msg += `\nCupón (${appliedCoupon.code}): -${formatCurrency(couponDiscount)}`;
    }
    msg += `\nIVA (19%): ${formatCurrency(iva)}`;
    if (includeShipping) {
      msg += `\nEnvío: ${formatCurrency(shipping)}`;
    }
    msg += `\n*Total: ${formatCurrency(total)}*`;
    return encodeURIComponent(msg);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary mb-6 transition-colors"
      >
        <IoArrowBack size={16} />
        Volver al catálogo
      </Link>

      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Carrito</h1>
        <Badge variant="primary" size="sm">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          {/* Items List */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            {items.map((item) => (
              <CartItem key={item.product._id || item.product.id} item={item} />
            ))}
          </div>

          {/* Coupon Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4">
            <h3 className="font-medium text-gray-700 mb-3">Cupón de descuento</h3>

            {appliedCoupon ? (
              <div className="flex items-center gap-2">
                <Badge variant="success" size="md">
                  {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                </Badge>
                <button
                  onClick={handleRemoveCoupon}
                  className="btn btn-xs btn-ghost btn-circle text-gray-400 hover:text-red-500"
                  aria-label="Remover cupón"
                >
                  <IoClose size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresa tu cupón"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError('');
                  }}
                  error={couponError}
                  size="sm"
                  containerClassName="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <Button
                  variant="primary"
                  size="sm"
                  outline
                  onClick={handleApplyCoupon}
                  className="shrink-0"
                >
                  Aplicar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            baseWithoutIva={baseWithoutIva}
            couponDiscount={couponDiscount}
            appliedCoupon={appliedCoupon}
            includeShipping={includeShipping}
            onToggleShipping={() => setIncludeShipping(!includeShipping)}
            shipping={shipping}
            iva={iva}
            total={total}
            onCheckout={() => setShowCheckoutModal(true)}
          />
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Confirmar Pedido"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            El checkout completo estará disponible próximamente. Por ahora,
            puedes realizar tu pedido a través de WhatsApp.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal (sin IVA)</span>
              <span>{formatCurrency(baseWithoutIva)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>IVA (19%)</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            {includeShipping && (
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
            )}
            <div className="divider my-1"></div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`https://wa.me/${CONTACT_INFO.phone}?text=${buildWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-block"
            >
              Pedir por WhatsApp
            </a>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowCheckoutModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
