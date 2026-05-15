import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cài đặt')),
      body: ListView(
        children: const [
          ListTile(
            title: Text('Server'),
            subtitle: Text('http://localhost:8080/api/v1'),
          ),
          ListTile(
            title: Text('Theme'),
            subtitle: Text('Light'),
          ),
          ListTile(
            title: Text('Font size'),
            subtitle: Text('Default'),
          ),
        ],
      ),
    );
  }
}
