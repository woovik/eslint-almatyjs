export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Запрещает импорт из @ozen-ui/kit и заменяет на @ozen-ui/kit/<Component>",
    },
    fixable: "code",
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "@ozen-ui/kit") {
          return;
        }

        const fixes = [];
        const importedNames = [];

        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier") {
            const importedName = specifier.imported.name;
            importedNames.push(importedName);

            fixes.push((fixer) => {
              return fixer.insertTextBefore(
                node,
                `import ${importedName} from '@ozen-ui/kit/${importedName}';\n`
              );
            });
          } else if (specifier.type === "ImportDefaultSpecifier") {
            const localName = specifier.local.name;
            importedNames.push(localName);

            fixes.push((fixer) => {
              return fixer.insertTextBefore(
                node,
                `import ${localName} from '@ozen-ui/kit/${localName}';\n`
              );
            });
          }
        }

        const suggestionPaths = importedNames
          .map((name) => `@ozen-ui/kit/${name}`)
          .join(", ");

        context.report({
          node,
          message: `Импорт из @ozen-ui/kit запрещен. Используй: ${suggestionPaths}`,
          fix(fixer) {
            const removeOriginal = fixer.remove(node);
            return [
              removeOriginal,
              ...fixes.map((fixImport) => fixImport(fixer)),
            ];
          },
        });
      },
    };
  },
};
