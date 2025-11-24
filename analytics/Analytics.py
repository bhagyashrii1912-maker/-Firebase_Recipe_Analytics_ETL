import pandas as pd

recipes = pd.read_csv("recipe.csv")
ingredients = pd.read_csv("ingredients.csv")
steps = pd.read_csv("steps.csv")
interactions = pd.read_csv("interactions.csv")
users = pd.read_csv("users.csv")
common_ing = ingredients['ingredient_name'].value_counts().head(10)
print(common_ing)
avg_prep = recipes['prep_time'].astype(float).mean()
print("Average prep time:", avg_prep)
difficulty_counts = recipes['difficulty'].value_counts()
print(difficulty_counts)
views = interactions[interactions['type'] == 'view']
top_views = views['recipe_id'].value_counts().head(10)
print(top_views)
