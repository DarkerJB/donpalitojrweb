import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addressSchema } from '../../utils/validationSchemas';
import Input from '../common/Input';
import Button from '../common/Button';

const noNumbers = (e) => {
  if (/\d/.test(e.key)) e.preventDefault();
};

const onlyNumbers = (e) => {
  if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
};

const AddressForm = ({ address, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: address || {
      label: 'Casa',
      fullName: '',
      streetAddress: '',
      city: '',
      phoneNumber: '',
      isDefault: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Tipo de dirección <span className="text-error">*</span></span>
        </label>
        <select
          className={`select select-bordered bg-brand-secondary/10 w-full ${errors.label ? 'select-error' : ''}`}
          {...register('label')}
        >
          <option value="Casa">Casa</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.label && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.label.message}</span>
          </label>
        )}
      </div>

      <Input
        label="Nombre completo"
        placeholder="Nombre del destinatario"
        helperText="Solo letras y espacios"
        error={errors.fullName?.message}
        required
        onKeyDown={noNumbers}
        {...register('fullName')}
      />

      <Input
        label="Dirección"
        placeholder="Calle, número, apto, barrio"
        error={errors.streetAddress?.message}
        required
        {...register('streetAddress')}
      />

      <Input
        label="Ciudad"
        placeholder="Ciudad"
        helperText="Solo letras y espacios"
        error={errors.city?.message}
        required
        onKeyDown={noNumbers}
        {...register('city')}
      />

      <Input
        label="Teléfono"
        type="tel"
        placeholder="3001234567"
        helperText="10 dígitos, empieza por 3. Ej: 3001234567"
        maxLength={10}
        onKeyDown={onlyNumbers}
        error={errors.phoneNumber?.message}
        required
        {...register('phoneNumber')}
      />

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            {...register('isDefault')}
          />
          <span className="label-text">Establecer como dirección predeterminada</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {address ? 'Actualizar' : 'Guardar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
