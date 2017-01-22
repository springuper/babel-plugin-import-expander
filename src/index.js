const regCache = {};
const getReg = (str) => {
  if (!regCache[str]) {
    regCache[str] = new RegExp(str);
  }
  return regCache[str];
};
const regTplVariable = /\{([^}]+)\}/g;
const genContent = (tpl, data) => (
  tpl.replace(regTplVariable, (match, variable) => data[variable] || '')
);

function transformImportResolve({ types: t }) {
  function resolver(
    path,
    {
      file: { opts: { filename } },
      opts: { condition, template },
    }
  ) {
    const { node } = path;
    // path maybe removed by prev instances
    if (!node) return;

    const source = node.source.value;
    const specificImports = [];
    node.specifiers.forEach((spec) => {
      if (!t.isImportSpecifier(spec)) return;

      const conditions = Array.isArray(condition) ? condition : [condition];
      const isHit = conditions.some(cond => source.match(getReg(cond)));
      if (!isHit) return;

      const location = genContent(template, {
        name: spec.imported.name,
        source,
        filename,
      });
      if (location && location !== source) {
        const declaration = t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier(spec.local.name))],
          t.stringLiteral(location));
        specificImports.push(declaration);
      }
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
