import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_reader/features/reader/domain/document_ast.dart';
import 'package:mobile_reader/features/reader/presentation/widgets/ast_block_renderer.dart';

void main() {
  testWidgets('renders heading and paragraph blocks', (tester) async {
    final blocks = [
      DocumentBlock.heading(
        id: 'b0001',
        level: 1,
        text: 'Chương 1',
      ),
      DocumentBlock.paragraph(
        id: 'b0002',
        text: 'Nội dung chương.',
      ),
    ];

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: AstBlockRenderer(blocks: blocks),
        ),
      ),
    );

    expect(find.text('Chương 1'), findsOneWidget);
    expect(find.text('Nội dung chương.'), findsOneWidget);
  });
}
