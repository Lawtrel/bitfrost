import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

// Definindo o tipo para um Vale
export interface Vale {
  id?: string;
  cliente: string;
  transportadora: string;
  produto: string;
  placa: string;
  motorista: string;
  pesoBruto: number;
  pesoTara: number;
  pesoLiquido: number;
  unidade: string;
  data: string;
  status: 'acumulado' | 'processado' | 'vencido';
  organizationId?: string;
  createdAt?: any;
}

export function useVales() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Função para criar um novo vale
  const criarVale = async (valeData: Omit<Vale, 'id' | 'status' | 'organizationId' | 'createdAt'>) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      await addDoc(collection(db, "valescadastrados"), {
        ...valeData,
        status: 'acumulado',
        organizationId: user.uid, // Associa o vale ao ID do usuário/organização
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Sucesso!",
        description: "Vale criado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao criar vale:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o vale. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar vales
  const buscarVales = async (collectionName: string, status?: Vale['status']) => {
    setLoading(true);
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Usuário não autenticado.");
        }

        let q = query(collection(db, collectionName), where("organizationId", "==", user.uid));
        if (status) {
            q = query(q, where("status", "==", status));
        }

        const querySnapshot = await getDocs(q);
        const vales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vale[];
        return vales;
    } catch (error) {
        console.error("Erro ao buscar vales:", error);
        toast({
            title: "Erro",
            description: "Não foi possível carregar os vales.",
            variant: "destructive",
        });
        return [];
    } finally {
        setLoading(false);
    }
  };

  // Função para dar baixa em um vale
    const baixarVale = async (valeId: string) => {
        setLoading(true);
        try {
            const valeRef = doc(db, "valescadastrados", valeId);
            await updateDoc(valeRef, {
                status: 'processado'
            });
            toast({
                title: "Sucesso!",
                description: "Baixa do vale realizada com sucesso.",
            });
        } catch (error) {
            console.error("Erro ao dar baixa no vale:", error);
            toast({
                title: "Erro",
                description: "Não foi possível dar baixa no vale.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };


  return { criarVale, buscarVales, baixarVale, loading };
}