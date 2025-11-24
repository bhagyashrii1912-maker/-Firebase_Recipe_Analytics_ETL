import json
import csv

# Load exported JSON files (CORRECT PATH)
recipes = json.load(open("Exports/recipes.json"))
interactions = json.load(open("Exports/interactions.json"))
users = json.load(open("Exports/users.json"))



# ----------------------------
# 1. recipe.csv
# ----------------------------
with open("recipe.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["recipe_id", "name", "description", "prep_time", "difficulty", "cuisine", "created_by"])

    for r in recipes:
        writer.writerow([
            r["recipe_id"],
            r.get("name", ""),
            r.get("description", ""),
            r.get("prep_time_minutes", ""),
            r.get("difficulty", ""),
            r.get("cuisine", ""),
            r.get("created_by", "")
        ])


# ----------------------------
# 2. ingredients.csv
# ----------------------------
with open("ingredients.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["recipe_id", "ingredient_name", "quantity"])

    for r in recipes:
        for ing in r.get("ingredients", []):
            writer.writerow([
                r["recipe_id"],
                ing.get("name", ""),
                ing.get("quantity", "")
            ])


# ----------------------------
# 3. steps.csv
# ----------------------------
with open("steps.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["recipe_id", "step_number", "step_text"])

    for r in recipes:
        for i, step in enumerate(r.get("steps", []), start=1):
            writer.writerow([
                r["recipe_id"],
                i,
                step
            ])


# ----------------------------
# 4. interactions.csv
# ----------------------------
with open("interactions.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["interaction_id", "user_id", "recipe_id", "type", "rating", "timestamp"])

    for x in interactions:
        writer.writerow([
            x.get("interaction_id", ""),
            x.get("user_id", ""),
            x.get("recipe_id", ""),
            x.get("type", ""), 
            x.get("rating", ""),   # empty when not a cook_attempt
            x.get("timestamp", "")
        ])


# ----------------------------
# 5. users.csv  (NEW)
# ----------------------------
with open("users.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["user_id", "name", "email", "age", "location", "created_at"])

    for u in users:
        writer.writerow([
            u.get("user_id", ""),
            u.get("name", ""),
            u.get("email", ""),
            u.get("age", ""),
            u.get("location", ""),
            u.get("created_at", "")
        ])

print("All CSVs generated successfully including users.csv!")

