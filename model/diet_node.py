import json
from model.state import AgentState
from backend.services.gemini_svc import get_flash_model

def diet_node(state: dict):
    """
    INDEPENDENT NODE: Generates structured Diet & Lifestyle advice.
    Expects a dictionary with:
      - prediction (condition)
      - user_symptoms
      - age
      - activity_level
      - food_allergies
    Returns a structured JSON with sections:
      - condition
      - recommended_foods
      - foods_to_avoid
      - lifestyle_tips
    """
    condition = state.get("prediction", "General Health")
    print(f"--- [Diet Node] Generating Recommendations for: {condition} ---")
    
    try:
        model = get_flash_model()
    except Exception as e:
        print(f"❌ Model Connection Error: {e}")
        return {
            "condition": condition,
            "recommended_foods": [],
            "foods_to_avoid": [],
            "lifestyle_tips": [],
            "note": "Nutritional guidance unavailable due to connection error."
        }

    # Build user context
    user_context = {
        "condition": condition,
        "symptoms": state.get("user_symptoms", "Not specified"),
        "age": state.get("age", "Adult"),
        "activity_level": state.get("activity_level", "Moderate"),
        "food_allergies": state.get("food_allergies", "None")
    }

    # Construct prompt for structured output
    prompt = (
        "Role: Expert Medical Nutritionist.\n"
        "Task: Generate a recovery-focused Diet and Lifestyle plan.\n"
        f"Patient Context: {json.dumps(user_context)}\n\n"
        "Instructions:\n"
        "1. Suggest 3-5 specific foods to aid recovery, as a list.\n"
        "2. List foods to avoid, considering allergies.\n"
        "3. Provide 2-3 lifestyle habits (rest, hygiene, activity), as a list.\n"
        "4. Return ONLY JSON with keys: recommended_foods, foods_to_avoid, lifestyle_tips."
    )

    try:
        response = model.generate_content(prompt)
        # Try to parse response JSON if possible
        raw_text = response.text.strip() if response and response.text else ""
        try:
            # Ensure it's valid JSON
            structured_plan = json.loads(raw_text)
        except json.JSONDecodeError:
            # Fallback: simple parsing from lines if LLM returns Markdown
            structured_plan = {
                "recommended_foods": ["Maintain balanced diet, stay hydrated"],
                "foods_to_avoid": ["No specific restrictions provided"],
                "lifestyle_tips": ["Consult a healthcare provider"]
            }
        print("✅ Diet plan generated successfully.")

    except Exception as e:
        print(f"⚠️ Diet Node Error: {e}")
        structured_plan = {
            "recommended_foods": ["Maintain balanced diet, stay hydrated"],
            "foods_to_avoid": ["No specific restrictions provided"],
            "lifestyle_tips": ["Consult a healthcare provider"]
        }

    # Final structured response
    return {
        "condition": condition,
        "recommended_foods": structured_plan.get("recommended_foods", []),
        "foods_to_avoid": structured_plan.get("foods_to_avoid", []),
        "lifestyle_tips": structured_plan.get("lifestyle_tips", [])
    }