const { dirname } = require('path');

function transformImportResolve({ types: t }) {
  function resolver(
    path,
    {
      file: { opts: { filename } },
      opts: { locate },
    }
  ) {
    const { node } = path;
    // path maybe removed by prev instances
    if (!node) return;

    const { value } = node.source;
    const specificImports = [];
    node.specifiers.forEach(spec => {
      if (!t.isImportSpecifier(spec)) return;

      const location = locate(spec.imported.name, value, filename);
      specificImports.push(t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(spec.local.name))],
        t.stringLiteral(location))
      );
    });

    if (specificImports.length) {
      path.replaceWithMultiple(specificImports);
    }
  }

  return {
    visitor: {
      ImportDeclaration: resolver,
    },
  };
}

module.exports = transformImportResolve;
