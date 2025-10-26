import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contagem() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [codigoLido, setCodigoLido] = useState<string>("");

  interface VideoDecodeControlLocal {
    stop(): void;
  }

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls: VideoDecodeControlLocal | null = null;

    const startScanner = async () => {
      try {
        // Solicita permissão de câmera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Lista dispositivos de vídeo (câmeras)
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();

        // Tenta pegar a câmera traseira
        const backCamera = devices.find(device =>
          /back|rear/gi.test(device.label)
        );
        const selectedDeviceId = backCamera?.deviceId || devices[0]?.deviceId;
        if (!selectedDeviceId) return;

        // Inicia a leitura de código de barras
        controls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          async (result, err) => {
            if (result) {
              setCodigoLido(result.getText());

              // Exemplo de envio para API via PUT
              try {
                await axios.put("/sua-api", {
                  codigo: result.getText()
                });
              } catch (apiErr) {
                console.error("Erro ao enviar código para API:", apiErr);
              }
            }
            if (err && err.name !== "NotFoundException") {
              console.error("Erro ao ler código:", err);
            }
          }
        );
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    };

    startScanner();

    return () => {
      controls?.stop();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

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
            muted
          />
          {codigoLido && (
            <p className="text-green-600 font-semibold">
              Código detectado: {codigoLido}
            </p>
          )}
          <Button
            onClick={() => setCodigoLido("")}
            variant="outline"
            className="w-full"
          >
            Limpar Código
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
