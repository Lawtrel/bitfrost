import { useLocation } from 'react-router-dom';
import { UserRound, UserRoundPlus } from 'lucide-react';
import NavbarHeader from './navbarHeader';
import Button from '@/components/ui/Button/button';
import Logo from '@/components/shared/logo/logo';

export default function Header() {
    const location = useLocation();
    if (location.pathname.startsWith("/dashboard")) return null;
    return (
      <header className="w-full flex flex-wrap gap-4 py-3 items-center text-center justify-between border-b border-indigo-400 px-4 shadow-sm shadow-indigo-600/10">
        <div className="flex items-center gap-4">
          <Logo size={6} />
          <h1 className="text-3xl font-bold font-inter">Valle Pallet</h1>
        </div>
        <nav aria-label='Menu Principal' className="flex gap-6">
          <NavbarHeader 
            name="Home" link="/" />
        </nav>
        <div className="flex gap-4 px-4">
          <Button variant='secondary' href="/login" size='sm' leftIcon={<UserRound aria-hidden className="w-5 h-5" />}>Login</Button>
          <Button variant='primary' href="/cadastre-se" size='sm' leftIcon={<UserRoundPlus aria-hidden className="w-5 h-5" />}>Cadastre-se</Button>
        </div>
      </header>
    );
}