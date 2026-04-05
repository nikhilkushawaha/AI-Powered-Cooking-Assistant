import logging
import re
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recipe import Recipe
from app.schemas.grocery import GroceryListResponse, GroceryItem

logger = logging.getLogger(__name__)


class GroceryService:
    async def generate_grocery_list(
        self,
        recipe_ids: list[UUID],
        user_id: UUID,
        db: AsyncSession,
    ) -> GroceryListResponse:
        
        # 1. Fetch recipes
        query = select(Recipe).where(Recipe.id.in_(recipe_ids))
        result = await db.execute(query)
        recipes = list(result.scalars().all())

        if not recipes:
            raise HTTPException(status_code=404, detail="No valid recipes found")
        
        valid_recipes = [r for r in recipes if r.user_id == user_id]
        if not valid_recipes:
            raise HTTPException(status_code=404, detail="No valid recipes found")

        recipe_names = [r.name for r in valid_recipes]

        # 2. Collect raw items
        raw_items = []
        for recipe in valid_recipes:
            for ingredient in recipe.ingredients:
                raw_items.append({
                    "name": ingredient.get("name", ""),
                    "quantity": ingredient.get("quantity", ""),
                    "recipe_name": recipe.name
                })

        # 3. Normalize and merge
        # Map grouped by: normalized_name -> unit -> {"merged_number": float, "recipes": set, "display_name": str}
        # For non-parseable, unit = None
        grouped = {}

        for item in raw_items:
            norm_name = self._normalize_name(item["name"])
            if not norm_name:
                continue

            num, unit = self._parse_quantity(item["quantity"])
            
            if norm_name not in grouped:
                grouped[norm_name] = {}
            
            if unit not in grouped[norm_name]:
                grouped[norm_name][unit] = {
                    "merged_number": 0.0 if num is not None else None,
                    "recipes": set(),
                    "display_name": item["name"].title(),
                    "unparseable_original": []
                }
            
            entry = grouped[norm_name][unit]
            entry["recipes"].add(item["recipe_name"])
            
            if num is not None and entry["merged_number"] is not None:
                entry["merged_number"] += num
            else:
                # If one is unparseable and another is, we just store origins
                entry["merged_number"] = None
                entry["unparseable_original"].append(item["quantity"])

        # Create GroceryItem objects
        grocery_items = []
        for norm_name, unit_map in grouped.items():
            for unit, data in unit_map.items():
                if data["merged_number"] is not None:
                    # Formatted float
                    qty_str = f"{data['merged_number']:g}"
                    if unit:
                        qty_str += f" {unit}"
                else:
                    qty_str = ", ".join(set(data["unparseable_original"])) or "as needed"

                grocery_items.append(GroceryItem(
                    name=data["display_name"],
                    total_quantity=qty_str.strip(),
                    unit=unit,
                    recipes=list(data["recipes"])
                ))


        # 4. Sort Items (basic heuristic sorting based on names)
        # Produce > Proteins > Dairy > Pantry > Others
        def get_category_weight(name: str):
            n = name.lower()
            if any(x in n for x in ["chicken", "beef", "pork", "steak", "fish", "meat", "egg", "shrimp"]):
                return 1 # Protein
            if any(x in n for x in ["milk", "cheese", "cream", "butter", "yogurt"]):
                return 2 # Dairy
            if any(x in n for x in ["oil", "salt", "pepper", "sugar", "flour", "spice", "sauce", "vinegar"]):
                return 3 # Pantry
            return 0 # Default produce/others

        grocery_items.sort(key=lambda x: (get_category_weight(x.name), x.name))

        return GroceryListResponse(
            items=grocery_items,
            total_items=len(grocery_items),
            recipe_names=recipe_names,
            generated_at=datetime.now(timezone.utc)
        )

    def _normalize_name(self, name: str) -> str:
        s = name.lower().strip()
        # Basic removal of plurals if ends with 's' or 'es' (very basic heuristic)
        if s.endswith("es") and len(s) > 3:
             if not any(s.endswith(x) for x in ["cheese", "leaves"]):
                 s = s[:-2]
        elif s.endswith("s") and len(s) > 2:
             if s not in ["glass", "grass", "bass"]:
                 s = s[:-1]
        
        # clean up extras like (chopped), (diced)
        s = re.sub(r'\(.*?\)', '', s).strip()
        
        # drop common prep words
        words = s.split()
        prep_words = {"chopped", "diced", "sliced", "fresh", "ground", "minced"}
        filtered = [w for w in words if w not in prep_words]
        return " ".join(filtered)

    def _parse_quantity(self, quantity_str: str) -> tuple:
        s = quantity_str.lower().strip()
        
        match = re.search(r'^([0-9\.]+)\s*(.*)$', s)
        if match:
             num_str = match.group(1)
             unit = match.group(2).strip()
             if not unit:
                 unit = None
             try:
                 return float(num_str), unit
             except ValueError:
                 pass
        
        return None, quantity_str
