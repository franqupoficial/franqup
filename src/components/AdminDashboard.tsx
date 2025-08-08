"use client";

import React from 'react';
import { AdminDashboardTable } from './AdminDashboardTable';

// Dados fictícios para simular as solicitações
const mockRequests = [
    {
        id: 'req_123',
        serviceType: 'limpa-nome',
        clientName: 'João da Silva',
        clientCpf: '123.456.789-00',
        cnhSituation: 'N/A',
        timestamp: new Date(),
        cnhAttachment: null,
        addressProofAttachment: {
            fileName: 'comprovante_joao.pdf',
            data: 'data:application/pdf;base64,VGVzdGUgZG8gY29tcHJvdmFudGUgZGUgZW5kZXJlY28='
        },
    },
    {
        id: 'req_456',
        serviceType: 'cnh',
        clientName: 'Maria Souza',
        clientCpf: '987.654.321-11',
        cnhSituation: 'suspensa',
        timestamp: new Date(Date.now() - 3600000),
        cnhAttachment: {
            fileName: 'cnh_maria.jpg',
            data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA'
        },
        addressProofAttachment: null,
    },
    {
        id: 'req_789',
        serviceType: 'cnh',
        clientName: 'Carlos Oliveira',
        clientCpf: '111.222.333-44',
        cnhSituation: 'bloqueada',
        timestamp: new Date(Date.now() - 7200000),
        cnhAttachment: null,
        addressProofAttachment: {
            fileName: 'comprovante_carlos.png',
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDjO/Axr+JgAAPyvDRwdgN/zgAAAAASUVORK5CYII='
        },
    },
];

export function AdminDashboard() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">Dashboard Administrativo</h2>
            <AdminDashboardTable requests={mockRequests} />
        </div>
    );
}