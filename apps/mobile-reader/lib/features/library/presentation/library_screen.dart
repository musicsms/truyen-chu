import 'package:flutter/material.dart';

import '../../../core/api/reader_api_client.dart';
import '../../settings/presentation/settings_screen.dart';
import '../../story_detail/presentation/story_detail_screen.dart';

class LibraryScreen extends StatelessWidget {
  const LibraryScreen({
    ReaderApiClient? client,
    super.key,
  }) : client = client ?? const SampleReaderApiClient();

  final ReaderApiClient client;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thư viện'),
        actions: [
          IconButton(
            tooltip: 'Settings',
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const SettingsScreen()));
            },
          ),
        ],
      ),
      body: FutureBuilder<List<StorySummary>>(
        future: client.listStories(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Không tải được thư viện: ${snapshot.error}'));
          }
          final stories = snapshot.data ?? const <StorySummary>[];
          if (stories.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }
          return ListView.separated(
            itemCount: stories.length,
            separatorBuilder: (context, index) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final story = stories[index];
              return ListTile(
                title: Text(story.title),
                subtitle: Text('${story.author} • ${story.chapterCount} chương'),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => StoryDetailScreen(story: story, client: client),
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
