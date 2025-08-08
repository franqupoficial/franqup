"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LimpaNomeForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const clientName = formData.get('nome');
        const clientCpf = formData.get('cpf');

        try {
            // Envia os dados como JSON para o endpoint de Limpa Nome
            const limpaNomeResponse = await fetch('/api/limpa-nome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientName: clientName,
                    clientCpf: clientCpf,
                }),
            });

            if (!limpaNomeResponse.ok) {
                throw new Error('Erro ao enviar o processo de Limpa Nome.');
            }

            const limpaNomeResult = await limpaNomeResponse.json();
            toast(`Sucesso: ${limpaNomeResult.message}`);

            // Em seguida, gera o link de pagamento
            const pagamentoResponse = await fetch('/api/pagamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientName: clientName,
                    clientCpf: clientCpf,
                    serviceType: 'limpa-nome'
                }),
            });

            if (!pagamentoResponse.ok) {
                throw new Error('Erro ao gerar o link de pagamento.');
            }

            const pagamentoResult = await pagamentoResponse.json();

            if (pagamentoResult.paymentUrl) {
                router.push(pagamentoResult.paymentUrl);
            } else {
                throw new Error('URL de pagamento não recebida.');
            }

        } catch (error: any) {
            toast(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nome" className="text-gray-700">Nome Completo</Label>
                    <Input id="nome" name="nome" required className="bg-white border border-gray-300 text-gray-900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                    <Input id="cpf" name="cpf" required className="bg-white border border-gray-300 text-gray-900" />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Processo"}
                </Button>
            </form>
        </div>
    );
}
