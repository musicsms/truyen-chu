import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_reader/main.dart';

void main() {
  testWidgets('renders reader library shell', (tester) async {
    await tester.pumpWidget(const ReaderApp());
    await tester.pump();

    expect(find.text('Thư viện'), findsOneWidget);
    expect(find.text('Mưa Trên Bến Không Đèn'), findsOneWidget);
  });
}
