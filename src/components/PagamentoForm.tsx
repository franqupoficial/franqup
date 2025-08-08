// src/components/PagamentoForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define a validação do formulário com Zod
const formSchema = z.object({
  clientName: z.string().min(1, {
    message: "O nome do cliente é obrigatório.",
  }),
  clientCpf: z.string().min(11, {
    message: "O CPF deve ter no mínimo 11 caracteres.",
  }).max(14, {
    message: "O CPF deve ter no máximo 14 caracteres.",
  }),
  serviceType: z.string().min(1, {
    message: "O tipo de serviço é obrigatório.",
  }),
});

export function PagamentoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientCpf: "",
      serviceType: "limpa-nome", // Valor padrão
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast("Gerando link de pagamento...", {
      description: "Aguarde enquanto processamos a solicitação.",
    });

    try {
      const pagamentoResponse = await fetch("/api/pagamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: values.clientName,
          clientCpf: values.clientCpf,
          serviceType: values.serviceType,
        }),
      });

      if (!pagamentoResponse.ok) {
        const errorData = await pagamentoResponse.json();
        throw new Error(`Erro ao gerar o link de pagamento: ${errorData.message}`);
      }

      const pagamentoResult = await pagamentoResponse.json();

      if (pagamentoResult.paymentUrl) {
        toast.success("Link de pagamento gerado com sucesso!", {
          description: "Redirecionando para a página de pagamento...",
        });
        router.push(pagamentoResult.paymentUrl);
      } else {
        throw new Error("URL de pagamento não recebida.");
      }
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      toast.error(`Ocorreu um erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 rounded-lg bg-gray-800 text-white">
      <h3 className="text-xl font-semibold mb-4">Link de Pagamento</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="clientName" className="block mb-1">Nome do Cliente</Label>
          <Input id="clientName" type="text" {...form.register("clientName")} />
          {form.formState.errors.clientName && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.clientName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="clientCpf" className="block mb-1">CPF</Label>
          <Input id="clientCpf" type="text" {...form.register("clientCpf")} />
          {form.formState.errors.clientCpf && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.clientCpf.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="serviceType" className="block mb-1">Tipo de Serviço</Label>
          <Input id="serviceType" type="text" {...form.register("serviceType")} />
          {form.formState.errors.serviceType && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.serviceType.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading}>
          {loading ? "Gerando..." : "Gerar Link de Pagamento"}
        </Button>
      </form>
    </div>
  );
}
