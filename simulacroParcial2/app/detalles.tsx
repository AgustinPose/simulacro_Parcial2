import { StyleSheet, View, Dimensions, Image, Button, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { BottomSheet } from '@rneui/themed';

const { width, height } = Dimensions.get("window");

export default function PlanetDetails() {
  const { planetId } = useLocalSearchParams();
  const [planetDetails, setPlanetDetails] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editedPlanet, setEditedPlanet] = useState({
    name: "",
    description: "",
    moons: 0,
    moon_names: [],
    image: "",
  });

  const fetchPlanetDetails = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:8000/planets/${planetId}`);
      const data = await response.json();
      setPlanetDetails(data);
      setEditedPlanet(data);
    } catch (error) {
      console.error("Error fetching planet details:", error);
    }
  };

  const handleUpdatePlanet = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:8000/planets/${planetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPlanet),
      });
      const updatedPlanet = await response.json();
      setPlanetDetails(updatedPlanet);
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating planet:", error);
    }
  };

  useEffect(() => {
    fetchPlanetDetails();
  }, [planetId]);

  return (
    <ThemedView style={styles.container}>
      {planetDetails && (
        <>
          <ThemedText type="title" style={styles.name}>
            {planetDetails.name}
          </ThemedText>

          <Image source={{ uri: planetDetails.image }} style={styles.planetImage} />

          <ThemedText type="default" style={styles.description}>
            {planetDetails.description}
          </ThemedText>

          {planetDetails.moons > 0 && (
            <>
              <ThemedText type="subtitle" style={styles.moonsTitle}>
                Moons: {planetDetails.moons}
              </ThemedText>

              <ThemedText type="subtitle" style={styles.moonsTitle}>
                Moon Names: {planetDetails.moon_names?.join(", ")}
              </ThemedText>
            </>
          )}

          <Button title="Editar Perfil" onPress={() => setIsVisible(true)} />

          <BottomSheet isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}  containerStyle={{
    height: height * 0.8  
  }} >
            <View style={styles.bottomSheetContent}>
              <TextInput
                style={styles.input}
                value={editedPlanet.name}
                onChangeText={(text) => setEditedPlanet(prev => ({ ...prev, name: text }))}
                placeholder="Nombre del planeta"
              />
              <TextInput
                style={styles.input}
                value={editedPlanet.description}
                onChangeText={(text) => setEditedPlanet(prev => ({ ...prev, description: text }))}
                placeholder="Descripción"
                multiline
              />
              <TextInput
                style={styles.input}
                value={String(editedPlanet.moons)}
                onChangeText={(text) => setEditedPlanet(prev => ({ ...prev, moons: parseInt(text) || 0 }))}
                placeholder="Número de lunas"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={editedPlanet.image}
                onChangeText={(text) => setEditedPlanet(prev => ({ ...prev, image: text }))}
                placeholder="URL de la imagen"
              />
              <Button title="Guardar Cambios" onPress={handleUpdatePlanet} />
            </View>
          </BottomSheet>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  name: {
    fontSize: width * 0.08,
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  description: {
    marginBottom: height * 0.03,
  },
  moonsTitle: {
    marginBottom: height * 0.01,
    fontWeight: "bold",
  },
  planetImage: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: "cover",
    borderRadius: width * 0.03,
    alignSelf: "center",
    marginVertical: height * 0.02,
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.7, // Ensures minimum height matches container
    maxHeight: height * 0.7  // Caps the maximum height
},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  }
});
