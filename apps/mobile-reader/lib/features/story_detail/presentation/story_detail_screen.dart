import 'package:flutter/material.dart';

import '../../../core/api/reader_api_client.dart';
import '../../reader/presentation/reader_screen.dart';

class StoryDetailScreen extends StatelessWidget {
  const StoryDetailScreen({
    required this.story,
    required this.client,
    super.key,
  });

  final StorySummary story;
  final ReaderApiClient client;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(story.title)),
      body: FutureBuilder<List<ChapterSummary>>(
        future: client.listChapters(story.slug),
        builder: (context, snapshot) {
          final chapters = snapshot.data ?? const <ChapterSummary>[];
          if (chapters.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }
          return ListView.builder(
            itemCount: chapters.length,
            itemBuilder: (context, index) {
              final chapter = chapters[index];
              return ListTile(
                title: Text(chapter.title),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => ReaderScreen(chapter: chapter, client: client),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
