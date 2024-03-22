import { Button, Image, StatusBar, Text, View } from "react-native";
import { useState, useEffect } from "react";

/* IMportando so recursos da API nativa/móvel */
import * as ImagePicker from "expo-image-picker";

export default function App() {
  /* State tradicional para armazenar a referência da foto (quando existir) */
  const [foto, setFoto] = useState(null);
  /* State de checagem de permissões de uso (através do hook useCameraPermissions) */
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  console.log(status);

  /* Ao entrar no app, será executada a verificação de permissões de uso */
  useEffect(() => {
    /* Esta função mostrará um popup para o usuário perguntando se ele autoriza a utilização do recurso móvel (no caso, selecionar/tirar foto). */
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      /* Ele dando autorização (granted), isso será armazenado no state de requestPermission */
      requestPermission(cameraStatus === "granted");
    }
    verificaPermissoes();
  }, []);

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (imagem.canceled) {
      setFoto(imagem.assets[0].uri);
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={escolherFoto} title="Escolher foto" />
        <Button onPress={acessarCamera} title="Tirar uma nova foto" />

        {foto ? (
          <Image
            style={{ width: 300, height: 300 }}
            source={foto}
            contentFit="cover"
          />
        ) : (
          <Text>Sem foto!</Text>
        )}

        <Image style={{ width: 300, height: 300 }} />
      </View>
    </>
  );
}
