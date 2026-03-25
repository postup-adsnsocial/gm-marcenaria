import { Instagram, Mail, Phone, AtSign, Music2, Pin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-secondary py-20 px-6 border-t border-neutral/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {/* Contato */}
        <div className="space-y-8">
          <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-secondary/40">Contato</h3>
          <div className="space-y-4">
            <a href="tel:41999695577" className="flex items-center gap-4 group transition-colors hover:text-accent">
              <Phone className="w-5 h-5 text-secondary/20 group-hover:text-accent transition-colors" />
              <span className="font-sans text-lg font-light tracking-tight">(41) 99969-5577</span>
            </a>
            <a href="mailto:contato@gmmoveis.com.br" className="flex items-center gap-4 group transition-colors hover:text-accent">
              <Mail className="w-5 h-5 text-secondary/20 group-hover:text-accent transition-colors" />
              <span className="font-sans text-lg font-light tracking-tight">contato@gmmoveis.com.br</span>
            </a>
          </div>
          <div className="pt-4 space-y-1 font-sans text-lg font-light tracking-tight text-secondary/70">
            <p>R. Rua Antenor Alves de Souza n. 110, Roça Grande</p>
            <p>Colombo/PR, 83402-330</p>
          </div>
        </div>

        {/* Horário */}
        <div className="space-y-8">
          <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-secondary/40">Horário de Atendimento</h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="font-sans text-lg font-light tracking-tight">Segunda — Sexta-feira</p>
              <p className="font-sans text-lg font-light tracking-tight text-secondary/60">9h às 18h</p>
            </div>
            <div className="space-y-1">
              <p className="font-sans text-lg font-bold tracking-tight">Sábado</p>
              <p className="font-sans text-lg font-light tracking-tight text-secondary/60">09h às 13h</p>
            </div>
          </div>
        </div>

        {/* Siga-nos */}
        <div className="space-y-8">
          <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-secondary/40">Siga-nos</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Instagram, href: 'https://www.instagram.com/marcenaria.gilmoveis/' },
              { icon: AtSign, href: '#' },
              { icon: Pin, href: '#' },
              { icon: Music2, href: '#' },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-secondary flex items-center justify-center text-white transition-all hover:bg-accent hover:-translate-y-1"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-secondary/30">
        <p>&copy; {currentYear} GilMóveis Marcenaria. Todos os direitos reservados.</p>
        <p>Marcenaria de Luxo desde 1987</p>
      </div>
    </footer>
  );
}
