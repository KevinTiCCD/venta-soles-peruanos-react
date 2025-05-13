
import { Sale } from './types';
import { getClientById, getSellerById, getConceptById } from './storage';

export const formatCurrency = (amount: number): string => {
  return `S/ ${amount.toFixed(2)}`;
};

export const formatDate = (date: Date): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const printReceipt = async (receiptElement: HTMLElement | null): Promise<void> => {
  if (!receiptElement) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permita ventanas emergentes para imprimir.');
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Recibo de Venta</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            width: 80mm;
            padding: 5mm;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt-body {
            margin-bottom: 10px;
          }
          .receipt-footer {
            text-align: center;
            font-size: 10px;
            margin-top: 10px;
          }
          table {
            width: 100%;
          }
          th, td {
            text-align: left;
            padding: 2px 0;
          }
        </style>
      </head>
      <body>
        ${receiptElement.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
};

export const generateReceiptData = (sale: Sale) => {
  const client = getClientById(sale.clientId);
  const seller = getSellerById(sale.sellerId);
  const concept = getConceptById(sale.conceptId);
  
  return {
    receiptNumber: sale.id.substring(0, 8).toUpperCase(),
    date: formatDate(new Date(sale.date)),
    client: client?.name || 'Cliente no encontrado',
    seller: seller?.name || 'Vendedor no encontrado',
    concept: concept?.name || 'Concepto no encontrado',
    observation: sale.observation || '',
    amount: formatCurrency(sale.amount),
  };
};
