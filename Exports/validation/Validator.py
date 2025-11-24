import csv
import re

def load_csv(path):
    with open(path, encoding="utf-8") as f:
        return list(csv.DictReader(f))

# Load data
recipes = load_csv("recipe.csv")
ingredients = load_csv("ingredients.csv")
steps = load_csv("steps.csv")
interactions = load_csv("interactions.csv")
users = load_csv("users.csv")

# Helper sets for validation
recipe_ids = {r["recipe_id"] for r in recipes}
user_ids = {u["user_id"] for u in users}

report = {
    "recipes": [],
    "ingredients": [],
    "steps": [],
    "interactions": [],
    "users": []
}

# ------------------------------
# 1. Validate recipes.csv
# ------------------------------
for r in recipes:
    errors = []

    if not r["recipe_id"]:
        errors.append("Missing recipe_id")

    if not r["name"].strip():
        errors.append("Missing name")

    if r["prep_time"] and not r["prep_time"].isdigit():
        errors.append("prep_time must be a positive number")

    if r["difficulty"] not in ["easy", "medium", "hard"]:
        errors.append("Invalid difficulty")

    if not r["cuisine"]:
        errors.append("Missing cuisine")

    if r["created_by"] not in user_ids:
        errors.append("created_by is not a valid user")

    report["recipes"].append({"record": r, "errors": errors})


# ------------------------------
# 2. Validate ingredients.csv
# ------------------------------
for ing in ingredients:
    errors = []

    if ing["recipe_id"] not in recipe_ids:
        errors.append("Invalid recipe_id")

    if not ing["ingredient_name"]:
        errors.append("Missing ingredient_name")

    if not ing["quantity"]:
        errors.append("Missing quantity")

    report["ingredients"].append({"record": ing, "errors": errors})


# ------------------------------
# 3. Validate steps.csv
# ------------------------------
for s in steps:
    errors = []

    if s["recipe_id"] not in recipe_ids:
        errors.append("Invalid recipe_id")

    if not s["step_text"]:
        errors.append("Missing step_text")

    try:
        if int(s["step_number"]) < 1:
            errors.append("step_number must be positive")
    except:
        errors.append("step_number must be an integer")

    report["steps"].append({"record": s, "errors": errors})


# ------------------------------
# 4. Validate interactions.csv
# ------------------------------
for i in interactions:
    errors = []

    if i["user_id"] not in user_ids:
        errors.append("Invalid user_id")

    if i["recipe_id"] not in recipe_ids:
        errors.append("Invalid recipe_id")

    if i["type"] not in ["view", "like", "cook_attempt"]:
        errors.append("Invalid interaction type")

    if i["rating"]:
        try:
            rating = int(i["rating"])
            if rating < 1 or rating > 5:
                errors.append("Rating must be 1-5")
        except:
            errors.append("Rating must be an integer")

    if not i["timestamp"]:
        errors.append("Missing timestamp")

    report["interactions"].append({"record": i, "errors": errors})


# ------------------------------
# 5. Validate users.csv
# ------------------------------
for u in users:
    errors = []

    if not u["user_id"]:
        errors.append("Missing user_id")

    if "@" not in u["email"]:
        errors.append("Invalid email format")

    try:
        if int(u["age"]) <= 0:
            errors.append("Age must be positive")
    except:
        errors.append("Age must be numeric")

    if not u["name"]:
        errors.append("Missing name")

    if not u["created_at"]:
        errors.append("Missing created_at")

    report["users"].append({"record": u, "errors": errors})


# ------------------------------
# Output Validation Report
# ------------------------------
import json
with open("validation_report.json", "w", encoding="utf-8") as f:
    json.dump(report, f, indent=4)

print(" Validation Completed! Check validation_report.json")
