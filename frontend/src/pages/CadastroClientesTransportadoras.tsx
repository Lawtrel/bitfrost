import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs';
import { toast, useToast } from '@/hooks/use-toast';
import { createCliente, createTransportadora } from '@/services/api';

const CadastroClientesTransportadoras: React.FC = () => {
    const [clienteName, setClienteName] = useState('');
    const [transportadoraName, setTransportadoraName] = useState('');
    const { toast } = useToast();

// Função para lidar com o cadastro de clientes
const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteName.trim()) {
        toast({
            title: 'Erro',
            description: 'O nome do cliente é obrigatório.',
            variant: 'destructive',
        });
        return;
    }
    try {
        await createCliente(clienteName); // Chama a função da API para criar o cliente
        toast({
            title: 'Sucesso',
            description: `Cliente "${clienteName}" cadastrado com sucesso!`,
        });
        setClienteName(''); // Limpa o campo após o cadastro
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        toast({
            title: 'Erro',
            description: 'Ocorreu um erro ao cadastrar o cliente.',
            variant: 'destructive',
        });
    }
};
    // Função para lidar com o cadastro de transportadoras
    const handleCadastroTransportadora = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transportadoraName.trim()) {
            toast({
                title: 'Erro',
                description: 'O nome da transportadora é obrigatório.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await createTransportadora(transportadoraName); // Chama a função da API para criar a transportadora
            toast({
                title: 'Sucesso',
                description: `Transportadora "${transportadoraName}" cadastrada com sucesso!`,
            });
            setTransportadoraName(''); // Limpa o campo após o cadastro
        } catch (error) {
            console.error('Erro ao cadastrar transportadora:', error);
            toast({
                title: 'Erro',
                description: 'Ocorreu um erro ao cadastrar a transportadora.',
                variant: 'destructive',
            });
        }  
    };

export default CadastroClientesTransportadoras;
