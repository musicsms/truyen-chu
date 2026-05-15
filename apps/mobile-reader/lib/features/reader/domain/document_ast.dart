sealed class DocumentBlock {
  const DocumentBlock({required this.id});

  final String id;

  factory DocumentBlock.heading({
    required String id,
    required int level,
    required String text,
  }) = HeadingBlock;

  factory DocumentBlock.paragraph({
    required String id,
    required String text,
  }) = ParagraphBlock;
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
