const admin = require("firebase-admin");

// FIXED SERVICE ACCOUNT FILE
const serviceAccount = require("C:\\Users\\admin\\Downloads\\serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

async function seed() {
  console.log("Starting Firestore Seeding...");

  // -----------------------------
  // 1. USERS COLLECTION
  // -----------------------------
  const users = [
    { user_id: "u_01", name: "Bhagyashri", email: "bhagyashri@example.com", age: 23, location: "India" },
    { user_id: "u_02", name: "Aarav", email: "aarav@example.com", age: 28, location: "India" },
    { user_id: "u_03", name: "Maya", email: "maya@example.com", age: 22, location: "India" },
    { user_id: "u_04", name: "Rohan", email: "rohan@example.com", age: 31, location: "India" },
    { user_id: "u_05", name: "Sana", email: "sana@example.com", age: 27, location: "India" },
    { user_id: "u_06", name: "Vikram", email: "vikram@example.com", age: 35, location: "India" },
    { user_id: "u_07", name: "Isha", email: "isha@example.com", age: 24, location: "India" },
    { user_id: "u_08", name: "Karan", email: "karan@example.com", age: 29, location: "India" }
  ];

  for (const u of users) {
    await db.collection("users").doc(u.user_id).set(u);
  }
  console.log("Users inserted");

  // -----------------------------
  // 2. MAIN PASTA RECIPE
  // -----------------------------
  const pastaRecipe = {
    recipe_id: "r_user_01",
    name: "Comfort Pasta",
    description: "Simple pasta with veggies and cheese.",
    prep_time_minutes: 25,
    difficulty: "easy",
    cuisine: "Italian",
    created_by: "u_01",
    ingredients: [
      { name: "pasta", quantity: "120g" },
      { name: "water", quantity: "750ml" },
      { name: "salt", quantity: "1 tsp" },
      { name: "oil", quantity: "1 tbsp" },
      { name: "onion", quantity: "1 medium" },
      { name: "tomato", quantity: "1 medium" },
      { name: "capsicum", quantity: "1/2" },
      { name: "carrot", quantity: "1 small" },
      { name: "pasta masala", quantity: "1 tsp" },
      { name: "chilli flakes", quantity: "1 tsp" },
      { name: "red chilli powder", quantity: "1 tsp" },
      { name: "tomato sauce", quantity: "2 tbsp" },
      { name: "turmeric", quantity: "1/4 tsp" },
      { name: "cheese", quantity: "2 tbsp" }
    ],
    steps: [
      "Boil water with salt.",
      "Cook pasta for 10–12 minutes.",
      "Sauté onions until golden.",
      "Add vegetables and stir for 3–4 minutes.",
      "Add spices + tomato sauce.",
      "Mix pasta and cook for 5 minutes.",
      "Serve with cheese."
    ],
    created_at: new Date().toISOString()
  };

  await db.collection("recipes").doc(pastaRecipe.recipe_id).set(pastaRecipe);
  console.log("✅ Main Pasta Recipe inserted");

  // -----------------------------
  // 3. SYNTHETIC RECIPES (20)
  // -----------------------------
  const sampleNames = ["Veg Delight", "Paneer Pasta", "Aglio Olio", "Cheesy Mac", "Tomato Basil", "Mushroom Pasta", "Chicken Pasta"];
  const cuisines = ["Italian", "Indian", "Fusion"];
  const difficulties = ["easy", "medium", "hard"];

  for (let i = 2; i <= 21; i++) {
    const id = `r_${i.toString().padStart(2, "0")}`;
    const recipe = {
      recipe_id: id,
      name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      description: "Synthetic recipe for testing.",
      prep_time_minutes: Math.floor(Math.random() * 30) + 10,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      cuisine: cuisines[Math.floor(Math.random() * cuisines.length)],
      created_by: users[Math.floor(Math.random() * users.length)].user_id,
      ingredients: [
        { name: "pasta", quantity: "100g" },
        { name: "oil", quantity: "1 tbsp" },
        { name: "salt", quantity: "to taste" }
      ],
      steps: ["Boil pasta", "Prepare sauce", "Mix well", "Serve"],
      created_at: new Date().toISOString()
    };

    await db.collection("recipes").doc(id).set(recipe);
  }
  console.log("Synthetic recipes inserted");

  // -----------------------------
  // 4. INTERACTIONS (200 records)
  // -----------------------------
  const interactionTypes = ["view", "like", "cook_attempt"];

  let counter = 1;
  for (let i = 0; i < 200; i++) {
    const inter = {
      interaction_id: `i_${counter.toString().padStart(3, "0")}`,
      user_id: users[Math.floor(Math.random() * users.length)].user_id,
      recipe_id: `r_${(Math.floor(Math.random() * 20) + 1).toString().padStart(2, "0")}`,
      type: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
      timestamp: new Date().toISOString()
    };

    await db.collection("interactions").doc(inter.interaction_id).set(inter);

    counter++;
  }

  console.log("200 interactions inserted");
  console.log("ALL DATA SUCCESSFULLY SEEDED!");
}

seed();
