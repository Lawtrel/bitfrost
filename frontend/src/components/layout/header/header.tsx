import { UserRound, UserRoundPlus } from 'lucide-react';
import NavbarHeader from './navbarHeader';
import Button from '@/components/ui/button/button';
import Logo from '@/components/shared/logo/logo';

export default function Header() {
    return (
      <header className="w-full flex items-center text-center justify-between bg-background border-b border-indigo-400 px-4 shadow-sm shadow-indigo-600/10">
        <div className="flex items-center gap-4">
          <Logo size={6} />
          <h1 className="text-3xl font-bold font-inter">Valle Pallet</h1>
        </div>
        <nav aria-label='Menu Principal' className="flex gap-16">
          <NavbarHeader 
            name="Home" link="/" />
          <NavbarHeader 
            name="Sobre Nós" link="/sobre-nos" />
          <NavbarHeader 
            name="Contato" link="/contato" />
        </nav>
        <div className="flex gap-4 px-4">
          <Button variant='secondary' href="/login" size='sm' leftIcon={<UserRound aria-hidden className="w-5 h-5" />}>Login</Button>
          <Button variant='primary' href="/cadastre-se" size='sm' leftIcon={<UserRoundPlus aria-hidden className="w-5 h-5" />}>Cadastre-se</Button>
        </div>
      </header>
    );
}