module.exports = ({ types: t }) => {
  return {
    visitor: {
      ExperimentalModuleDeclaration(path) {
        let block = path.get('body');
        let body = block.get('body');

        let types = [];
        let values = [];

        let newBody = body.map(item => {
          if (item.isTypeAlias() || item.isInterfaceDeclaration()) {
            let name = item.node.id.name;
            let id = t.identifier(name);
            let object = item.isTypeAlias() ? path.node.right : path.node.body;
            id.typeAnnotation = t.typeAnnotation(object);
            types.push(name);
            return t.declareVariable(id);
          } else {
            let ids = t.getBindingIdentifiers(item.node);
            values = values.concat(Object.keys(ids));
            return item.node;
          }
        });

        let typesComment = {
          type: 'CommentBlock',
          value: `:: ${types.join(', ')}, `
        };

        let properties = values.map(value =>
          t.objectProperty(
            t.identifier(value),
            t.identifier(value)
          )
        );

        properties[0].leadingComments = [typesComment];

        newBody.push(
          t.returnStatement(
            t.objectExpression(properties)
          )
        );

        path.replaceWith(
          t.variableDeclaration('let', [
            t.variableDeclarator(
              path.node.id,
              t.callExpression(
                t.arrowFunctionExpression([],
                  t.blockStatement(newBody)
                ),
                []
              )
            )
          ])
        );
      }
    }
  };
};
