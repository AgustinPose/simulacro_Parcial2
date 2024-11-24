import { StyleSheet, TextInput, Button, Dimensions } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width, height } = Dimensions.get("window");

export default function AddPlanetScreen() {
  const [lastId, setLastId] = useState(9);
  const [newPlanet, setNewPlanet] = useState({
    id: "9",
    name: "",
    description: "",
    moons: "",
    moon_names: new Array<string>,
    image: "",
  });

  const handleAddPlanet = async () => {
    try {
      const nextId = (lastId + 1).toString();
      const response = await fetch("http://192.168.1.5:8000/planets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...newPlanet,
          id: nextId,
          moons: parseInt(newPlanet.moons) || 0,
        }),
      });

      if (response.ok) {
        setLastId(lastId + 1);
        setNewPlanet({
          id: (lastId + 2).toString(), // Prepare next ID
          name: "",
          description: "",
          moons: "",
          moon_names: [],
          image: "",
        });
        alert("Planet added successfully!");
      }
      // ... rest of the error handling remains the same
    } catch (error) {
      console.error("Full error details:", error);
      alert("Error adding planet");
    }
  };
  
  
  

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.mainTitle}>
        ¡Descubriste un planeta nuevo!
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        ¡Maravilloso! Cuéntanos sobre él
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Id"
        value={newPlanet.id}
        onChangeText={(text) => setNewPlanet({ ...newPlanet, id: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newPlanet.name}
        onChangeText={(text) => setNewPlanet({ ...newPlanet, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={newPlanet.description}
        onChangeText={(text) =>
          setNewPlanet({ ...newPlanet, description: text })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Moons"
        keyboardType="numeric"
        value={newPlanet.moons}
        onChangeText={(text) => setNewPlanet({ ...newPlanet, moons: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Moon Names (separate by commas)"
        value={newPlanet.moon_names.join(", ")}
        onChangeText={(text) =>
          setNewPlanet({
            ...newPlanet,
            moon_names: text
              .split(",")
              .map((name) => name.trim())
              .filter((name) => name !== ""),
          })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={newPlanet.image}
        onChangeText={(text) => setNewPlanet({ ...newPlanet, image: text })}
      />

      <Button title="Add Planet" onPress={handleAddPlanet} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    gap: width * 0.05,
    width: width,
    minHeight: height,
    marginTop: 50, // Added margin for notch
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
});
