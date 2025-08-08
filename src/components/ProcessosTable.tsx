"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Processo {
  id: number;
  nome: string;
  cpf: string;
  servico: string;
  status: string;
}

export default function ProcessosTable() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProcessos() {
      try {
        const response = await fetch('/api/processos');
        const data = await response.json();
        if (response.ok && data.success) {
          setProcessos(data.processos);
        } else {
          console.error("Erro ao carregar processos:", data.message);
        }
      } catch (error) {
        console.error("Erro na chamada da API:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProcessos();
  }, []);

  if (loading) {
    return <p>Carregando processos...</p>;
  }

  if (processos.length === 0) {
    return <p>Nenhum processo encontrado.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell>{processo.nome}</TableCell>
                <TableCell>{processo.cpf}</TableCell>
                <TableCell>{processo.servico}</TableCell>
                <TableCell>{processo.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
