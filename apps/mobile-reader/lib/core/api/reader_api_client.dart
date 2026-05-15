import '../../features/reader/domain/document_ast.dart';

class StorySummary {
  const StorySummary({
    required this.slug,
    required this.title,
    required this.author,
    required this.description,
    required this.chapterCount,
  });

  final String slug;
  final String title;
  final String author;
  final String description;
  final int chapterCount;
}

class ChapterSummary {
  const ChapterSummary({
    required this.storySlug,
    required this.slug,
    required this.title,
    required this.order,
  });

  final String storySlug;
  final String slug;
  final String title;
  final int order;
}

class ReaderApiClient {
  const ReaderApiClient({required this.baseUrl});

  final String baseUrl;

  Future<List<StorySummary>> listStories() async {
    return const [
      StorySummary(
        slug: 'mua-tren-ben-khong-den',
        title: 'Mưa Trên Bến Không Đèn',
        author: 'Local',
        description: 'Một truyện kiếm hiệp trinh thám/noir về oan án, hồ sơ bị sửa, và cái giá của công lý.',
        chapterCount: 24,
      ),
    ];
  }

  Future<List<ChapterSummary>> listChapters(String storySlug) async {
    return List.generate(
      24,
      (index) => ChapterSummary(
        storySlug: storySlug,
        slug: 'chuong-${(index + 1).toString().padLeft(2, '0')}',
        title: 'Chương ${index + 1}',
        order: index + 1,
      ),
    );
  }

  Future<List<DocumentBlock>> getChapterDocument(String storySlug, String chapterSlug) async {
    return [
      DocumentBlock.heading(id: 'b0001', level: 1, text: chapterSlug),
      DocumentBlock.paragraph(
        id: 'b0002',
        text: 'Nội dung chương sẽ được tải từ API Gateway: $baseUrl',
      ),
    ];
  }
}
