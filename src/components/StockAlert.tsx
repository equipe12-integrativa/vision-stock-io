"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/api/api";

interface StockAlertProps {
  id: number;
  nome: string;
  estoqueAtual: number;
  onClose: () => void;
  onUpdate?: () => void; // nova prop opcional para atualizar lista
}

export const StockAlert = ({ id, nome, estoqueAtual, onClose, onUpdate }: StockAlertProps) => {
  const [showInput, setShowInput] = useState(false);
  const [quantidade, setQuantidade] = useState(estoqueAtual);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await api.put(`/produtos/${id}`, { quantidade });
      onClose();
      onUpdate?.(); // chama refresh da lista
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="fixed top-1/2 left-1/2 w-[500px] max-w-full z-50 shadow-lg -translate-x-1/2 -translate-y-1/2 border-4 border-indigo-600 rounded-xl">
      <CardHeader>
        <CardTitle>Produto Identificado</CardTitle>
        <CardDescription>
          Produto <strong>{nome}</strong> (ID {id}) com estoque atual <strong>{estoqueAtual}</strong> reconhecido.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!showInput && <p>Deseja atualizar o estoque?</p>}

        {showInput && (
          <Input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="mt-2"
          />
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {!showInput ? (
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Não
            </Button>
            <Button size="sm" onClick={() => setShowInput(true)}>
              Sim
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleConfirm} disabled={loading}>
              {loading ? "Enviando..." : "Confirmar"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
