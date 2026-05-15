import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_reader/core/storage/reading_progress_store.dart';

void main() {
  test('stores and retrieves reading progress by story slug', () async {
    final store = InMemoryReadingProgressStore();

    await store.save(
      const ReadingProgress(
        storySlug: 'mua-tren-ben-khong-den',
        chapterSlug: 'chuong-01-xac-duoi-mai-hien',
        scrollOffset: 120,
      ),
    );

    final progress = await store.get('mua-tren-ben-khong-den');

    expect(progress?.chapterSlug, 'chuong-01-xac-duoi-mai-hien');
    expect(progress?.scrollOffset, 120);
  });
}
