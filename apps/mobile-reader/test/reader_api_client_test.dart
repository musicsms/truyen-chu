import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mobile_reader/core/api/reader_api_client.dart';
import 'package:mobile_reader/features/reader/domain/document_ast.dart';

void main() {
  test('loads stories, chapters, and document AST from Gateway JSON', () async {
    final client = HttpReaderApiClient(
      baseUrl: 'http://server.test/api/v1',
      httpClient: MockClient((request) async {
        return switch (request.url.path) {
          '/api/v1/stories' => utf8Json(
              '{"stories":[{"slug":"mua-tren-ben-khong-den","title":"Mưa Trên Bến Không Đèn","author":"Local","description":"Desc","status":"completed","language":"vi","tags":[],"coverUrl":null,"chapterCount":24}]}',
            ),
          '/api/v1/stories/mua-tren-ben-khong-den/chapters' => utf8Json(
              '{"chapters":[{"storySlug":"mua-tren-ben-khong-den","slug":"chuong-01-xac-duoi-mai-hien","title":"Chương 1: Xác dưới mái hiên","order":1,"wordCount":2386}]}',
            ),
          '/api/v1/stories/mua-tren-ben-khong-den/chapters/chuong-01-xac-duoi-mai-hien' => utf8Json(
              '{"storySlug":"mua-tren-ben-khong-den","chapterSlug":"chuong-01-xac-duoi-mai-hien","title":"Chương 1: Xác dưới mái hiên","order":1,"sourceFormat":"markdown","wordCount":2386,"checksum":"sha256","document":{"version":1,"blocks":[{"id":"b0001","type":"heading","level":1,"children":[{"type":"text","text":"Chương 1: Xác dưới mái hiên"}]},{"id":"b0002","type":"paragraph","children":[{"type":"text","text":"Một "},{"type":"strong","children":[{"type":"text","text":"dòng"}]},{"type":"text","text":" văn."}]}]}}',
            ),
          _ => http.Response('not found', 404),
        };
      }),
    );

    final stories = await client.listStories();
    final chapters = await client.listChapters('mua-tren-ben-khong-den');
    final blocks = await client.getChapterDocument('mua-tren-ben-khong-den', 'chuong-01-xac-duoi-mai-hien');

    expect(stories.single.chapterCount, 24);
    expect(chapters.single.title, 'Chương 1: Xác dưới mái hiên');
    expect((blocks.first as HeadingBlock).text, 'Chương 1: Xác dưới mái hiên');
    expect((blocks[1] as ParagraphBlock).text, 'Một dòng văn.');
  });
}

http.Response utf8Json(String body) {
  return http.Response.bytes(
    utf8.encode(body),
    200,
    headers: {'content-type': 'application/json; charset=utf-8'},
  );
}
