
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white">
              {user?.email ? getInitials(user.email) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Minha Conta</SheetTitle>
          <SheetDescription>
            Gerencie suas configurações e saia da conta
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {user?.email ? getInitials(user.email) : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-600">Usuário ativo</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3" disabled>
              <User size={18} />
              Perfil
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" disabled>
              <Settings size={18} />
              Configurações
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              Sair da conta
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
