from src.constants.prompts.prompts import Prompt
import google.generativeai as genai


class OpenAIRepository:
    def __init__(self):
        pass

    def get_llm_response(self, prompt: str, top_suggestions: str) -> str:
        combined_prompt = Prompt.get_prompt()

        for item in top_suggestions:
            combined_prompt += f"\n{item["text"]}\n"

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            combined_prompt + f"\n The user prompt is: {prompt}"
        )

        result = response.text

        final = result.strip("\n").strip("sql").strip("\n").strip("`").strip("sql")

        return final
