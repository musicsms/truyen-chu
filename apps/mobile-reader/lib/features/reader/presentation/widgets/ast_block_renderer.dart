import 'package:flutter/material.dart';

import '../../domain/document_ast.dart';

class AstBlockRenderer extends StatelessWidget {
  const AstBlockRenderer({required this.blocks, super.key});

  final List<DocumentBlock> blocks;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: blocks.length,
      itemBuilder: (context, index) {
        final block = blocks[index];
        return switch (block) {
          HeadingBlock(:final text) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(text, style: Theme.of(context).textTheme.headlineMedium),
            ),
          ParagraphBlock(:final text) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(text, style: Theme.of(context).textTheme.bodyLarge),
            ),
        };
      },
    );
  }
}
