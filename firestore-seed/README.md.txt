1) Data Modelling
The data model for this project is designed to represent recipe information, user details, and all interactions users perform on recipes. It follows a normalized, relational structure to ensure clean data, efficient querying, and easy transformation during the ETL process.
The model consists of five main entities:
1.recipes
2.Users 
3.ingredients
4.Steps
5.User Interactions
                          ┌───────────────────────┐
                          │        USERS          │
                          ├───────────────────────┤
                          │ user_id (PK)          │
                          │ name                  │
                          │ email                 │
                          └───────────┬───────────┘
                                      │ 1
                                      │
                                      │
                                      │ M
                     ┌────────────────▼────────────────┐
                     │        INTERACTIONS             │
                     ├─────────────────────────────────┤
                     │ interaction_id (PK)             │
                     │ user_id (FK)                    │
                     │ recipe_id (FK)                  │
                     │ type (view/like/cook_attempt)   │
                     │ rating (optional)               │
                     │ timestamp                       │
                     └─────────────────┬───────────────┘
                                       │ M
                                       │
                                       │
                                       │ 1
                     ┌─────────────────▼────────────────┐
                     │            RECIPES               │
                     ├──────────────────────────────────┤
                     │ recipe_id (PK)                   │
                     │ name                              │
                     │ description                       │
                     │ prep_time                         │
                     │ difficulty (easy/medium/hard)     │
                     │ cuisine                           │
                     │ created_by (FK → Users.user_id)   │
                     └───────────┬───────────┬──────────┘
                                 │1          │1
                                 │           │
                                M│          M│
                                 │           │
         ┌────────────────────────▼─┐    ┌────▼───────────────────────┐
         │       INGREDIENTS        │    │            STEPS            │
         ├──────────────────────────┤    ├─────────────────────────────┤
         │ ingredient_id (PK)       │    │ step_id (PK)                │
         │ recipe_id (FK)           │    │ recipe_id (FK)              │
         │ ingredient               │    │ step_number                  │
         │ quantity                 │    │ instruction                  │
         └──────────────────────────┘    └─────────────────────────────┘
2) Instructions for running the pipeline

1. Prepare Your Project Folder

firebase_Recipe_Analytics
│
├── Exports/
│   ├── recipes.json
│   ├── ingredients.json
│   ├── steps.json
│   ├── interactions.json
│   └── users.json
│
├── transform/
│   └── ETL.py
│
└── Normalized/

2.Export Data from Firestore
Use Firebase Console or your service account to export collections:
-Recipes
-Ingredients
-Steps
-Users
-Interactions
Save all exported .json files inside the Exports folder.

3.Run the ETL Script
Run the Python ETL script: python transform\ETL.py
This script will generate:
- Read JSON files from Exports/
- Normalize Firestore nested structure
- Generate clean relational tables into CSV files

4.Output CSV Files

Normalized/
│── recipes.csv
│── ingredients.csv
│── steps.csv
│── interactions.csv
└── users.csv

3)ETL process overview

Extract:-
This phase reads raw data from Firestore.The exported JSON files contain semi-structured recipe data, ingredients, steps, users, and interactions.
Extraction simply loads these JSON files into Python (using Pandas) for further processing.

Transform:-
In this stage, the raw Firestore documents are cleaned, standardized, and normalized.
Key operations include:
- Flattening nested fields (like ingredients & steps)
- Converting data types (prep_time, rating)
- Validating allowed values (difficulty, interaction type)
- Splitting data into relational tables
- Removing inconsistencies or missing values

Load:-
The final stage saves the transformed data into normalized CSV files such as:
recipes.csv
ingredients.csv
steps.csv
interactions.csv
users.csv

4) Insights Summary

Users most frequently view and like recipes from the Fusion and Indian cuisines, showing higher engagement in these categories.
Easy and medium-difficulty recipes receive more interactions than hard recipes, indicating user preference for quicker meals.
Personalized recipes (like r_user_01) also show strong engagement, proving users are interested in custom or simple comfort dishes.

5) Known constraints or limitations

Firestore exports may contain inconsistent or missing fields, requiring manual cleaning during transformation.
Some interaction records have missing ratings for cook attempts, reducing rating accuracy.
Recipe and user IDs are not globally unique across datasets, which may require additional validation when scaling.
Timestamp values rely on client-side generation—so they may not be perfectly chronological or normalized.