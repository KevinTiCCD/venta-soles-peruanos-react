
import { useRef } from 'react';
import { Sale } from '@/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { printReceipt, generateReceiptData } from '@/utils/printUtils';
import { getClientById, getSellerById, getConceptById } from '@/utils/storage';
import { Printer } from 'lucide-react';

interface SaleReceiptProps {
  sale: Sale;
  onClose: () => void;
}

const SaleReceipt = ({ sale, onClose }: SaleReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const receiptData = generateReceiptData(sale);
  
  const handlePrint = async () => {
    await printReceipt(receiptRef.current);
  };

  const client = getClientById(sale.clientId);
  const seller = getSellerById(sale.sellerId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Comprobante de Venta</span>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div ref={receiptRef} className="receipt-container">
              <div className="receipt-header">
                <h2 className="text-lg font-bold">COMPROBANTE DE VENTA</h2>
                <p>N° {receiptData.receiptNumber}</p>
                <p>Fecha: {receiptData.date}</p>
              </div>
              
              <div className="receipt-body">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1 font-semibold">Cliente:</td>
                      <td>{receiptData.client}</td>
                    </tr>
                    {client?.document && (
                      <tr>
                        <td className="py-1 font-semibold">Documento:</td>
                        <td>{client.document}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-1 font-semibold">Vendedor:</td>
                      <td>{receiptData.seller}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">Concepto:</td>
                      <td>{receiptData.concept}</td>
                    </tr>
                    {receiptData.observation && (
                      <tr>
                        <td className="py-1 font-semibold">Observación:</td>
                        <td>{receiptData.observation}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={2} className="border-t mt-2 pt-2"></td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold">TOTAL:</td>
                      <td className="font-bold text-right">{receiptData.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="receipt-footer">
                <p>¡Gracias por su pago!</p>
                <p>Julio - Sistema de Gestión</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Volver
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SaleReceipt;
