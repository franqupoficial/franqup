// src/components/LimpaBacenForm.tsx

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function LimpaBacenForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Limpa Bacen</CardTitle>
        <CardDescription>
          Preencha os dados do cliente para iniciar o processo de Limpeza do Bacen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Formulário de Limpa Bacen ainda não implementado.</p>
        <Button className="mt-4">Enviar Processo</Button>
      </CardContent>
    </Card>
  );
}
