import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { addressServiceMock } from '../../services/addressService';
import { orderServiceMock } from '../../services/orderService';
import { IVA_RATE } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import PaymentMethodSelector from '../../components/checkout/PaymentMethodSelector';
import AddressForm from '../../components/profile/AddressForm';
import Button from '../../components/common/Button';

const SHIPPING_COST = 10000;

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [includeShipping, setIncludeShipping] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const addresses = addressServiceMock.getUserAddresses(user?.id || 'u1');

  const iva = Math.round(subtotal * IVA_RATE / (1 + IVA_RATE));
  const baseWithoutIva = subtotal - iva;
  const shipping = includeShipping ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  const handleNewAddress = (data) => {
    const newAddr = addressServiceMock.createAddress(user?.id || 'u1', data);
    setSelectedAddressId(newAddr.id);
    setShowNewAddress(false);
    toast.success('Dirección agregada');
  };

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ||
        addressServiceMock.getUserAddresses(user?.id || 'u1').find((a) => a.id === selectedAddressId);

      const order = orderServiceMock.createOrder({
        userId: user?.id || 'u1',
        items: items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          unitPrice: i.product.discount
            ? Math.round(i.product.price * (1 - i.product.discount / 100))
            : i.product.price,
        })),
        subtotal,
        iva,
        shipping,
        total,
        paymentMethod,
        address: selectedAddress,
      });

      clearCart();
      navigate('/checkout/exito', { state: { orderId: order.id } });
    } catch {
      toast.error('Error al crear el pedido');
    } finally {
      setProcessing(false);
    }
  };

  const canProceedStep1 = items.length > 0;
  const canProceedStep2 = selectedAddressId;
  const canProceedStep3 = paymentMethod;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-brand-secondary mb-2">Checkout</h1>
      <CheckoutStepper currentStep={step} />

      {/* Step 0: Resumen */}
      {step === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
          <div className="space-y-3 mb-6">
            {items.map((item) => {
              const price = item.product.discount
                ? Math.round(item.product.price * (1 - item.product.discount / 100))
                : item.product.price;
              return (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.images?.[0] || item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} x {formatCurrency(price)}</p>
                  </div>
                  <span className="font-semibold text-sm">{formatCurrency(price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="form-control mb-4">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={includeShipping}
                onChange={(e) => setIncludeShipping(e.target.checked)}
              />
              <span className="label-text">Incluir envío ({formatCurrency(SHIPPING_COST)})</span>
            </label>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Base (sin IVA)</span>
              <span>{formatCurrency(baseWithoutIva)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>IVA (19%)</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            {includeShipping && (
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span className="text-brand-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              icon={<IoArrowForward size={18} />}
              iconPosition="right"
              onClick={() => setStep(1)}
              disabled={!canProceedStep1}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Dirección */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Dirección de envío</h2>

          {addresses.length > 0 && !showNewAddress && (
            <div className="space-y-3 mb-4">
              {addressServiceMock.getUserAddresses(user?.id || 'u1').map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    selectedAddressId === addr.id
                      ? 'border-brand-primary bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="radio radio-primary mt-1"
                  />
                  <div>
                    <p className="font-medium">{addr.label} - {addr.fullName}</p>
                    <p className="text-sm text-gray-500">{addr.streetAddress}, {addr.city}</p>
                    <p className="text-sm text-gray-500">Tel: {addr.phoneNumber}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {showNewAddress ? (
            <AddressForm
              onSubmit={handleNewAddress}
              onCancel={() => setShowNewAddress(false)}
            />
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowNewAddress(true)}>
              + Agregar nueva dirección
            </Button>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" icon={<IoArrowBack size={18} />} onClick={() => setStep(0)}>
              Atrás
            </Button>
            <Button
              variant="primary"
              icon={<IoArrowForward size={18} />}
              iconPosition="right"
              onClick={() => setStep(2)}
              disabled={!canProceedStep2}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Pago */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Método de pago</h2>
          <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />

          <div className="border-t mt-6 pt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total a pagar</span>
              <span className="text-brand-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" icon={<IoArrowBack size={18} />} onClick={() => setStep(1)}>
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              loading={processing}
              disabled={!canProceedStep3}
            >
              Confirmar pedido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
