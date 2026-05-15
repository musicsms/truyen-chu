import 'package:flutter/material.dart';

import '../../../core/api/reader_api_client.dart';
import '../../settings/presentation/settings_screen.dart';
import '../../story_detail/presentation/story_detail_screen.dart';

class LibraryScreen extends StatelessWidget {
  const LibraryScreen({super.key});

  static const ReaderApiClient _client = ReaderApiClient(baseUrl: 'http://localhost:8080/api/v1');

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
        future: _client.listStories(),
        builder: (context, snapshot) {
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
                      builder: (_) => StoryDetailScreen(story: story, client: _client),
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
