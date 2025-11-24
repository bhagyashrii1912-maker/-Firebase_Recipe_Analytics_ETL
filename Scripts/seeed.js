const admin = require("firebase-admin");

// FIXED SERVICE ACCOUNT FILE
const serviceAccount = require("C:\\Users\\admin\\Downloads\\serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

// ✅ Candidate PDF file path
const candidatePdfPath = "C:\\Users\\admin\\OneDrive\\Documents\\firestore-seed\\Bhagyashri Khedkar_Data Engineer_Activity-5.pdf";

// Helpers
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// --------------------------------------------
// SEED FUNCTION
// --------------------------------------------
async function seed() {
  console.log("🔥 Starting Firestore Seeding...\n");

  // ------------------------------------------------
  // 1️⃣ USERS
  // ------------------------------------------------
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
  console.log("✅ Users inserted");

  // ------------------------------------------------
  // 2️⃣ PRIMARY CANDIDATE RECIPE (YOUR PASTA)
  // ------------------------------------------------
  const pastaRecipe = {
    recipe_id: "r_user_01",
    name: "Comfort Pasta",
    description: "Simple pasta with veggies and cheese.",
    prep_time_minutes: 25,
    difficulty: "easy",
    cuisine: "Italian",
    created_by: "u_01",
    source_pdf: candidatePdfPath,

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
  console.log("✅ Primary recipe inserted");

  // ------------------------------------------------
  // 3️⃣ SYNTHETIC RECIPES (20)
  // ------------------------------------------------
  const sampleNames = ["Veg Delight", "Paneer Pasta", "Aglio Olio", "Cheesy Mac", "Tomato Basil", "Mushroom Pasta"];
  const cuisines = ["Italian", "Indian", "Fusion"];
  const difficulties = ["easy", "medium", "hard"];

  const syntheticIds = [];

  for (let i = 1; i <= 20; i++) {
    const id = `r_${(i + 1).toString().padStart(2, "0")}`;
    syntheticIds.push(id);

    const recipe = {
      recipe_id: id,
      name: `${randomFrom(sampleNames)} ${i}`,
      description: "Synthetic recipe for testing.",
      prep_time_minutes: randInt(10, 40),
      difficulty: randomFrom(difficulties),
      cuisine: randomFrom(cuisines),
      created_by: randomFrom(users).user_id,
      ingredients: [
        { name: "pasta", quantity: "100g" },
        { name: randomFrom(["garlic", "spinach", "paneer", "tomato"]), quantity: "50g" }
      ],
      steps: ["Boil pasta", "Prepare veggies", "Mix pasta and serve"],
      created_at: new Date().toISOString()
    };

    await db.collection("recipes").doc(id).set(recipe);
  }

  console.log("✅ Synthetic recipes inserted");

  // ------------------------------------------------
  // 4️⃣ INTERACTIONS (VIEWS, LIKES, COOK_ATTEMPTS + RATING)
  // ------------------------------------------------
  let counter = 1;

  for (let i = 0; i < 200; i++) {
    const user = randomFrom(users);
    const recipe = randomFrom(["r_user_01", ...syntheticIds]);

    const prob = Math.random();
    let type = "view";
    let rating = null;

    if (prob < 0.70) type = "view";
    else if (prob < 0.90) type = "like";
    else {
      type = "cook_attempt";
      rating = randInt(1, 5); // ⭐ rating included
    }

    const interaction = {
      interaction_id: `i_${String(counter).padStart(4, "0")}`,
      user_id: user.user_id,
      recipe_id: recipe,
      type: type,
      timestamp: new Date().toISOString()
    };

    if (rating !== null) {
      interaction.rating = rating;
    }

    await db.collection("interactions").doc(interaction.interaction_id).set(interaction);

    counter++;
  }

  console.log("✅ Interactions (with ratings) inserted");

  console.log("\n🎉 ALL DATA SUCCESSFULLY SEEDED! FIREBASE IS READY.");
}

seed();
