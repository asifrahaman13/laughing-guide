from src.constants.prompts.prompts import Prompt
from ollama import chat
from ollama import ChatResponse


class OpenAIRepository:
    def __init__(self):
        pass

    def get_llm_response(self, prompt: str, top_suggestions: str) -> str:
        combined_prompt = Prompt.get_prompt()

        for item in top_suggestions:
            combined_prompt += f"\n{item["text"]}\n"

        response: ChatResponse = chat(
            model="llama3.1",
            messages=[
                {"role": "system", "content": combined_prompt},
                {"role": "user", "content": f"The user prompt is: {prompt}"},
            ],
        )
        result = response["message"]["content"]
        return result
