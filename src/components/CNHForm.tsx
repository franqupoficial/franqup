"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CNHForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const cnhResponse = await fetch('/api/cnh', {
                method: 'POST',
                body: formData,
            });

            if (!cnhResponse.ok) {
                throw new Error('Erro ao enviar o processo de CNH.');
            }

            const cnhResult = await cnhResponse.json();
            toast(`Sucesso: ${cnhResult.message}`);

            const pagamentoResponse = await fetch('/api/pagamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientName: formData.get('nome'),
                    clientCpf: formData.get('cpf'),
                    serviceType: 'cnh'
                }),
            });

            if (!pagamentoResponse.ok) {
                throw new Error('Erro ao gerar o link de pagamento.');
            }

            const pagamentoResult = await pagamentoResponse.json();

            if (pagamentoResult.paymentUrl) {
                router.push(pagametoResult.paymentUrl);
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
                <div className="space-y-2">
                    <Label htmlFor="cnhSituation" className="text-gray-700">Situação da CNH</Label>
                    <select id="cnhSituation" name="cnhSituation" required className="bg-white border border-gray-300 text-gray-900 rounded-md p-2 w-full">
                        <option value="cassada">Cassada</option>
                        <option value="suspensa">Suspensa</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cnh" className="text-gray-700">Cópia da CNH</Label>
                    <Input id="cnh" name="cnh" type="file" required className="bg-white border border-gray-300 text-gray-900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="comprovante" className="text-gray-700">Comprovante de Endereço</Label>
                    <Input id="comprovante" name="comprovante" type="file" required className="bg-white border border-gray-300 text-gray-900" />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Processo"}
                </Button>
            </form>
        </div>
    );
}
