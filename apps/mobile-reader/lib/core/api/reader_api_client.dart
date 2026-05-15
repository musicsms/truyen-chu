import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../features/reader/domain/document_ast.dart';

class StorySummary {
  const StorySummary({
    required this.slug,
    required this.title,
    required this.author,
    required this.description,
    required this.chapterCount,
  });

  factory StorySummary.fromJson(Map<String, Object?> json) {
    return StorySummary(
      slug: json['slug']! as String,
      title: json['title']! as String,
      author: json['author']! as String,
      description: json['description']! as String,
      chapterCount: json['chapterCount']! as int,
    );
  }

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

  factory ChapterSummary.fromJson(Map<String, Object?> json) {
    return ChapterSummary(
      storySlug: json['storySlug']! as String,
      slug: json['slug']! as String,
      title: json['title']! as String,
      order: json['order']! as int,
    );
  }

  final String storySlug;
  final String slug;
  final String title;
  final int order;
}

abstract class ReaderApiClient {
  Future<List<StorySummary>> listStories();
  Future<List<ChapterSummary>> listChapters(String storySlug);
  Future<List<DocumentBlock>> getChapterDocument(String storySlug, String chapterSlug);
}

class HttpReaderApiClient implements ReaderApiClient {
  HttpReaderApiClient({
    required this.baseUrl,
    http.Client? httpClient,
  }) : _httpClient = httpClient ?? http.Client();

  final String baseUrl;
  final http.Client _httpClient;

  @override
  Future<List<StorySummary>> listStories() async {
    final json = await _getJson('/stories');
    final stories = (json['stories']! as List<Object?>).cast<Map<String, Object?>>();
    return stories.map(StorySummary.fromJson).toList(growable: false);
  }

  @override
  Future<List<ChapterSummary>> listChapters(String storySlug) async {
    final json = await _getJson('/stories/$storySlug/chapters');
    final chapters = (json['chapters']! as List<Object?>).cast<Map<String, Object?>>();
    return chapters.map(ChapterSummary.fromJson).toList(growable: false);
  }

  @override
  Future<List<DocumentBlock>> getChapterDocument(String storySlug, String chapterSlug) async {
    final json = await _getJson('/stories/$storySlug/chapters/$chapterSlug');
    final document = json['document']! as Map<String, Object?>;
    final blocks = (document['blocks']! as List<Object?>).cast<Map<String, Object?>>();
    return blocks.map(DocumentBlock.fromJson).toList(growable: false);
  }

  Future<Map<String, Object?>> _getJson(String path) async {
    final response = await _httpClient.get(Uri.parse('$baseUrl$path'));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ReaderApiException('GET $path failed with HTTP ${response.statusCode}');
    }
    return (jsonDecode(response.body) as Map).cast<String, Object?>();
  }
}

class ReaderApiException implements Exception {
  const ReaderApiException(this.message);

  final String message;

  @override
  String toString() => message;
}

class SampleReaderApiClient implements ReaderApiClient {
  const SampleReaderApiClient();

  @override
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

  @override
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

  @override
  Future<List<DocumentBlock>> getChapterDocument(String storySlug, String chapterSlug) async {
    return [
      DocumentBlock.heading(id: 'b0001', level: 1, text: chapterSlug),
      DocumentBlock.paragraph(id: 'b0002', text: 'Nội dung mẫu để kiểm tra màn đọc.'),
    ];
  }
}
