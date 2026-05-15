import 'package:flutter/material.dart';

import '../../../core/api/reader_api_client.dart';
import 'widgets/ast_block_renderer.dart';

class ReaderScreen extends StatelessWidget {
  const ReaderScreen({
    required this.chapter,
    required this.client,
    super.key,
  });

  final ChapterSummary chapter;
  final ReaderApiClient client;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(chapter.title)),
      body: FutureBuilder(
        future: client.getChapterDocument(chapter.storySlug, chapter.slug),
        builder: (context, snapshot) {
          final blocks = snapshot.data;
          if (blocks == null) {
            return const Center(child: CircularProgressIndicator());
          }
          return AstBlockRenderer(blocks: blocks);
        },
      ),
    );
  }
}
