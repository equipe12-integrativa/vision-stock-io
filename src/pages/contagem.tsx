import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/api/api";

export default function Contagem() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [codigoLido, setCodigoLido] = useState<string>("");
  const [useBackCamera, setUseBackCamera] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);

  const startScanner = async () => {
    try {
      // Lista todas as câmeras disponíveis
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      // Escolhe dispositivo baseado em label ou fallback
      let device = devices.find(d =>
        useBackCamera ? /back|rear/gi.test(d.label) : /front|user/gi.test(d.label)
      );
      device = device || devices[0];
      setSelectedDeviceId(device.deviceId);

      // Para evitar câmeras conflitantes
      if (controlsRef.current) {
        controlsRef.current.stop();
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach(track => track.stop());
        }
      }

      const codeReader = new BrowserMultiFormatReader(); // sem "formats"

      const constraints: MediaStreamConstraints = {
        video: device
          ? { deviceId: { exact: device.deviceId } }
          : { facingMode: useBackCamera ? "environment" : "user" },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      controlsRef.current = await codeReader.decodeFromVideoDevice(
        device.deviceId,
        videoRef.current!,
        async (result, err) => {
          if (result) {
            const text = result.getText();
            const format = result.getBarcodeFormat();

            // Filtra apenas CODE_128 ou EAN_13
            if (format === BarcodeFormat.CODE_128 || format === BarcodeFormat.EAN_13) {
              setCodigoLido(text);
              try {
                await api.put("/contagem", { codigoBarras: codigoLido });
              } catch (apiErr) {
                console.error("Erro ao enviar código para API:", apiErr);
              }
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

  useEffect(() => {
    startScanner();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, [useBackCamera]);

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
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => setCodigoLido("")}
              variant="outline"
              className="flex-1"
            >
              Limpar Código
            </Button>
            <Button
              onClick={() => setUseBackCamera(prev => !prev)}
              variant="secondary"
              className="flex-1"
            >
              {useBackCamera ? "Usar Frontal" : "Usar Traseira"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
