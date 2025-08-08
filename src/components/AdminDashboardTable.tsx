// src/components/AdminDashboardTable.tsx
import React from 'react';
import Link from 'next/link';

interface RequestData {
    id: string;
    serviceType: string;
    clientName: string;
    clientCpf?: string;
    cnhSituation?: string;
    timestamp: Date;
    cnhAttachment?: { fileName: string; data: string };
    addressProofAttachment?: { fileName: string; data: string };
}

interface AdminDashboardTableProps {
    requests: RequestData[];
}

export function AdminDashboardTable({ requests }: AdminDashboardTableProps) {
    return (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            ID da Solicitação
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Data
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Serviço
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Nome do Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            CPF
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Situação CNH
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <tr key={request.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400 hover:text-blue-200">
                                    <Link href={`/admin/solicitacao/${request.id}`}>
                                        {request.id.slice(0, 8)}...
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {request.timestamp.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {request.serviceType === 'limpa-nome' ? 'Limpa Nome' : 'Processos CNH'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {request.clientName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {request.clientCpf || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {request.cnhSituation || 'N/A'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                Nenhuma solicitação encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}