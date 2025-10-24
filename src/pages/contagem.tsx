// App.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useEffect, useRef, useState } from "react";

export default function Contagem() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // câmera traseira
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

    // Cleanup: para a câmera ao sair do componente
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleEnviar = () => {
    alert("Botão enviar clicado! Aqui você enviaria o código para o backend.");
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
    </div>
  );
}
