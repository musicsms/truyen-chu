class ReadingProgress {
  const ReadingProgress({
    required this.storySlug,
    required this.chapterSlug,
    required this.scrollOffset,
  });

  final String storySlug;
  final String chapterSlug;
  final double scrollOffset;
}

abstract class ReadingProgressStore {
  Future<void> save(ReadingProgress progress);
  Future<ReadingProgress?> get(String storySlug);
}

class InMemoryReadingProgressStore implements ReadingProgressStore {
  final Map<String, ReadingProgress> _items = {};

  @override
  Future<void> save(ReadingProgress progress) async {
    _items[progress.storySlug] = progress;
  }

  @override
  Future<ReadingProgress?> get(String storySlug) async {
    return _items[storySlug];
  }
}
