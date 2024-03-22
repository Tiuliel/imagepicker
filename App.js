import { Button, Image, StatusBar, View, Text } from "react-native";
import { useState, useEffect } from "react";
 
/* IMportando so recursos da API nativa/móvel */
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
 
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
 
  /* Ao pressionar o botão, excecuta esta função */
  const escolherFoto = async () => {
    /* Acessando via ImagePicker a biblioteca
    para seleção de apenas imagens, com recurso de edição habilitado,
    proporção 16,9 e qualidade total.  */
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
 
    /* Se o usuário não cancelar a operação, pegamos a
    imagem e colocamos no state */
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };
  console.log(foto);
 
  const acessarCamera = async () => {
    /* Ao executar esta função quando o usuário escolhe
    tirar uma foto, utilizamos o launchCameraAsync para
    abrir a câmera do sistema operacional */
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
 
    /* Se o usuário não cancelar, atualizamos o state
    com a nova foto capturada */
    if (!imagem.canceled) {
      /* Usando a API do MediaLibrary para salvar no
      armazenamento físico do dispositivo */
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };
 
  return (
    <>
      <StatusBar style="auto" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Escolher foto" onPress={escolherFoto} />
        <Button title="Tirar uma nova foto" onPress={acessarCamera} />
 
        {foto ? (
          <Image
            style={{ width: 300, height: 300 }}
            source={{ uri: foto }}
            contentFit="cover"
          />
        ) : (
          <Text>Sem foto!</Text>
        )}
      </View>
    </>
  );
}