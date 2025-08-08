export default function TestPage() {
    console.log('--- Teste de chave direta ---');
    console.log('SERVICE_ROLE_KEY:', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdmFnYm5lcWl5enNzYWlwbWF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYxMzkyNywiZXhwIjoyMDcwMTg5OTI3fQ.HhJpngaefX88wHX0DEGj34-qQr9pCKjCNXVAsJFrNYs");
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Teste de Variáveis de Ambiente</h1>
            <p className="mt-4 text-gray-400">Verifique o terminal do servidor.</p>
        </div>
    );
}