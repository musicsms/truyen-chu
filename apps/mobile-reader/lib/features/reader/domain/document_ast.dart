sealed class DocumentBlock {
  const DocumentBlock({required this.id});

  factory DocumentBlock.fromJson(Map<String, Object?> json) {
    final type = json['type']! as String;
    return switch (type) {
      'heading' => DocumentBlock.heading(
          id: json['id']! as String,
          level: json['level']! as int,
          text: InlineNode.plainText((json['children']! as List<Object?>).cast<Map<String, Object?>>()),
        ),
      'paragraph' => DocumentBlock.paragraph(
          id: json['id']! as String,
          text: InlineNode.plainText((json['children']! as List<Object?>).cast<Map<String, Object?>>()),
        ),
      'blockquote' => DocumentBlock.blockquote(
          id: json['id']! as String,
          paragraphs: (json['children']! as List<Object?>)
              .cast<Map<String, Object?>>()
              .map((child) => InlineNode.plainText((child['children']! as List<Object?>).cast<Map<String, Object?>>()))
              .toList(growable: false),
        ),
      'divider' => DocumentBlock.divider(id: json['id']! as String),
      _ => throw FormatException('Unsupported document block type: $type'),
    };
  }

  factory DocumentBlock.heading({
    required String id,
    required int level,
    required String text,
  }) = HeadingBlock;

  factory DocumentBlock.paragraph({
    required String id,
    required String text,
  }) = ParagraphBlock;

  factory DocumentBlock.blockquote({
    required String id,
    required List<String> paragraphs,
  }) = BlockquoteBlock;

  factory DocumentBlock.divider({
    required String id,
  }) = DividerBlock;

  final String id;
}

class HeadingBlock extends DocumentBlock {
  const HeadingBlock({
    required super.id,
    required this.level,
    required this.text,
  });

  final int level;
  final String text;
}

class ParagraphBlock extends DocumentBlock {
  const ParagraphBlock({
    required super.id,
    required this.text,
  });

  final String text;
}

class BlockquoteBlock extends DocumentBlock {
  const BlockquoteBlock({
    required super.id,
    required this.paragraphs,
  });

  final List<String> paragraphs;
}

class DividerBlock extends DocumentBlock {
  const DividerBlock({required super.id});
}

class InlineNode {
  static String plainText(List<Map<String, Object?>> nodes) {
    final buffer = StringBuffer();
    for (final node in nodes) {
      final type = node['type']! as String;
      switch (type) {
        case 'text':
          buffer.write(node['text']! as String);
        case 'strong':
        case 'emphasis':
          buffer.write(plainText((node['children']! as List<Object?>).cast<Map<String, Object?>>()));
        default:
          throw FormatException('Unsupported inline node type: $type');
      }
    }
    return buffer.toString();
  }
}
