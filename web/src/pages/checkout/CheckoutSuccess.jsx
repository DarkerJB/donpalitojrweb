import { Link, useLocation } from 'react-router-dom';
import { IoCheckmarkCircle, IoReceiptOutline, IoStorefront } from 'react-icons/io5';
import Button from '../../components/common/Button';

const CheckoutSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <IoCheckmarkCircle className="mx-auto text-green-500 mb-4" size={80} />

          <h1 className="text-3xl font-bold text-brand-secondary mb-2">
            ¡Pedido realizado!
          </h1>
          <p className="text-gray-500 mb-2">
            Tu pedido ha sido creado exitosamente.
          </p>

          {orderId && (
            <p className="text-lg font-semibold text-brand-primary mb-6">
              Número de pedido: {orderId}
            </p>
          )}

          <p className="text-sm text-gray-400 mb-8">
            Recibirás actualizaciones sobre el estado de tu pedido.
          </p>

          <div className="space-y-3">
            {orderId && (
              <Link to={`/perfil/pedidos/${orderId}`}>
                <Button variant="primary" fullWidth icon={<IoReceiptOutline size={18} />}>
                  Ver mi pedido
                </Button>
              </Link>
            )}
            <Link to="/catalogo">
              <Button variant="ghost" fullWidth icon={<IoStorefront size={18} />}>
                Seguir comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
