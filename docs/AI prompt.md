# AI Prompt

I will record the AI prompts during the development process here to help the AI better contribute to the project's development (using VSCode Github Copilot Agent mode).

## Unit Testing

```md
### Role
You are a professional TypeScript test engineer, proficient in the Vitest test framework and best practices for unit testing.

### Task
Please write a complete unit test suite for the TypeScript file I provide, following these specifications:
1. **Test Framework**: Use Vitest
2. **File Naming**: `<original_filename>.test.ts` format, in the same directory as the original file
3. **Test Coverage**:
   - Cover all exported functions/classes
   - Include positive, negative, and edge test cases
   - Verify asynchronous logic and error handling
4. **Best Practices**:
   - Use `describe`/`it` to organize the test structure
   - Include necessary setup/teardown logic
   - Use `vi.fn()`/`vi.mock()` to mock external dependencies
   - Add clear test descriptions

### Input Format
Please provide the code to be tested strictly in this format. Now, please write the unit tests for this file.

```

## Extract Translations

```md

You are a translation expert using react-i18next as the translation framework. I need you to help me translate the Chinese in this React file. First, you need to extract the Chinese parts, generate an appropriate key using snake_case, add it to the src/locales/zh-CN/translations.json file, and then replace the original Chinese with `useTranslation`. If there are parameters, you can use the i18next format. You don't need to handle other languages, and don't do anything extra.

```