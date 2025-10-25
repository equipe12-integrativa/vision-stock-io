import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Contagem() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);

  // Mock de produto (poderia vir da API)
  const [produto, setProduto] = useState({
    nome: "Produto 1",
    estoque: 120,
  });

  // Quantidade padrão começa em 1
  const [quantidade, setQuantidade] = useState<number>(1);

  // Controle do alerta (Dialog)
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreaming(true);
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleEnviar = () => {
    // Abre o alerta de confirmação
    setOpenDialog(true);
  };

  const confirmarAtualizacao = () => {
    setOpenDialog(false);
    alert(
      `Produto atualizado com sucesso!\n\nProduto: ${produto.nome}\nEstoque Atual: ${produto.estoque}\nQuantidade Atualizada: ${quantidade}`
    );
    // Aqui você pode chamar sua API: updateProduto(produto.id, quantidade)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Leitor de Código de Barras</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          <video
            ref={videoRef}
            className="w-full h-60 rounded-lg border border-gray-300 object-cover"
          >
            Câmera não suportada
          </video>

          <Button onClick={handleEnviar} className="w-full">
            Enviar
          </Button>
        </CardContent>
      </Card>

      {/* ALERTA DE CONFIRMAÇÃO */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Atualização</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-gray-700">
            <p>
              Deseja atualizar o produto <strong>{produto.nome}</strong>
            </p>
            <p>
              Estoque atual: <strong>{produto.estoque}</strong>
            </p>

            <div className="flex flex-col gap-1">
              <Label htmlFor="quantidade">Quantidade a atualizar</Label>
              <Input
                id="quantidade"
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarAtualizacao}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}