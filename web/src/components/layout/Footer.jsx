import { Link } from 'react-router-dom';
import { 
  IoLogoFacebook, 
  IoLogoInstagram, 
  IoLogoWhatsapp,
  IoMail,
  IoCall,
  IoLocation 
} from 'react-icons/io5';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold">DP</span>
              </div>
              <h3 className="ml-2 text-white font-bold text-lg">Don Palito Jr</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Productos tradicionales de la mejor calidad.<br/> 
              Sabor auténtico desde Sabaneta, Antioquia.
            </p>
            <div className="flex gap-3 mt-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <IoLogoFacebook size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <IoLogoInstagram size={24} />
              </a>
              <a 
                href="https://wa.me/573148702078" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <IoLogoWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-sm hover:text-primary transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-sm hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos-condiciones" className="text-sm hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidad" className="text-sm hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/politica-cookies" className="text-sm hover:text-primary transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <IoLocation className="mt-1 flex-shrink-0 text-primary" size={20} />
                <span className="text-sm">
                  Cra 47 # 76D Sur - 37<br />
                  Sabaneta, Antioquia
                </span>
              </li>
              <li className="flex items-center gap-2">
                <IoCall className="flex-shrink-0 text-primary" size={20} />
                <a href="tel:+573148702078" className="text-sm hover:text-primary transition-colors">
                  314 870 2078
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IoMail className="flex-shrink-0 text-primary" size={20} />
                <a href="mailto:luchodonpalito@gmail.com" className="text-sm hover:text-primary transition-colors">
                  luchodonpalito@gmail.com
                </a>
              </li>
            </ul>
            
            <div className="mt-4">
              <h5 className="text-white text-sm font-semibold mb-2">Horarios</h5>
              <p className="text-xs text-gray-400">
                Lun - Vie: 6:00 AM - 9:00 PM<br />
                Sábados: 7:00 AM - 9:00 PM<br />
                Domingos: 8:00 AM - 9:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Don Palito Jr. Todos los derechos reservados.
            </p>
            <p className="text-sm text-gray-500">
              Developed by <span className="text-primary">MigaTech</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
