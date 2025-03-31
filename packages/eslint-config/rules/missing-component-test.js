import fs from "fs";
import path from "path";

export default {
  meta: {
    type: "problem", // Тип ошибки
    docs: {
      description: "Проверяет наличие теста для каждого .jsx и .tsx файла",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: null,
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();

        if (filename.endsWith(".test.tsx") || filename.endsWith(".test.jsx")) {
          return;
        }

        // Проверяем, что это tsx или jsx файл
        if (filename.endsWith(".tsx") || filename.endsWith(".jsx")) {
          const testFilename = filename.replace(/\.(tsx|jsx)$/, ".test.$1");

          // Проверяем, что файл с тестами существует
          if (!fs.existsSync(testFilename)) {
            context.report({
              node,
              message: `Для файла "${filename}" нет теста "${testFilename}".`,
            });
          }
        }
      },
    };
  },
};
