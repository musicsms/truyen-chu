import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_reader/main.dart';

void main() {
  testWidgets('renders reader app shell', (tester) async {
    await tester.pumpWidget(const ReaderApp());

    expect(find.text('Reader platform'), findsOneWidget);
  });
}
