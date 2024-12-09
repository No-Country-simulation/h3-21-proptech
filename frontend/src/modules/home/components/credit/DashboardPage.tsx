// src/pages/DashboardPage.tsx
import React from 'react';
import { CreditScore } from './CreditScore.tsx';

export const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreditScore />
        {/* Podrías agregar más widgets aquí en el futuro */}
      </div>
    </div>
  );
};