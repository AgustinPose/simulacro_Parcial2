import {
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Text,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [planets, setPlanets] = useState([]);
  const router = useRouter();

  const handleFetchFeed = async () => {
    try {
      const planetsFetch = await fetch("http://192.168.1.5:8000/planets");
      const planets = await planetsFetch.json();
      return planets;
    } catch (error) {
      console.error("Error fetching planets:", error);
      return [];
    }
  };

  useEffect(() => {
    handleFetchFeed().then((planets) => {
      setPlanets(planets);
    });
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView>
        <ThemedView style={styles.container}>
          {/* Header del título */}
          <View style={styles.header}>
            <Text style={styles.title}>🌌 PLANETAS 🌍</Text>
          </View>

          {/* Lista de planetas */}
          {planets.map((planet: any) => (
            <ThemedView key={planet.id} style={styles.card}>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "./../detalles",
                    params: { planetId: planet.id },
                  });
                }}
                
                style={({ pressed }) => [
                  styles.button,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <ThemedText type="subtitle">{planet.name}</ThemedText>
              </Pressable>
            </ThemedView>
          ))}
        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },

  image: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: "cover",
    borderRadius: width * 0.03,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    padding: width * 0.05,
    gap: width * 0.05,
    width: width,
    minHeight: height,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#1D3D47", // Cambia esto según el tema
    textAlign: "center",
  },
  card: {
    padding: width * 0.05,
    borderRadius: width * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: height * 0.02,
    width: width * 0.92,
    alignSelf: "center",
  },
});
