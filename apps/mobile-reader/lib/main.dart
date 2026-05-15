import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'core/api/reader_api_client.dart';
import 'features/library/presentation/library_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  runApp(
    ProviderScope(
      child: ReaderApp(
        client: HttpReaderApiClient(baseUrl: 'http://10.0.2.2:8080/api/v1'),
      ),
    ),
  );
}

class ReaderApp extends StatelessWidget {
  const ReaderApp({
    ReaderApiClient? client,
    super.key,
  }) : client = client ?? const SampleReaderApiClient();

  final ReaderApiClient client;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Truyen Chu',
      theme: ThemeData(useMaterial3: true),
      home: LibraryScreen(client: client),
    );
  }
}
